import { async } from 'regenerator-runtime';
import {
	clone,
	uniqId,
	dist,
	fixNum,
	math,
	isArray,
	calData
} from '@/comm/geotools.js'
import comm from '@/comm/comm'

const amapKey = 'daffb83c14428939221e09ebc785c89c',
	cloud = 'https://699d1eb1-ee53-4c66-bddd-06cda80d1231.bspapp.com/',
	api = {
		app: cloud + 'app',
		zz: cloud + 'http/zz'
	},

	toArr = (o) => {
		let a = []
		for (let k in o) {
			a.push(o[k])
		}
		return a
	},
	scan = async (onlyFromCamera = true, scanType = ['qrCode']) => {
		return new Promise((resolve, reject) => {
			uni.scanCode({
				onlyFromCamera,
				scanType,
				success: (e) => {
					resolve(e)
				},
				fail: (e) => {
					reject(e)
				}
			})
		})
	},

	checkNet = async () => {
		return await comm.hadNet()
	},

	uploadImg = async (f) => {
		let imgs = []
		if (f && f.length) {
			for (let i = 0; i < f.length; i++) {
				const e = await uniCloud.uploadFile({
					filePath: f[i],
					cloudPath: 'app_' + (i + 1) + '.jpg',
					onUploadProgress: function (progressEvent) {
						// let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
					}
				})
				imgs.push(e.fileID)
			}
		}
		return imgs
	},
	/**
	 * time:
	 * fmt:格式化以后
	 * utc:
	 */
	time2Date = (time, fmt, utc = 0) => {
		if (!time) time = Date.now() + 1000 * 60 * 60 * utc
		if (typeof time == 'string') time = date2Time(time)
		let n = new Date()
		n.setTime(time)

		let y = n.getFullYear(),
			m = n.getMonth() + 1,
			d = n.getDate(),
			hh = n.getHours(),
			mm = n.getMinutes(),
			ss = n.getSeconds();

		m = m < 10 ? '0' + m : m;
		d = d < 10 ? '0' + d : d;
		hh = hh < 10 ? '0' + hh : hh;
		mm = mm < 10 ? '0' + mm : mm;
		ss = ss < 10 ? '0' + ss : ss;

		if (!fmt) return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
		if (fmt == 'Y-M-D h:m') return y + '-' + m + '-' + d + ' ' + hh + ':' + mm;
		if (fmt == 'Y-M-D h:m:s') return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
		if (fmt == 'M-D h:m') return m + '-' + d + ' ' + hh + ':' + mm;
		if (fmt == 'Y-M-D') return y + '-' + m + '-' + d;
		if (fmt == 'YMD') return y + '' + m + '' + d;
		if (fmt == 'YM') return y + '' + m;
		if (fmt == 'Y') return y;
		if (fmt == 'M') return m;
		if (fmt == 'D') return d;
		if (fmt == 'h:m') return hh + ':' + mm;
		if (fmt == 'h') return hh;
		if (fmt == 'm') return mm
		if (fmt === 'obj') {
			return {
				year: y,
				month: m,
				day: d,
				time: `${hh}:${mm}:${ss}`
			}
		}
		if (fmt == 'CN-ymd') {
			return y + '年' + m + '月' + d + '日'
		}

		if (fmt == 'CN') return y + '年' + m + '月' + d + '日' + ' ' + hh + ':' + mm + ':' + ss + ' ' +
			'星期' + ['日', '一', '二', '三', '四', '五', '六'][n.getDay()];

		return n.getTime()
	},

	date2Time = (d, g = 0) => {
		if (d.length == 10) d += ' 00:00';
		if (d.length == 16) d += ':00';
		let e = d.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/),
			x = () => {
				console.error('时间格式错误=============', d)
				return false
			},
			y, m, n, h, i, s;

		if (!e) {
			return x()
		} else {
			y = Number(e[1])
			m = Number(e[2])
			n = Number(e[3])
			h = Number(e[4])
			i = Number(e[5])
			s = Number(e[6])
		}
		if (y < 1000 || h < 0 || h > 24 || i < 0 || i > 60 || s < 0 || s > 60) return x()
		return Date.parse(new Date(y, m - 1, n, h, i, s))  + 1000 * 60 * 60 * g
	},
	timeFrom = (time = null, format = 'yyyy-mm-dd') => {
		if (typeof time == 'string') time = date2Time(time)
		// 如果为null,则格式化当前时间
		if (!time) time = Number(new Date());
		// 如果time长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
		if (time.toString().length == 10) time *= 1000;
		let timestamp = + new Date(Number(time));

		let timer = (Number(new Date()) - timestamp) / 1000;
		// 如果小于5分钟,则返回"刚刚",其他以此类推
		let tips = '';
		switch (true) {
			case timer < 300:
				tips = '刚刚';
				break;
			case timer >= 300 && timer < 3600:
				tips = parseInt(timer / 60) + '分钟前';
				break;
			case timer >= 3600 && timer < 86400:
				tips = parseInt(timer / 3600) + '小时前';
				break;
			case timer >= 86400 && timer < 2592000:
				tips = parseInt(timer / 86400) + '天前';
				break;
			default:
				// 如果format为false，则无论什么时间戳，都显示xx之前
				if (format === false) {
					if (timer >= 2592000 && timer < 365 * 86400) {
						tips = parseInt(timer / (86400 * 30)) + '个月前';
					} else {
						tips = parseInt(timer / (86400 * 365)) + '年前';
					}
				} else {
					// console.log("默认显示,年月日的方式")
					tips = time2Date(timestamp, 'Y-M-D h:m:s')
				}
		}
		return tips;
	},
	minute2str = (s, f) => {
		if (f) return Math.floor(math((s / 60), 0)).toString() + '小时' + (s % 60 == 0 ? '' : math((s % 60), 0).toString() + '分')
		return (
			(Math.floor(s / 60).toString().length < 2 ? '0' + Math.floor(s / 60).toString() : Math.floor(s / 60).toString()) + ':' + ((s % 60).toString().length < 2 ? '0' + (s % 60).toString() : (s % 60).toString())
		)
	},
	deepTree = (list) => {
		let newList = [],
			map = {}

		list.forEach(e => {
			map[e._id] = e
		})
		list.forEach(e => {
			let parent = map[e.pid]
			if (parent) {
				(parent.children || (parent.children = [])).push(e)
			} else {
				if (!e.pid) {
					newList.push(e)
				}
			}
		})
		const fn = (list) => {
			list.map(e => {
				if (e.children instanceof Array) {
					e.children.sort(zz.compare('createTime'))
					fn(e.children)
				}
			});
		};
		fn(newList)
		return newList.sort(zz.compare('createTime'))
	},
	revDeepTree = (list = []) => {
		let d = []
		const deep = (list) => {
			list.forEach(e => {
				d.push(e)
				if (e.children && isArray(e.children)) {
					deep(e.children)
				}
			})
		}
		deep(list || [])
		return d
	},

	/**
	 * @param {Object} k 键值
	 * @param {Object} n 是否数字
	 * @param {Object} t 是否倒序
	 */
	compare = (k, n=1, t=0) => {
		return function (a, b) {
			if (typeof a == 'object') {
				if (n) {
					return t ? b[k] - a[k] : a[k] - b[k]
				} else {
					return t ? b[k].localeCompare(a[k], 'zh') : a[k].localeCompare(b[k], 'zh')
				}
			} else {
				return a.localeCompare(b, 'zh')
			}
		}
	},

	/**
	 * @param {Object} url 带参链接
	 * @param {Object} key 取特定字段值 
	 * @return Object || Object[key]
	 */
	getQueryParam = (url, k) => {
		let u = url.split('?'),
			arr = u[1].split('&'),
			o = { url: u[0] }

		for (let v of arr) {
			let s = v.split('=')
			o[s[0]] = s[1]
		}

		if (k) return o[k]
		return o
	},

	reGeo = async (loc) => {
		return new Promise((resolve, reject) => {
			uni.request({
				url: 'https://restapi.amap.com/v3/geocode/regeo?key=' + amapKey + '&s=rsv3&language=zh_cn&location=' + loc,
				success: (e) => {
					resolve(e.data.regeocode);
				},
				fail: (e) => {
					console.error("reGeo=================", e);
					reject(e)
				}
			})
		})
	},
	weatherInfo = async (code, ex = 'all') => {
		return new Promise((resolve, reject) => {
			uni.request({
				url: 'https://restapi.amap.com/v3/weather/weatherInfo?s=rsv3&city=' + code + '&extensions=' + ex + '&key=' + amapKey,
				success: (e) => {
					resolve(e.data)
				},
				fail: (e) => {
					console.error("weatherInfo======error", e);
					reject(e)
				}
			})
		})
	}



/**
 * 请求数据处理
 * @param {url,fn,veri, *} args 请求地址,请求参数
 * @param boolean loading 是否显示loading
 * @param boolean veri 是否验证登录
 * return data
 */
async function req(params = {}, loading = false) {
	let fn = params.$fn || 'app',
		veri = params.$veri || false,
		token = zz.getToken(),
		toLogin = () => {
			uni.redirectTo({
				url: '/pages/comm/account/login'
			})
		}

	delete params.$fn
	delete params.$veri

	if (veri && !token) {
		zz.modal('您尚未登录，请授权登录！', (e) => {
			toLogin()
		}, true)
	}
	// console.info('req fu------->' + fn);
	console.info("zz.req ---------------->", params)
	if (loading) uni.showLoading({ mask: true })

	let url = params.$url
	delete params.$url
	
	return new Promise((resolve, reject) => {
		uniCloud.callFunction({
			name: fn || 'app',
			data: {
				url,
				params,
				token
			},
			success(res) {
				const { code, data, message } = res.result
				switch (code) {
					// 成功
					case 1000:
						if(data) comm.setStorage(comm.key(fn+url+JSON.stringify(params)), data)
						resolve(data)
						break
					// 登录失效
					case 1002:
						uni.removeStorageSync('token')
						uni.removeStorageSync('acc');
						zz.toast('登录已失效')
						// reject()
						// return toLogin()
						break
					// 失败
					default:
						reject(res.result);
						zz.toast(message)
				}
			},
			fail(res) {
				zz.toast("服务器错误，请稍后重试")
				reject(res)
			},
			complete() {
				if (loading) uni.hideLoading()
			}
		})
	})
}

/*
   {
	   uid: 		用户id
	   ctime: 		生成时间
	   t:	(eventType)		事件类型		10.登录		20.游览|阅读		30.点赞	  40.收藏	50.分享(海报)	
	   tt	(targetType)	目标类型		2.评论(blog)	10.文章(article) 20.兴趣点()poi	30.商品(goods)	40.路线(trail)	50.赛事活动(event)  
		60.用户（user） 70.动态/帖子moment 100.kml	... 
	   tid:(targetId)		目标id			tt的 _id
   }
   t: 事件类型
   20, 30, {...}
*/
function userEvent(t, tt, o, ref = '_id') {
	let user = zz.getAcc()
	const toLogin = () => {
		uni.redirectTo({
			url: '/pages/comm/account/login'
		})
	}
	if (!user && t!==20) {  // 未登录
		zz.modal('您尚未登录，请登录后操作', (flag) => {
			if(flag){
				return toLogin()
			}else{
				return;
			}
		}, true)
		return;
	}
	let e = {
		$url: t == 20? 'public/zz/view':'user/ue/action',
		t,
		tt,
		tid: o[ref]
	}
	if (t == 20) {
		if(!o.view){
			o.view = 1
		}else{
			o.view++
		}
	}
	if (t == 30) {  // 点赞
		if (!o.isLike) {
			o.like++
			o.isLike = true
			e.inc = 1
		} else {
			o.like--
			o.isLike = false
			e.inc = -1
		}
	}
	if (t == 40) {  // 收藏
		if (!o.isFavor) {
			o.favor++
			o.isFavor = true
			e.inc = 1
		} else {
			o.favor--
			o.isFavor = false
			e.inc = -1
		}
	}
	if (t == 50) {  // 分享
		o.share++
		e.inc = 1
	}

	if (t == 60) {  // 关注用户
		if (o.isFollow) {  // 已经关注的取消关注
			o.isFollow = false
			e.inc = 1
		} else { // 没有关注的则添加关注
			o.isFollow = true
			e.inc = -1
		}
	}

	return new Promise((resolve, rejected) => {
		req(e).then(res => {
			if (res && res.code !== 1000) {
				console.error("userEvent  fail =========", res)
				rejected(err)
			} else {
				resolve(res)
			}
		}).catch(err => {
			console.error("userEvent  fail =========", err)
			rejected(err)
		})
	})
}



const zz = {
	amapKey,
	math,
	fixNum,
	clone,
	toArr,
	dist,
	uniqId,
	isArray,
	calData,

	deepTree,
	revDeepTree,
	
	getQueryParam,
	compare,

	minute2str,
	time2Date,
	date2Time,
	timeFrom,  //个性化时间显示  XX 小时前 XX天前

	req,
	userEvent,
	reGeo,
	weatherInfo,

	scan,
	checkNet,
	uploadImg,
	now() { return Date.now() },
	setAcc(u) { uni.setStorageSync('acc', u) },
	getAcc() { return uni.getStorageSync('acc') },
	setToken(token) { uni.setStorageSync('token', token) },
	getToken() { return uni.getStorageSync('token') },
	async setDept() {
		let { deptId, dept } = this.getDept()
		if (!dept[deptId]) {
			dept[deptId] = await req({ $url: 'public/zz/depts', pid: deptId })
			uni.setStorageSync('sys_dept', dept)
		}
	},
	getDept(arr) {
		let id = uni.getStorageSync('cur_deptId'),
			dept = uni.getStorageSync('sys_dept') || {}
		return { deptId: id, dept, region: arr ? toArr(dept[id]) : dept[id] }
	},



	viewIMG(urls, i = 0) {
		uni.previewImage({
			current: urls[i],
			urls
		})
	},
	toast(title = '出错啦~', duration = 3000, icon = 'none') {
		uni.showToast({
			title,
			icon,
			duration
		})
	},
	modal(content, fn, showCancel = false, title = '提示', confirmColor = '#5677fc', confirmText = '确定') {
		uni.showModal({
			title,
			content,
			showCancel,
			cancelColor: '#555',
			confirmColor,
			confirmText,
			success(res) {
				if (res.confirm) {
					fn && fn(true)
				} else {
					fn && fn(false)
				}
			}
		})
	},
	/**
	 * 
	 * @param {*} url 跳转页面 路径
	 * @param {*} veri   是否需要登录校验
	 * @param {*} animationType  跳转使用的动画
	 * @returns 
	 */
	href(url, v, veri, animationType, t = 'navigateTo') {
		if (['/pages/index/index', '/pages/index/station', '/pages/index/planning', '/pages/index/serve',
			'/pages/index/my'
		].includes(url)) return uni.switchTab({ url })

		if (v) {
			url += '?v=' + encodeURI(JSON.stringify(v))
		}

		if (veri && !zz.getAcc()) {
			zz.modal(
				'尚未登录，点击确定去登录',
				(e) => {
					if (e) zz.href('/pages/comm/account/login',{back:1})
				},
				true
			)
		} else {
			uni[t]({
				url,
				animationType,
				fail: (err) => {
					console.error('路由跳转失败===', err)
				}
			})
		}
	},
	getParam(v) { return JSON.parse(decodeURI(v)) }
}

export default zz
