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
				<el-button size="mini" type="primary" @click="edit(false)">新增</el-button>
				<el-button size="mini" type="success" @click="toMove()" :disabled="!selected.length">转移</el-button>
				<cl-multi-delete-btn>作废</cl-multi-delete-btn>
				<cl-flex1 />
				<el-button :disabled="!selected.length" :loading="epxorting" size="mini" type="primary" @click="exportExcel">导出 Excel</el-button>
				<cl-search-key />
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
							label: '绘制人',
							align: 'center'
						},
						{
							prop: 'createTime',
							label: '创建时间',
							align: 'center',
							sortable: 'custom'
						},
						{
							prop: 'updateTime',
							label: '更新时间',
							align: 'center',
							sortable: 'custom'
						},
						{
							label: '操作',
							align: 'center',
							type: 'op',
							buttons: ['slot-edit', 'slot-draw','slot-share', 'slot-del']
						}
						
					]"
				>
					
					<!-- 部门 -->
					<!-- <template #column-departmentId="{ scope }">
						{{ CodeToText[scope.row.departmentId] }}
					</template>
					 -->
					 
					<!-- 时间 -->
					<template #column-createTime="{ scope }">
						{{ scope.row.createTime.substring(0, 16) }}
					</template>
					<template #column-updateTime="{ scope }">
						{{ scope.row.updateTime.substring(0, 16) }}
					</template>
					
					
					<template #slot-edit="{ scope }">
						<el-button type="text" size="mini" @click="edit(scope.row)">编辑</el-button>
					</template>
					<template #slot-draw="{ scope }">
						<el-button type="text" size="mini" @click="draw(scope.row)">绘制</el-button>
					</template>
					<template #slot-detail="{ scope }">
						<el-button type="text" size="mini" @click="detail(scope.row)">详情</el-button>
					</template>
					<template #slot-share="{ scope }">
						<el-button type="text" size="mini" @click="share(scope.row)">分享</el-button>
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
			
			<cl-dept-move v-if="moveDept" :ids="selected.map(e=>{return e._id})" @moved="moved"> </cl-dept-move>
			
			<el-dialog title="扫码预览" center :visible.sync="preview" :width="'240px'">
			    <zz-qrcode :url="shareUrl"></zz-qrcode>
			</el-dialog>
			
		</cl-crud>
</template>

<script>
import { upload } from '@/cool/utils/uploadKml.js';
// import { dept } from "@/comm/dict"
// import { prop } from "@/cool/utils/dict"
// import { openWin } from "@/cool/utils"

// const { CodeToText } = require('element-china-area-data/dist/app.commonjs')

export default {
	data() {
		return {
			// CodeToText,
			dept: this.$store.getters.deptLabel,
			name: '',
			selected:[],
			epxorting: false,
			loading:false,
			
			moveDept: false,
			preview: false,
			shareUrl: '',
		};
	},
	props: {
		userInfo: { type: Object },
		ids: { type: Array },
		expand: { type: Boolean}
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
		console.log(this.$store.getters.userInfo);
	},
	
	methods: {
		refresh(params) {
			this.openMove = false
			this.$refs['crud'].refresh({
				dpids: this.ids,
				page: 1,
				name: this.name,
				children: false,
				type: 2
			});
		},
		onCrudLoad({ ctx, app }) {
			ctx.service(this.$service.zts.kml).done();
			app.refresh({
				children: false,
				isoDept: true,
				type: 2
			});
		},
		deptExpand(e){
			this.$emit('update:expand',!this.expand)
		},
		onSelect(e){
			this.selected = e
		},
		edit(kml) {
			upload.call(this, { kml , e:{coord:false, ids: dept.getCids(this.userInfo.departmentId)}, kt: [{label:"绘制草稿", value:2}] })
		},
		draw(e) {
			uni.setStorageSync('collect_check', e._id)
			this.$router.push('/pages/zts/map/map')
			// openWin("./draw/index?&id="+e._id)
		},
		detail(e){
			uni.setStorageSync('kml_draw', e._id);
			this.$router.push('/pages/zts/track/detail');
		},
		desc(e){  // 跳转到线路详情编辑  富文本
			this.$router.push({
				path:'/pages/zts/track/draw/desc',
				params:{name:'zhangsan'}
			});
		},
		async share(e) {
			this.preview = true
			this.shareUrl = 'path=/pages/comm/kml&_id=' + e._id
		},
		del(e){
			if(!this.userInfo.admin && this.userInfo._id!=e.userId) return this.$message.error("没有权限（删除数据必须由采集员本人操作）！")
			this.$confirm("此操作将永久删除选中数据，是否继续？", "高风险提示", {
				type: "warning"
			}).then((res) => {
				if (res === "confirm") {
					this.loading = true
					this.$service.zts.kml.kill({ ids: [e._id] })
						.then((res) => {
							this.$message.success("删除成功");
							this.loading = false
							this.refresh()
						}).catch((err) => {
							this.$message.error(err);
						});
				}
			}).catch(() => null);
		},
		async exportExcel(){
			this.epxorting = true
			for(let s of this.selected) {
				await this.$service.zts.placemark.list({ kmlId: s._id, chart: true, plain: true }).then(res => {
					s.pm = res
					s.chart = this.zz.geo.kmlChart(s, res)
				})
			}
			
			let kml = this.selected
			
			let heaher = ['属地','区县','编号','名称','创建时间','默认轨迹数','长度'],
				column = ['city','district','sn','name','time','lineNum','lineLen']
			
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
			heaher.push('备注')
			column.push('desc')
			
			const fliterRow = (list)=>{
				
				return list.map(e =>
					column.map(j => {
						if (j == 'city') {
							let d = getDept(e.departmentId)
							if (d.pid==0) return d.name
							let p = getDept(d.pid)
							return p.name
						}
						if (j == 'district') {
							let d = getDept(e.departmentId)
							return d.name
						}
						if (j == 'time') return e.createTime.substring(0,16)
						if (j == 'lineNum') return e.chart.line.num
						if (j == 'lineLen') return e.chart.line.len
		
						if ((typeof j == "string")&&j.startsWith('info')) {
							return e.chart.line.info?e.chart.line.info[j.split('.')[1]] : ''
						}
						
						if(typeof(j)=="number") {
							let k = j>0?j:-j
							let t = e.chart.t[k] || e.chart.p[k] || {}
							return j>0? (t.num||'') : (t.len||'' )
						}
						return e[j]
					})
				)
			}
			let data = fliterRow(this.selected)
			
			await this.zz.expExcel({
					header: heaher,
					data,
					filename: '数据统计(自绘路线)-'+this.zz.timeToDate('Y-M-D h:m')
				})
			this.epxorting = false
		},
		
		toMove(e) {
			this.moveDept = true
		},
		async moved(id){
			if(id) {
				await this.$service.zts.kml.move({
					departmentId: id,
					ids: this.selected.map(e=>{return e._id})
				})
				this.selected = []
				this.$message.success("转移成功")
				this.refresh()
			}
			
			this.moveDept = false
		}
		
	}
};
</script>
