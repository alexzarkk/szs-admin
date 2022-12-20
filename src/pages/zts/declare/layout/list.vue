<template>
	<!--
			@name:建设申报
			@desc：建设申报的列表
			@date：2021-09-10
			@author: ZK
			@Todo:审核功能实现
	 -->
	<cl-crud ref="crud" @load="onCrudLoad" boder>
		<el-row type="flex">
			<view class="flex align-center">
				<div class="icon padding-lr-xs" @click="deptExpand">
					<i class="cursor el-icon-arrow-right" v-if="expand"></i>
					<i class="cursor el-icon-arrow-left" v-else></i>
				</div>
			</view>
			<cl-refresh-btn />
			<el-button size="mini" type="primary" @click="edit({})">新增</el-button>
			<!-- <el-button size="mini" :loading="epxorting" class="filter-item" type="primary" icon="el-icon-download" @click="download">
				导出 Excel
			</el-button> -->
			<cl-multi-delete-btn>作废</cl-multi-delete-btn>
			<cl-flex1 />
			<cl-filter label="状态">
				<el-select size="mini" v-model="status" @change="refresh">
					<el-option value="" label="全部"></el-option>
					<block v-for="(k, i) of st" :key="i">
						<el-option :value="k.value" :label="k.label"></el-option>
					</block>
				</el-select>
			</cl-filter>
			
			<cl-filter label="类型">
				<el-select style="width: 60px;" size="mini" v-model="grade" @change="refresh">
					<el-option value="" label="全部"></el-option>
					<block v-for="(t, idx) of kt" :key="idx">
						<el-option :value="t.value" :label="t.label"></el-option>
					</block>
				</el-select>
			</cl-filter>
			<cl-search-key />
		</el-row>

		<el-row>
			<cl-table :contextMenu="[]"
				v-loading="loading"
				:props="{
					'default-sort': {
						prop: 'updateTime',
						order: 'descending'
					}
				}" :columns="[
					{
						type: 'selection',
						align: 'center',
						width: '60'
					},
					{
						prop: 'departmentId',
						label: '部门',
						align: 'center',
						dict: dept
					},
					{
						prop: 'name',
						label: '名称',
						align: 'center'
					},
					{
						prop: 'desc',
						label: '备注',
						align: 'center'
					},
					{
						prop: 'user',
						label: '上报人',
						align: 'center'
					},
					{
						prop: 'grade',
						label: '等级类别',
						align: 'center',
						dict: kt
					},
					{
						prop: 'updateTime',
						label: '更新时间',
						align: 'center',
						sortable: 'custom'
					},
					{
						prop: 'status',
						label: '状态',
						align: 'center',
						dict: st
					},
					{
						width:'240',
						label: '操作',
						align: 'center',
						type: 'op',
						buttons: ['slot-pdf','slot-edit', 'slot-draw', 'slot-del','slot-examine']
					}
					
				]">
				<!-- 时间 -->
				<template #column-createTime="{ scope }">
					{{ scope.row.createTime.substring(0, 16) }}
				</template>
				<template #column-updateTime="{ scope }">
					{{ scope.row.updateTime.substring(0, 16) }}
				</template>
				<template #slot-pdf="{ scope }">
					<el-button type="text" size="mini" v-if="scope.row.pdf" @click="pdf(scope.row)">PDF</el-button>
				</template>

				<template #slot-edit="{ scope }">
					<el-button type="text" size="mini" v-if="scope.row.status>-1" @click="edit(scope.row)">编辑</el-button>
				</template>
				<template #slot-draw="{ scope }">
					<el-button type="text" size="mini" @click="draw(scope.row)">详情</el-button>
				</template>
				<template #slot-examine="{ scope }">
					<el-button type="text" size="mini" v-if="scope.row.status>=2&&scope.row.status<10"
						v-permission="$service.zts.kml.permission.verify" @click="toAudit(scope.row)">审核</el-button>
				</template>
				<template #slot-del="{ scope }">
					<block v-if="scope.row.status == -1">
						<el-button type="danger" size="mini" @click="del(scope.row)">删除</el-button>
					</block>
				</template>
			</cl-table>
		</el-row>

		<el-row type="flex">
			<cl-flex1 />
			<cl-pagination />
		</el-row>

		
		<!-- 审核弹框 -->
		<zts-audit :tar="'kml'" :type="'规划申报'" :cur="cur" @refresh="refresh"></zts-audit>

	</cl-crud>
</template>

<script>
	import { mapGetters } from "vuex";
	import { getLable, getCids } from "@/config/dict";
	import { kmlSt, kmlGrade } from "@/cool/utils/dict"
	import { kml2Geo } from "@/cool/utils/kml2Geo"
	import { openWin } from "@/cool/utils"

	export default {
		data() {
			return {
				dept: getLable(),
				grade: 3,
				status:'',
				st: kmlSt,
				kt: [],
				placemark: [],
				epxorting: false,
				loading: false,
				
				cur: {}
			};
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		props: {
			ids: {
				type: Array
			},
			expand: {
				type: Boolean
			}
		},
		watch: {
			ids: {
				deep: true,
				handler(v) {
					this.refresh()
				}
			}
		},
		mounted() {
			let g = this.zz.geo.clone(kmlGrade)
			g.splice(0,1)
			this.kt = g
		},
		methods: {
			refresh(params) {
				console.log(params);
				this.$refs['crud'].refresh({
					dpids: this.ids,
					page: 1,
					name: this.name,
					status: this.status,
					grade: this.grade
				});
			},
			onCrudLoad({ ctx, app }) {
				ctx.service(this.$service.zts.kml).done();
				app.refresh({
					children: false,
					isoDept: true,
					// dpids: this.userInfo.departmentId,
					type: 4
				});
			},
			deptExpand(e) {
				this.$emit('update:expand', !this.expand)
			},
			toAudit(e){
				this.cur = {}
				setTimeout(()=> {this.cur = e}, 10)
			},
			pdf(e){
				openWin(e.pdf.url)
			},
			edit(kml) {
				console.log(kml);
				
				let file,
					items = [
						{
							prop: 'name',
							label: '名称',
							span: 24,
							value: kml.name||'',
							component: {
								name: 'el-input',
								attrs: {
									placeholder: '请输入拟建项目名称'
								}
							},
							rules: {
								required: true,
								message: '名称不能为空'
							}
						},
						
						{
							label: '等级类型',
							prop: 'grade',
							span: 12,
							value: kml.grade || '',
							component: {
								name: 'el-select',
								attrs: { placeholder: '请选择线路类型' },
								options: [{label:"市级主线", value:3}] // this.kt
							},
							rules: {
								required: true,
								message: '类型不能为空'
							}
						},
						
						/* pdf上传 */
						{
							prop: "pdf",
							label: {text: "规划文本", tip:'pdf文件(<100m)'},
							span: 24,
							component: {
								name: "cl-upload",
								props: {
									onUpload: async e => {
										file = e;
										console.log('onUpload', e);
									},
									onRemove: () => {
										file = null;
										if (kml.pdf) {
											this.$service.space.info.delete({ url: kml.pdf.url })
											this.$message.success('文件删除成功！');
											kml.pdf = ''
										}
									},
									value: kml.pdf?kml.pdf.name:'',
									multiple: false,
									fileType: 'pdf'
								}
							},
							rules: {
								required: true,
								message: '规划文本不能为空'
							}
						},
						{
							prop: 'ondate',
							label: '拟建周期',
							span: 24,
							value: kml.ondate||'',
							component: {
								name: 'el-date-picker',
								attrs: {
									type:'daterange',
									'value-format': 'yyyy-MM-dd',
									'start-placeholder': '开建日期',
									'end-placeholder': '完成日期',
								}
							},
							rules: {
								required: true,
								message: '拟建周期不能为空'
							}
						},
						{
							prop: 'desc',
							label: '备注',
							value: kml.desc||'',
							span: 24,
							component: {
								name: 'el-input',
								props: {
									type: 'textarea',
									autosize:true,
									rows: 6
								}
							}
						}
				]
				
				
				if(!kml._id) {
					items.splice(3,0,{
						prop: "kml",
						label: {text: "轨迹文件", tip:'kml文件'},
						span: 24,
						value: '',
						component: {
							name: "cl-upload",
							props: {
								onUpload: async (e)=>{
									let {placemark, geojson} = await kml2Geo(e)
									this.placemark = placemark
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
							required: true,
							message: '轨迹不能为空'
						}
					})
					items.splice(4,0,{
						label: "",
						prop: "all_t1",
						value: 0,
						hidden: ({ scope }) => { return !scope.kml? true:false },
						component: {
							name: "el-checkbox",
							props: {
								label:"导入全部轨迹",
								checked: true
							}
						}
					})
					items.splice(5,0,{
						label: "",
						prop: "all_t2",
						value: 0,
						hidden: ({ scope }) => { return !scope.kml? true:false },
						component: {
							name: "el-checkbox",
							props: {
								label:"导入全部坐标",
								checked: true
							}
						}
					})
					//市级以上
					if(this.ids.length>1){
						items.unshift({
							label: "属地部门",
							prop: "departmentId",
							value:	[],
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
				}
				
				this.$crud.openForm({
					title: kml._id? '编辑': '新增',
					width: '660px',
					props: { "label-width": "122px" },
					items,
					on: {
						load(data, { close, done, submit }) {
							// console.log("窗口打开事件");
						},
						submit: async (data, { close, done }) => {
							delete data.kml
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
							if (file) {
								await this.zz.upload({ filePath: file.path, cloudPath: file.name }).then(url => {
									console.log(url);
				
									data.pdf = { url, name: file.name }
								}).catch(err => {
									this.$message.error(err)
								})
							}else{
								data.pdf = ''
							}
							if(!kml._id) {
								if(this.ids.length==1) {
									data.departmentId = this.ids[0] + ''
								}else{
									data.departmentId = data.departmentId[data.departmentId.length-1] + ''
								}
								data.status = 6
								data.type = 4
								
								// return console.log('form.data',data, this.placemark);
								
								const _id = await this.$service.zts.kml.add({
									...data,
									user: this.userInfo.name,
									placemark: [...pm1,...pm2]
								})
							} else {
								await this.$service.zts.kml.update({
									...data,
									_id: kml._id
								})
							}
							this.placemark = null
							this.$message.success("保存成功")
							this.refresh()
							close()
						},
						close(done) {
							// console.log("窗口关闭事件");
							done();
						}
					}
				})
			},
			draw(e) {
				uni.setStorageSync('collect_check', e._id)
				this.$router.push('/pages/zts/map/map')
			},
			detail(e) {
				uni.setStorageSync('kml', e._id);
				this.$router.push('/pages/zts/track/detail');
			},
			del(e) {
				if (!this.userInfo.admin && this.userInfo._id != e.userId) return this.$message.error(
					"没有权限（删除数据必须由采集员本人操作）！")
				this.$confirm("此操作将永久删除选中数据，是否继续？", "高风险提示", {
					type: "warning"
				}).then((res) => {
					if (res === "confirm") {
						this.loading = true
						this.$service.zts.kml.kill({
								ids: [e._id]
							})
							.then((res) => {
								this.$message.success("删除成功");
								this.loading = false
								this.refresh()
							}).catch((err) => {
								this.$message.error(err);
							});
					}
				}).catch(() => null)
			}
		}
	};
</script>
