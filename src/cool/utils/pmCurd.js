import { clone, revDeepTree, math } from "@/comm/zz"
import { checkPerm } from "@/cool/permission"
import { prop, point, viewElement, kmlGrade, kmlNet, pmSt } from "@/comm/dict.js"

//权限控制
function veri({thiz,kml,user}) {
	if(!thiz) thiz = this
	
	if(!user) user = thiz.userInfo
	if(!kml) kml = thiz.cKml || thiz.kml.cur
	
	// console.log('thiz.veri ------------------',kml);
	
	//自绘路线
	// if(kml.type==2) return true
	
	
	//admin
	if(user.admin) return true
	//环浙主线
	if(kml.type==1||kml.type>20) {
		thiz.$message.error("没有权限！")
		return false
	}
	//审核员
	if(checkPerm(thiz.$service.zts.kml.permission.verify)) return true
	
	if(kml.status>=10) {
		thiz.$message.error("数据已经审核存档，如需修改请联系管理员！")
		return false
	}
	//超级编辑权限
	if(checkPerm(thiz.$service.zts.kml.permission.superEdit)) return true
	
	if(user._id != kml.userId) {
		thiz.$message.error("没有权限（数据修改仅限于本人操作）！")
		return false
	}
	if(kml.status==-1) {
		thiz.$message.error("此数据已作废，如需修改请联系管理员！")
		return false
	}
	return true
}

const dict = {
	level: [
		{
			label: "默认轨迹",
			value: 10
		},
		{
			label: "1级",
			value: 11
		},
		{
			label: "2级",
			value: 12
		},
		{
			label: "3级",
			value: 13
		}
	],
	status: [{
			label: "山林道",
			value: 101
		},
		{
			label: "防火道",
			value: 102
		},
		{
			label: "古道",
			value: 103
		},
		{
			label: "机耕路",
			value: 104
		},
		{
			label: "硬化道",
			value: 105
		},
		{
			label: "连接道",
			value: 106
		},
		{
			label:"绿道",
			value: 110
		},
		{
			label:"水道",
			value: 120
		}
	],
	_type: (t)=>{
		let x = [{ label: "默认轨迹", value: 10 }]
		for (let s of [...dict.level,...dict.status]) {
			if(s.value == t) x.puxh(s)
		}
		return x
	},
	point: ()=>{
		let arr = []
		for (let s of point) {
			arr.push({ label: s.text, value: s.value })
		}
		return arr
	},
	element: ()=>{
		let arr = []
		for (let s of viewElement) {
			arr.push({ label: s.text, value: s.value })
		}
		return arr
	},
	
}

function open({ thiz, act, pm }) {
	if(!veri({thiz})) return
	
	let isEdit = act === 'edit',
		kml = thiz.kml.cur,
		select = thiz.cur.selectedTrack,
		coord = select.coord,
		tip = false,
		t1 = pm.t1 || 1,
		types,
		title
		
console.log('pmCurd.open --------->',pm,act,select)

	const delSection = async()=>{
		let line = clone(thiz.cur.line)
		uniSon(line.coord, select.coord)
	 	await thiz.$service.zts.placemark.update({ _id: line._id,  coord: line.coord ,updateCoord:true})
		thiz.cur.selectedTrack = {
					range:[0, 0],
					open: false,
					old: [0, 0],
					new: [],
					start:0,
					end:100,
					len: 0,
					coord: []
				}
	}

	if (isEdit) {
		title = pm.name
		if (pm.t1 == 1) types = (kml.type==9&&pm.t2==10)?[{ label: "默认轨迹", value: 10 }]:[...dict.level, ...dict.status]
		// if (pm.t1 == 1) types = [...dict.level, ...dict.status]
		if (pm.t1 == 2) types = dict.point()
	} else {
		switch (act) {
			case 'addPoint':
				t1 = 2,
				title = '新增坐标'
				coord = pm.coord
				types = dict.point()
				break;
			case 'addLine':
				t1 = 1,
				title = '新增轨迹'
				coord = pm.coord
				types = pm.type? [...dict.level, ...dict.status]:[...dict.level, ...dict.status]
				break;
			case 'copy':
				t1 = 1,
				tip = true
				title = '复制轨迹'
				types = [...dict.level, ...dict.status]
				break;
			case 'cut':
				t1 = 1,
				tip = true
				title = '剪切轨迹'
				types = [...dict.level, ...dict.status]
				break;
			case 'setLevel':
				t1 = 1,
				tip = true
				title = '路级设定'
				types = dict.level
				break;
			case 'setStatus':
				t1 = 1,
				tip = true
				title = '路况设定'
				types = dict.status
				break;
			case 'del':
				if(coord.length==pm.coord.length) {
					return del({ thiz, pm })
				}
				
				let line = clone(thiz.cur.line)
				const h = thiz.$createElement;
				const hv = [h('span', null, '此操作将永久删除该数据, 是否继续?'),h('br'),h('span', null, '共 '+select.coord.length+' 个坐标点'),h('br')].concat(select.h)
				
				thiz.$msgbox({
					title: '提示',
					message: h('p', null, hv),
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					beforeClose:  async(action, instance, done) => {
						if (action === 'confirm') {
							
							instance.confirmButtonLoading = true
							instance.confirmButtonText = '执行中...'
							await delSection()
							thiz.reset()
							thiz.kmlRefresh()
							thiz.$message.success("操作成功")
							instance.confirmButtonLoading = false
							
							//更新报表
							if(kml.status>=10) thiz.$service.zts.kml.createChart({ _id: kml._id })
							
							done()
						} else {
							done()
						}
					}
				}).then(action => { });
				return
		}
	}
	let items = [{
				prop: "imgs",
				label: "照片",
				span: 24,
				value: isEdit ? (pm.imgs&&pm.imgs.length? pm.imgs.join(','):'') : '',
				component: {
					name: "cl-upload",
					props: {
						multiple: true
					}
				}
			},
			
			{
				prop: 'name',
				label: '名称',
				span: 24,
				value: pm.name || '',
				component: {
					name: 'el-input'
				},
				rules: {
					required: true,
					message: '名称不能为空'
				}
			},
			{
				label: '类型',
				prop: 't2',
				span: 24,
				value: isEdit ? pm.t2 : '',
				component: {
					// 任意组件名，el-button, el-input, cl-upload ...
					name: 'el-select',
					// 只有 name 为：el-select, el-radio-group, el-checkbox-group 可用，作为选项值
					options: types,
					// 带入参数
					props: {
						clearable: false
					},
					// 监听事件
					on: {
						change: (val) => {
							// 注意使用箭头函数
							// console.log(val)
						}
					}
				},
				rules: {
					required: true,
					message: '类型不能为空'
				}
			},
			
			{
				prop: 'desc',
				label: '备注说明',
				value: isEdit ? pm.desc : '',
				span: 24,
				component: {
					name: 'el-input',
					props: {
						type: 'textarea',
						rows: 4
					}
				}
			},
			{
				prop: "tips",
				hidden: !tip,
				component: () => {
					return thiz.cur.selectedTrack.h
				}
			}
		]
	if(t1==1){
		items.splice(3,0,{
					label: '平均宽度m',
					prop: 'avWidth',
					span: 12,
					value: pm.avWidth || 1,
					component: {
						name: 'el-input-number',
						props: {
							step: 0.1,
							min: 0.5,
							max: 10,
							precision:2
						}
					},
					rules: {
						required: true,
						message: '平均宽度不能为空'
					}
				})
		items[2].span = 12
	}
	if(t1==2) {
		items.splice(3,0,{
					label: '经度',
					prop: 'lng',
					span: 12,
					value: pm.coord[0],
					component: {
						// name: 'el-input',
						name: 'el-input-number',
						props: {
							step: 0.1,
							min: -180,
							max: 180,
							precision: 6
						}
					},
					rules: {
						required: true,
						message: '经度不能为空'
					}
				})
		items.splice(4,0,{
					label: '维度',
					prop: 'lat',
					span: 12,
					value: pm.coord[1],
					component: {
						name: 'el-input-number',
						props: {
							step: 0.1,
							min: -85,
							max: 85,
							precision: 6
						}
					},
					rules: {
						required: true,
						message: '维度不能为空'
					}
				})
	}
	if(kml.type==6) {
		items = [
			{
				prop: 'name',
				label: '名称',
				span: 24,
				value: pm.name || '',
				component: {
					name: 'el-input'
				},
				rules: {
					required: true,
					message: '名称不能为空'
				}
			}, {
				prop: "grade",
				label: "等级",
				span: 12,
				value: pm.grade,
				component: {
					name: "el-select",
					attrs: {
						placeholder: "请选择等级"
					},
					options: kmlGrade
				},
				rules: [
					{
						required: true,
						message: "等级不能为空"
					}
				]
			},
			{
				prop: "sn",
				label: "路段",
				span: 12,
				value: pm.sn ||'',
				component: {
					name: "el-select",
					attrs: {
						placeholder: "请选择路段"
					},
					options: kmlNet
				}
			},
			{
				prop: "status",
				label: "状态",
				span: 12,
				value: pm.status,
				component: {
					name: "el-select",
					attrs: {
						placeholder: "请选择状态"
					},
					options: pmSt
				},
				rules: [
					{
						required: true,
						message: "状态不能为空"
					}
				]
			},
			{
				label: '编号',
				prop: 'num',
				span: 12,
				value: pm.num,
				component: {
					name: 'el-input-number',
					props: {
						step: 1,
						min: 1,
						max: 100
					}
				},
				rules: {
					required: true,
					message: '编号不能为空'
				}
			},
			{
				prop: 'desc',
				label: '备注说明',
				value: pm.desc || '',
				span: 24,
				component: {
					name: 'el-input',
					props: {
						type: 'textarea',
						rows: 4
					}
				}
			},
		
		]
		
	}
	
	let form = thiz.$crud.openForm({
		title: title,
		width: "600px",
		items: items,
		on: {
			load(data, {
				close,
				done,
				submit
			}) {
				console.log("窗口打开事件");
			},
			submit: async (data, { close, done }) => {
				
				// console.log(data.imgs);
				if(typeof data.imgs == 'string') data.imgs = data.imgs? data.imgs.split(',') : []
				
				// console.log(data)
				if(t1==2) {
					coord = [data.lng,data.lat,pm.coord[2]]
					delete data.lng
					delete data.lat
				}
				
				if (!isEdit) {
					if(data.t2==29) {
						// done()
						if(kml.type==9){
							thiz.$message.warning("指引柱请在现场采集，后补可能造成角度错误！")
							let time = await thiz.$service.common.serveTime()
							data.curTime = time
						}
						data.direction = [{angle:[0,-1],target:[]}]
						data.curDrect = 0
						data.curName = ""
					}
					
					// return console.log(JSON.stringify(data),kml);
					await thiz.$service.zts.placemark.add({
						...data,
						t1,
						coord,
						kmlId: kml._id
					}).catch((err) => {
						thiz.$message.error(err);
					})
					if(act=='cut') {
						await delSection()
					}
				} else {
					let newObj = {
							_id: pm._id,
							imgs: data.imgs,
							name: data.name,
							t2: data.t2,
							// curTime: timeToDate('Y-M-D h:m'),
							desc: data.desc
						}
					if(kml.type==40) {
						newObj.grade = data.grade
						newObj.sn = data.grade
						newObj.status = data.status
						newObj.num = data.num
					}
					
					if(data.t1==1) {
						newObj.avWidth = data.avWidth
					} else {
						newObj.coord = coord
					}
					
					await thiz.$service.zts.placemark.update(newObj).then(e=>{
						thiz.$message.success("保存成功")
					}).catch((err) => {
						thiz.$message.error(err);
					})
				}
				
				//更新报表
				if(kml.status>=10) thiz.$service.zts.kml.createChart({ _id: kml._id })
				
				thiz.reset()
				thiz.kmlRefresh()
				
				thiz.cur.selectedTrack = {}
				// thiz.$refs.mousetool.clear('markTool')
				try{ thiz.$refs.mousetool.clearAll() }catch(e){ }
				close()
			},
			close(done) {
				let imgs = form.getForm().imgs
				if (!isEdit && imgs != '') {
					thiz.$service.space.info.delete({ url: imgs })
				}
				try{ thiz.$refs.mousetool.clearAll() }catch(e){ }
				done();
			}
		}
	});
}


function del({ thiz, pm }) {
	if(!veri({thiz})) return
	thiz.$confirm("此操作将永久删除选中数据，是否继续？", "高风险提示", {
		type: "warning"
	}).then((res) => {
		if (res === "confirm") {
			let track = revDeepTree(thiz.kml.list),t10=0
			for (let s of track) {if(s.t1==1&&s.t2==10)t10+=1}
			if(thiz.kml.cur.type==9&&pm.t2==10&&t10<2) return thiz.$message.error("必须包含一条默认轨迹！")
			
			thiz.$service.zts.placemark.delete({ ids: pm._id, delImg: thiz.kml.cur.type == 9 })
				.then((res) => {
					thiz.$message.success("删除成功");
					
					thiz.reset()
					
					thiz.kmlRefresh(false)
					
					if(thiz.kml.cur.status>=10) thiz.$service.zts.kml.createChart({ _id: thiz.kml.cur._id })
					
					// resolve(res);
				})
				.catch((err) => {
					thiz.$message.error(err);
					// reject(err);
				});
		}
	}).catch(() => null);
}

function merge(){
	if(!veri({thiz:this})) return
	let pm = revDeepTree(this.kml.list),
		cur = this.cur.line,
		res = [],
		targets =[],
		target;
	
	const h = this.$createElement;
	const hv = [
			h('i', { style: 'color: teal' }, '【'+cur.name +'】'+ cur.info.len+'m'),
			h('br'),
			h('i', { style: 'color: orange' }, '轨迹合并为不可逆操作，请先做好轨迹下载备份'),
			h('br')
		]
		
	for (let s of pm) {
		if(s.t1==1 && s._id!=cur._id) targets.push({ value: s._id, label: s.name })
	}
	
	let items = [
			{
				prop: "tips",
				component: () => {
					return hv
				}
			},
			{
				label: '合并对象',
				prop: 't2',
				span: 24,
				value: '',
				component: {
					name: 'el-select',
					options: targets,
					props: {
						clearable: true
					},
					attrs: {
						placeholder: "请选择要合并的对象"
					},
					on: {
						change: (val) => {
							// 注意使用箭头函数
							console.log(val)
							for (let s of pm) {
								if(s._id==val) {
									target = s
									res = [h('i', { style: 'color: black' }, '【'+s.name +'】'+ s.info.len+'m'),
									h('br'),
									h('i', { style: 'color: black' }, '合并后长度：' + (cur.info.len + s.info.len)+'m')]
								}
							}
						}
					}
				},
				rules: {
					required: true,
					message: '合并对象不能为空'
				}
			},
			{
				prop: "tips",
				component: () => {
					return res
				}
			}
		]
	this.$crud.openForm({
		title: '轨迹合并',
		width: "500px",
		items: items,
		on: {
			load(data, { close, done, submit }) {
				console.log("窗口打开事件");
			},
			submit: async (data, { close, done }) => {
				await this.$service.zts.placemark.merge({
					ids: [cur._id, target._id]
				})
				if(this.kml.cur.type==9 && this.kml.cur.status>=10) {
					await this.$service.zts.kml.createChart({ _id: this.kml.cur._id })
				}
				this.reset()
				this.$message.success("保存成功")
				this.kmlRefresh()
				close()
			},
			close(done) {
				console.log("窗口关闭事件");
				done();
			}
		}
	})
}

function kmlChart(kml){
	let chart = {
		line: {num: 0, len: 0, pic: 0},
		poi: {num: 0, pic: 0},
		lenType: 0,
		lenLevel: 0,
		t:{},
		p:{}
	}
	let placemark = revDeepTree(kml)
	for (let pm of placemark) {
		if(pm.t1 == 1 && pm.t2 > 9) {
			let info = pm.info
			chart.line.pic += pm.imgs? pm.imgs.length : 0
			if(pm.t2 && pm.t2>10){
				if(!chart.t[pm.t2]) chart.t[pm.t2] = {num: 0, len: 0, pic: 0}
				chart.t[pm.t2].num ++
				chart.t[pm.t2].len += info.len
				chart.t[pm.t2].pic += pm.imgs? pm.imgs.length : 0
				
				if(pm.t2>100){
					chart.lenType += info.len*1
				} else{
					chart.lenLevel += info.len*1
				}
			} else {
				chart.line.num ++
				chart.line.len += info.len
			}
		}
		if(pm.t1 == 2) {
			chart.poi.num ++
			chart.poi.pic += pm.imgs? pm.imgs.length : 0
			if(pm.t2 && pm.t2>0){
				// if(!chart.poi[pm.t2]) chart.poi[pm.t2] = 0
				if(!chart.p[pm.t2]) chart.p[pm.t2] = {num: 0, pic: 0}
				
				// chart.poi[pm.t2] ++
				chart.p[pm.t2].num ++
				chart.p[pm.t2].pic += pm.imgs? pm.imgs.length : 0
			}
		}
	}
	
	const n = (s,x,t)=>{return chart[x][s]? chart[x][s][t]:''}
	const line = (arr)=>{
		let t = []
		for (let s of arr) {
			t.push({
				v:s,
				name: prop[s].name,
				num: n(s,'t','num'),
				len: math(n(s,'t','len') / 1000, 2) || '',
				pic: n(s,'t','pic')
			})
		}
		return t
	}
	chart.kLevel = line([11,12,13])
	chart.kType = line([101,102,103,104,105,106,110,120])
	let poi = clone(point)
	for (let s of poi) {
		s.num = n(s.value,'p','num')
		s.pic = n(s.value,'p','pic')
	}
	chart.poi = poi
	
	return chart
}

function uniSon(arr, tar) {
	let idx = []
	arr.forEach((s, i) => {
		let count = 0
		for (let t of tar) {
			if (s[0] == t[0] && s[1] == t[1]) count++
		}
		if (count > 0) { //内层循环结束，当count>0,说明此索引为对象是重复的
			idx.push(i)
		}
	})
	let flag = -1
	for (var i = 0; i < idx.length; i++) { //删除一次，索引位
		flag++
		if (flag == 0) {
			arr.splice(idx[i], 1)
		} else {
			arr.splice(idx[i] - flag, 1) // 每次删除，需要删除的索引位就要减去1
		}
	}
	return arr
}

const pmCurd = {
	open,
	dict,
	del,
	kmlChart,
	veri,
	merge
}

module.exports = pmCurd
