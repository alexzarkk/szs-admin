import { kml2Geo } from "@/cool/utils/kml2Geo"
// import {store} from

export async function upload({ kml, e, kt, fn, tip, form}, opt={width: "660px"}) {
	// console.log(kt)
	// console.log(this.userInfo,this.$store.getters.dict);
	let dict = this.$store.getters.dict
	let items = fn?[] : form?form:[{
								prop: 'name',
								label: '名称',
								span: 24,
								value: kml? kml.name:'',
								component: {
									name: 'el-input'
								},
								rules: {
									required: true,
									message: '名称不能为空'
								}
							}]
	if(kt&&kt.length>1) items.push({
				label: "类型",
				prop: "type",
				value: kml? kml.type : '',
				component: {
					name: "el-select",
					attrs: {
						placeholder: "请选择轨迹类型"
					},
					options: kt
				},
				rules: {
					required: true,
					message: '类型不能为空'
				}
			})
	
	//市级以上
	if(!kml&&e.ids&&e.ids.length>1) {
		items.unshift({
			label: "属地部门",
			prop: "departmentId",
			value: kml? kml.departmentId : '',
			component: {
				name: "cl-dept-cascader",
				methods: {
					selectRow(x) {
						this.$emit("input", x);
					}
				},
			},
			rules: {
				required: true,
				message: '部门不能为空'
			}
		})
	}
	if(!kml) items.unshift({
				prop: "kml",
				label: {text: "轨迹文件", tip:'kml文件'},
				span: 24,
				value: kml? kml.kml: '',
				component: {
					name: "cl-upload",
					props: {
						onUpload: async (e)=>{
							let {placemark, geojson} = await kml2Geo(e)
							this.placemark = placemark
							console.log(this.placemark)
							this.$notify({
							  title: '文件信息',
							  dangerouslyUseHTMLString: true,
							  message: '<strong>包含 <i>'+geojson.line+'</i> 条轨迹</strong></br><strong><i>'+geojson.point+'</i> 个坐标</strong>'
							});
						},
						onRemove: ()=> {
							this.placemark = null
						},
						multiple: false,
						fileType: 'kml'
					}
				},
				rules: {
					required: e.coord,
					message: '轨迹不能为空'
				}
			})
					
	items.splice(1,0,{
						label: "",
						prop: "all_t1",
						value: 0,
						hidden: ({ scope }) => {
							return !scope.kml? true:false
						},
						component: {
							name: "el-checkbox",
							props: {
								label:"导入全部轨迹",
								checked: true
							},
						}
					})
	items.splice(2,0,{
						label: "",
						prop: "all_t2",
						value: 0,
						hidden: ({ scope }) => {
							return !scope.kml? true:false
						},
						component: {
							name: "el-checkbox",
							props: {
								label:"导入全部坐标",
								checked: true
							},
						}
					})
	
	// if(form) { items = items.concat(form) }
	if(kt) items.push({
				prop: 'desc',
				label: '备注',
				value: kml? kml.desc:'',
				span: 24,
				component: {
					name: 'el-input',
					props: {
						type: 'textarea',
						autosize:true,
						rows: 4
					}
				}
			})
	if (tip) {
		items.push({
					prop: "tips",
					component: () => {
						return tip
					}
				})	
	}
	//制图
	if(kt==40) {
		items = [...items,
					{
						prop: "grade",
						label: "等级",
						span: 12,
						value: 1,
						component: {
							name: "el-select",
							attrs: {
								placeholder: "请选择等级"
							},
							options: dict.kmlGrade
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
						component: {
							name: "el-select",
							attrs: {
								placeholder: "请选择路段"
							},
							options: dict.kmlNet
						},
					},
					{
						label: '编号',
						prop: 'num',
						span: 12,
						value: '',
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
					}
				]
	}
	
	
	// console.log(opt);
	this.$crud.openForm({
		title: kml? '编辑': '新增',
		...opt,
		items,
		on: {
			load(data, { close, done, submit }) {
				// console.log("窗口打开事件");
			},
			submit: async (data, { close, done }) => {
				delete data.kml
				if(kt&&kt.length==1) data.type = kt[0].value
				
				let pm1=[],pm2=[]
				if(this.placemark) {
					for (let s of this.placemark) {
						if(data.all_t1&&s.t1==1) pm1.push(s)
						if(data.all_t2&&s.t1==2) pm2.push(s)
					}
					if(pm1.length>=100){
						done()
						return this.$message.error("单次上传最多允许100条轨迹！")
					}
					if(pm2.length>=800){
						done()
						return this.$message.error("单次上传最多允许500个坐标！")
					}
					delete data.all_t1
					delete data.all_t2
				}
				
				if(fn) {
					await fn([...pm1,...pm2], data)
				} else {
					if(!kml) {
						if(e.ids.length==1) {
							data.departmentId = e.ids[0] + ""
						}else{
							data.departmentId = data.departmentId[data.departmentId.length-1] + ""
						}
						//如果是申报路线
						if(data.type==3||data.type==4) data.stauts = 6
						
						const kmlId = await this.$service.zts.kml.add({ ...data })
						
						for(let pm of [...pm1,...pm2]) {
							await this.$service.zts.placemark.add({
								...pm,
								kmlId
							})
						}
						
					} else {
						await this.$service.zts.kml.update({
							...data,
							_id: kml._id
						})
					}
					this.placemark = null
					this.$message.success("保存成功")
					this.refresh()
				}
				close()
			},
			close(done) {
				// console.log("窗口关闭事件");
				done();
			}
		}
	})
}