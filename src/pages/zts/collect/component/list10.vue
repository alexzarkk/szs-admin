<template>
	<cl-crud ref="crud" @load="onCrudLoad" boder>
		<el-row type="flex">
			<view class="flex align-center">
				<div class="icon padding-lr-xs" @click="deptExpand">
					<i class="cursor el-icon-arrow-right" v-if="expand"></i>
					<i class="cursor el-icon-arrow-left" v-else></i>
				</div>
			</view>
			<cl-refresh-btn />
			<el-button type="warning" :disabled="selected.length!=2" size="mini" @click="merge" v-permission="$service.zts.kml.permission.merge">合并</el-button>
			<el-button
				size="mini"
				type="success"
				:disabled="selected.length != 1"
				@click="toMove()"
				v-permission="$service.zts.kml.permission.move"
				>转移</el-button
			>
			<el-button size="mini" :disabled="!selected.length" @click="download()">下载</el-button>
			<el-button v-permission="$service.zts.kml.permission.copy" size="mini" :disabled="selected.length!=1" @click="copy()">复制</el-button>
			<cl-flex1 />
			<cl-filter label="等级">
				<el-select size="mini" v-model="onGrade" @change="refresh">
					<el-option value="" label="全部"></el-option>
					<block v-for="(k, i) of grade" :key="i">
						<el-option :value="k.value" :label="k.label"></el-option>
					</block>
				</el-select>
			</cl-filter>
			
			<!-- <cl-filter label="状态" v-if="status.length>1">
				<el-select
					size="mini"
					v-model="onStatus"
					@change="refresh"
				>
					<el-option value="" label="全部"></el-option>
					<block v-for="(k, i) of st" :key="i">
						<block v-for="(x, j) of status" :key="'1'+j">
							<el-option v-if="x==k.value" :value="k.value" :label="k.label"></el-option>
						</block>
					</block>
				</el-select>
			</cl-filter> -->
			
			<cl-search-key />
			<cl-flex1 />
			<el-button :loading="epxorting" size="mini" type="primary" @click="exportExcel">导出 Excel</el-button>
		</el-row>

		<el-row>
			<cl-table :contextMenu="[]"
				v-loading="loading"
				@selection-change="onSelect"
				:props="{
					'default-sort': {
						prop: 'updateTime',
						order: 'descending'
					}
				}"
				:columns="[
					{
						type: 'selection',
						align: 'center',
						width: '50'
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
						prop: 'grade',
						label: '等级',
						align: 'center',
						sortable: 'custom',
						dict: grade
					},
					{
						prop: 'sn',
						label: '号段',
						align: 'center',
						sortable: 'custom'
					},
					
					{
						prop: 'collectorname',
						label: '采集员',
						align: 'center'
					},
					
					{
						prop: 'startTime',
						label: '采集时间',
						align: 'center',
						sortable: 'custom',
						'min-width': 132
					},
					{
						prop: 'rate',
						label: '数据品质',
						align: 'center',
						'min-width': 132
					},
					{
						prop: 'updateTime',
						label: '更新时间',
						align: 'center',
						sortable: 'custom'
					},
					{
						type: 'op',
						align: 'center',
						width: 150,
						buttons: ['slot-detail', 'slot-report', 'slot-share']
					}
				]"
			>
			<!-- 采集时间 -->
			<template #column-startTime="{ scope }">
				{{ scope.row.startTime.substring(0,16) + ' - ' + scope.row.endTime.substring(11,16)}}
			</template>
			
			<!-- 采集评分 -->
			<template #column-rate="{ scope }">
				<el-rate disabled :value="scope.row.rate" :colors="colors"></el-rate>
			</template>
			<template #slot-detail="{ scope }">
				<el-button type="text" size="mini" @click="detail(scope.row)">详情</el-button>
			</template>
			<template #slot-report="{ scope }">
				<el-button type="text" size="mini" @click="report(scope.row)">审核报告</el-button>
			</template>
			<template #slot-share="{ scope }">
				<el-button type="text" size="mini" @click="share(scope.row)">分享</el-button>
			</template>
			
			</cl-table>
		</el-row>

		<el-row type="flex">
			<cl-flex1 />
			<cl-pagination />
		</el-row>
		<cl-form ref="dept-move"> </cl-form>
		
		<cl-dialog :title="'扫码预览'" :height="'200px'" :width="'240px'" :controls="['close']" :visible.sync="preview">
			<image style="width: 200px; height: 200px;" mode="aspectFill" :src="svg"></image>
		</cl-dialog>
	</cl-crud>
	
</template>

<script>
import { mapGetters } from "vuex";
//var QRCode = require("qrcode-svg");

import { getLable, getDept } from "@/config/dict";
import { kmlGrade, conflict ,prop } from "@/cool/utils/dict"
import { checkPerm } from "@/cool/permission";
import { openWin, timeToDate } from "@/cool/utils"

export default {
	data() {
		return {
			grade: kmlGrade,
			onGrade: '',
			onStatus: 10,
			name: '',
			selected:[],
			dept: getLable(),
			loading:false,
			colors: ['#ffaa7f', '#ffa14f', '#ff5500'],
			
			preview: false,
			svg: 'https://zts.5618.co/static/loadding.gif',
			epxorting: false,
		};
	},
	computed: {
		...mapGetters(['userInfo'])
	},
	props: {
		list: { type: Array },
		ids: { type: Array },
		status: { type: Array },
		expand: { type: Boolean }
	},
	watch: {
		ids: {
			deep: true,
			handler(v) {
				this.refresh()
			}
		}
	},
	mounted(){
		if(this.status.length==1) this.onStatus = this.status[0]
	},
	methods: {
		refresh(e) {
			this.$refs["crud"].refresh({
					type: 9,
					dpids: this.ids,
					page: 1,
					status: this.onStatus,
					grade: this.onGrade,
					name: this.name,
					children: false,
				});
		},
		onCrudLoad({ ctx, app }) {
			ctx.service(this.$service.zts.kml).done();
			app.refresh({
				isoDept: true,
				children: false,
				status: this.onStatus || this.status,
				grade: this.onGrade,
				type: 9
			});
		},
		deptExpand(e){
			this.$emit('update:expand',!this.expand)
		},
		check(e) {
			uni.setStorageSync('collect_check', e._id)
			this.$router.push('/pages/zts/map/map')
		},
		detail(e){
			console.log(e);
			this.check(e)
		},
		report(e){
			uni.setStorageSync('collect_report', e._id)
			openWin("/#/pages/zts/collect/report")
		},
		
		onSelect(e){
			this.selected = e
		},
		merge(){
			let x = this.selected, uid = this.userInfo._id
			if(x[0].status != x[1].status) return this.$message.error('状态错误（数据状态必须相同）！');
			if(!this.userInfo.admin && !checkPerm(this.$service.zts.kml.permission.verify)) {
				if((uid != x[0].userId || uid != x[1].userId) || x[0].userId != x[1].userId) return this.$message.error('没有权限（不能合并他人数据）！');
				if(x[0].status>=10 || x[1].status>=10) return this.$message.error('无法合并已经审核的数据！');
			}
			
			this.$confirm("数据合并是不可逆操作，是否继续？", "高风险提示", {
				type: "warning"
			}).then((res) => {
				if (res === "confirm") {
					this.$service.zts.kml.merge({ ids: x.map(e=> e._id) })
						.then((res) => {
							this.$message.success("合并成功！");
							this.refresh()
						}).catch((err) => {
							this.$message.error(err);
						});
				}
			}).catch(() => null);
		},
		async share(e) {
			if (!this.preview) {
				this.preview = true
				let qrcode = new QRCode({
					content: "https://zts.5618.co/h5/#/pages/share?path=/pages/comm/kml&_id=" + e._id,
					join: true
				});
				let svg = qrcode.svg();
		
				await this.$service.zts.poi.preview({
					file: svg
				}).then(e => {
					this.svg = e
				})
				let t = this
				setTimeout(function() {
					t.$service.space.info.delete({
						url: t.svg
					})
				}, 3000);
			}
		},
		gradename(e) {
			for (let s of this.grade) {
				if(s.value == e) return s.label
			}
		},
		async download() {
			for (let kml of this.selected) {
				await this.$service.zts.placemark.list({ kmlId: kml._id, plain: true }).then(res => {
					kml.children = res
					this.zz.expKml(kml)
				})
			}
		},
		async copy(){
			await this.$service.zts.kml.copy({ _id: this.selected[0]._id }).catch(err=>{
				this.$message.error(err);
			})
			this.refresh()
		},
		
		async exportExcel(){
			this.epxorting = true
			let kml = await this.$service.zts.kml.exportExcel({
															type: 9,
															dpids: this.ids,
															status: this.onStatus,
															grade: this.onGrade,
															name: this.name
														})
			// console.log(kml)
			let heaher = ['属地','区县','等级','编号','名称','采集员','采集时间','轨迹数','长度','平均宽度'],
				column = ['city','district','grade','sn','name','collectorname','time','lineNum','lineLen','avWidth']
			
			let lineInfo = [
							['海拔最高','info.top'],
							['海拔最低','info.bottom'],
							['累计上升','info.up'],
							['累计下降','info.down'],
							['上升长度','info.upLen'],
							['上升坡度','info.upSlop'],
							['上升角度','info.upAngle'],
							['下降长度','info.downLen'],
							['下降坡度','info.downSlop'],
							['下降角度','info.downAngle']
						]
						
			for (let k of lineInfo){
				heaher.push(k[0])
				column.push(k[1])
			}
			for (let k of [11,12,13,101,102,103,104,105,106,110,120]){
				heaher.push(prop[k].name)
				column.push(k)
				heaher.push('')
				column.push(-k)
			}
			for (let k of [20,21,22,23,25,26,27,28,29,40,50]){
				heaher.push(prop[k].name)
				column.push(k)
			}
			heaher.push('不合理项')
			heaher.push('备注')
			column.push('conflict')
			column.push('desc')
			
			// console.log(heaher, column)
			const fliterRow = (e)=>{
				return e.list.map(v =>
					column.map(j => {
						if (j == 'city') {
							let d = getDept(v.departmentId)
							if (d.pid==0) return d.name
							let p = getDept(d.pid)
							return p.name
						}
						if (j == 'district') {
							let d = getDept(v.departmentId)
							return d.name
						}
						if (j == 'grade') return this.gradename(v[j])
						if (j == 'time') return v.startTime.substring(0,16) + ' - ' + v.endTime.substring(11,16)
						if (j == 'lineNum') return e.chart[v._id].line.num
						if (j == 'lineLen') return e.chart[v._id].line.len
						if (j == 'avWidth') return e.chart[v._id].line.avWidth||''
		
						if ((typeof j == "string")&&j.startsWith('info')) {
							return e.chart[v._id].line.info[j.split('.')[1]]
						}
						
						if (j == 'conflict') {
							let cft = ''
							for (let s of v.conflict){
								for (let c of conflict){
									if(s==c.value) cft += ('【'+c.label+'】')
								}
							}
							return cft
						}
						if(typeof(j)=="number") {
							let k = j>0?j:-j
							let t = e.chart[v._id].t[k] || e.chart[v._id].p[k] || {}
							return j>0? (t.num||'') : (t.len||'' )
						}
						return v[j]
					})
				)
			}
			let data = fliterRow(kml)
			
			console.log('data',data)
			await this.zz.expExcel({
					header: heaher,
					data,
					filename: '数据采集统计(已过审)-'+timeToDate('Y-M-D h:m')
				})
			this.epxorting = false;
			
			// import('@/cool/utils/ExportExcel').then(excel => {
			// 	excel.export_json_to_excel({
			// 		header: heaher,
			// 		data,
			// 		filename: '数据采集统计(已过审)-'+timeToDate('Y-M-D h:m')
			// 	});
			// 	this.epxorting = false;
			// });
			
		},
		toMove(e) {
			// console.log(e)
			let kmlId = [],
				dept = this.list
		
			if (!e) {
				kmlId = this.selected[0]._id
			} else {
				kmlId = e._id
			}
		
			this.$refs["dept-move"].open({
				props: {
					title: "部门转移",
					width: "600px",
					"label-width": "80px"
				},
				items: [
					{
						label: "选择部门",
						prop: "dept",
						component: {
							name: "system-user__dept-move",
		
							methods: {
								selectRow(e) {
									this.$emit("input", e);
								}
							},
		
							render() {
								return (
									<div
										style={{
											border: "1px solid #eee",
											"border-radius": "3px",
											padding: " 2px"
										}}>
										<el-tree
											data={dept}
											{...{
												props: {
													props: {
														label: "name"
													}
												}
											}}
											node-key="id"
											highlight-current
											on-node-click={this.selectRow}></el-tree>
									</div>
								);
							}
						}
					}
				],
				on: {
					submit: (data, { done, close }) => {
						if (!data.dept) {
							this.$message.warning("请选择部门");
							return done();
						}
						console.log('data',data,kmlId)
		
						const { name, id } = data.dept;
		
						this.$confirm(`是否将数据转移到部门 ${name} 下`, "提示", {
							type: "warning"
						}).then(() => {
							this.$service.zts.kml.update({   // 更新状态
								departmentId: id,
								_id: kmlId
							}).then(() => {
								this.$message.success("转移成功");
								close();
								this.refresh();
							}).catch((err) => {
								this.$message.error(err);
								done();
							});
						}).catch(() => {});
					}
				}
			});
		},
		
	}
};
</script>
