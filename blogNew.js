'use strict';

const table = 'zts_blog'
const ref = "tid"
/**
 *     主评论：
		{
			_id:
			userId:
			tt: 内容的类型id
			tid:回复的文章、动态等内容的id
			createTime:
			content:
			imgs:
			like: 点赞数量
			status:评论状态   0：已发布  1: 已审核 2：审核未通过
		}
		前端传参:
		{
			content:  内容
			imgs: 图片
			tt:  评论内容类型
			tid: 评论内容 Id
		}

		子评论:
			{
				_id:
				userId:评论人的id  查询出头像和昵称
				tt:  内容类型
				tid: 内容id
				pid: 主评论的 _id
				content:  评论内容
				imgs:  评论的图片
				like: 点赞数量
				status:评论状态 
			}
			前端传参
			{
				pid:回复的评论的id
				tt:'',
				tid:'',
				content评论内容
				imgs:评论图片
			}

			// 四种类型的评论跳转到详情
			1. zz-blog 的主评论   直接通过 tt+tid定位
			2. zz-blog 的子评论   带pid的也直接通过tt + tid 定位

			1. zz-comment 的主评论 tt+tid定位
			2. zz-comment 的子评论 tt = 2   pid当成主评论id跳转到评论详情页
 */
const ueTable = 'ue'
const read = require("read");
module.exports = {
	// 新增评论
	async add(params) {
		const { db, currentUser, utils } = this.ctx;
		const append = {
			userId: currentUser.userId,
			like: 0, // 初始化点赞的数量， 0 
			status: 0 // 审核状态 
		}
		Object.assign(params, append)
		const res = await db.add(table, params)
		params._id = res.id
		// if (params.tid) {  // 对文章的评论回复

		// }
		if (params.pid) {  // 对评论的回复  只有对评论的回复才有pid
			await db.addCache(params, table, 'pid') // 刷新redis缓存
		} else {  // 对内容的回复
			await db.addCache(params, table, 'tid') // 刷新redis缓存
		}
		console.log("插入的评论的参数=========", params)
		return res
	},
	/**
	 * 获取主评论的子评论
	 * @param {Object} params 主评论  
	 * @param {Boolean} needInfo  是否需要子评论的用户信息  删除的时候不需要用户信息
	 * @returns 
	 */
	async getPidList(params, needInfo = true) {
		if (!params._id) {
			throw new Error("评论获取失败")
		}
		const { db, services, currentUser } = this.ctx;
		let list = await db.list(table, { pid: db.command.eq(params._id) }, true, table + 's' + params._id) // 查询子评论列表
		if (needInfo) {
			list = await read.userInfo.call(this, list, ['_id', 'nickName', 'name', 'headImg'])
		}
		for (let comment of list) {
			if (comment.rid) {  // 是对评论的回复的回复,则查询回复对象的信息
				comment.replayInfo = await this.ctx.services.sys.user.getUserInfo({
					userId: comment.rid
				})
				comment.rName = comment.replayInfo.nickName
			}
		}

		if (currentUser) {
			for (let comment of list) {
				// const commentDetails = await db.info(table, comment.pid)
				// const replyInfo = await db.info("sys_user", commentDetails.userId)
				// comment.rid = replyInfo._id
				// comment.rName = replyInfo.nickName
				comment.isLike = await services.app.ue.isLike(comment._id)  // 查询子评论点赞状态
			}
		}
		params.children = list  // 挂载子评论
		return params

	},
	/**
	 * 查询内容的评论列表
	 * 主评论+子评论list
	 * @param {*} params 
	 * @returns 
	 */
	async list(params) {
		const { db, services, currentUser } = this.ctx;
		let list = await db.list(table, { tid: db.command.eq(params.tid) }, true, table + 's' + params.tid)   // 找到所有的评论列表
		for (let comment of list) {
			if (currentUser) {  // 登录的去查询点赞状态
				comment.isLike = await services.app.ue.isLike(comment._id)  // 查询所有的评论的点赞状态
			}
			comment = await this.getPidList(comment) // 加入子评论
		}
		await read.userInfo.call(this, list, ['_id', 'nickName', 'name', 'headImg'])
		return list
	},
	// 更新评论缓存
	async updateCache(obj) {
		const { db } = this.ctx;
		try {
			if (obj.tid) {  // 主评论点赞
				await db.updateCache(obj, table, 'tid')
			} else {  // 子评论点赞
				await db.updateCache(obj, table, 'pid')
			}
		} catch (err) {
			console.error("点赞更新异常===========", err)
		}
	},
	// 查看评论详情
	async info(params) {
		const { db, services, currentUser } = this.ctx;
		let mainComment = await db.info(table, params._id);  // 查询主评论
		mainComment.userInfo = await services.sys.user.getUserInfo({ userId: mainComment.userId })  // 加入评论人信息
		if (currentUser) {
			mainComment.isLike = await services.app.ue.isLike(mainComment._id)  // 主评论点赞状态
		}
		mainComment = await this.getPidList(mainComment)  // 加入子评论
		return mainComment
	},
	// 删除单个评论
	async delete(params) {
		const { db } = this.ctx;
		// 1. 找到当前的评论，查看是否有子集
		let comment = await db.info(table, params._id);
		if (!comment) {
			throw new Error("删除失败，未找到对应评论")
		}
		if (comment.imgs && comment.imgs.length > 0) {  // 删除图片
			const delImgRes = await uniCloud.deleteFile({ fileList: comment.imgs });
		}
		let ids = [comment._id]
		// 主评论删除结果，子评论删除结果
		if (comment.tid) { // 父评论
			let allList = await this.getPidList(comment, false)
			for (let c of allList.children) {  // 加入子评论的_id
				ids.push(c._id)
			}
			await db.delCache(comment, table, 'tid') // 删除当前评论的缓存 = 刷新当前缓存	
			await db.redis.del(table + 's' + comment._id); // 删除子评论的缓存列表
		} else { // 子评论
			await db.delCache(comment, table, 'pid') // 删除当前评论的缓存 = 刷新当前缓存	
		}
		// Todo: 删除的评论在  我的点赞记录里面：此评论已删除！
		const res = await db.delete(table, ids, false);
		return res
	}
	// Todo:批量删除一个内容的评论
}
