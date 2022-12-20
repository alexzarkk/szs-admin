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
			<el-button size="mini" @click="help">帮助</el-button>
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
					<el-option value="6" label="待审核"></el-option>
					<el-option value="10" label="已审核"></el-option>
					
				</el-select>
			</cl-filter> -->
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
				}"
				:columns="[
					{
						prop: 'deptId',
						label: '部门',
						align: 'center',
						dict: dept
					},
					{
						prop: 'user',
						label: '填报人',
						align: 'center'
					},
					{
						prop: 'grade',
						label: '等级',
						align: 'center',
						dict: grade
					},
					{
						prop: 'name',
						label: '名称',
						align: 'center'
					},
					{
						prop: 'len',
						label: '线路长度',
						align: 'center',
					},
					{
						prop: 'invest',
						label: '拟投资(万元)',
						align: 'center',
					},
					{
						prop: 'ondate',
						label: '建设期限',
						align: 'center',
					},
					{
						prop: 'desc',
						label: '备注',
						align: 'center',
					},
					{
						prop: 'cst',
						label: '状态',
						align: 'center',
						dict: st
					},
					{
						type: 'op',
						align: 'center',
						width: 200,
						buttons: ['slot-cfgSign','slot-kmlInfo','slot-cst','slot-detail','slot-statusBack']
					}
				]"
			>
				<template #column-ondate="{ scope }">
					{{ scope.row.ondate?scope.row.ondate[1]:'' }}
				</template>
				<template #slot-kmlInfo="{ scope }">
					<el-button v-if="scope.row.status<20" type="text" size="mini" @click="kmlInfo(scope.row)">采集信息</el-button>
				</template>
				<template #slot-cfgSign="{ scope }">
					<el-button v-if="scope.row.status<20" type="text" size="mini" @click="cfgSign(scope.row)">标牌配置</el-button>
				</template>
				<template #slot-cst="{ scope }">
					<el-button v-if="scope.row.status>=20" type="text" size="mini" @click="constrInfo(scope.row)">完工巡线报告</el-button>
				</template>
				<template #slot-detail="{ scope }">
					<el-button type="text" size="mini" @click="detail(scope.row,false)">详情</el-button>
				</template>
				<template #slot-examine="{ scope }">
					<!-- <el-button type="text" size="mini" v-if="scope.row.status<10" v-permission="$service.zts.kml.permission.verify" @click="toAudit(scope.row)">审核</el-button> -->
				</template>
				<template #slot-statusBack="{ scope }">
					<el-button type="text" size="mini" v-if="scope.row.status>10" v-permission="$service.zts.kml.permission.verify" @click="statusBack(scope.row)">回退</el-button>
				</template>
			</cl-table>
		</el-row>

		<el-row type="flex">
			<cl-flex1 />
			<cl-pagination />
		</el-row>
		<cl-dialog :title="(cur.status==20?'开':'完') + '工报告'" :visible.sync="constrOpen" :props="{ top: '0' }" width="900px">
			<report :cur="cur" @kmlInfo="kmlInfo"></report>
		</cl-dialog>
		<detail v-if="kml" :kml="kml" @close="close"></detail>
	</cl-crud>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLable } from '@/config/dict'
import { kmlChart } from '@/cool/utils/pmCurd'

import detail from './detail.vue'
import report from './report.vue'

export default {
	components: { detail, report },
	props: {
		ids: { type: Array },
		status: { type: Array },
		expand: { type: Boolean }
	},
	data() {
		return {
			loading: false,
			st: this.zz.dict.ctrSt,
			grade: this.zz.dict.kmlGrade,
			onGrade: 1,
			onStatus: '',
			name: '',
			selected: [],
			dept: getLable(),
			
			cur: {},
			kml:null,
			constrOpen: false
		};
	},
	computed: {
		...mapGetters(['userInfo'])
	},
	watch: {
		ids: {
			deep: true,
			handler(v) {
				this.refresh();
			}
		},
		onGrade(val) {
			this.refresh()
		}
	},
	methods: {
		refresh(e) {
			this.$refs['crud'].refresh({
				dpids: this.ids,
				page: 1,
				name: this.name,
				grade: this.onGrade
			});
			this.loading = false
		},
		onCrudLoad({ ctx, app }) {
			ctx.service(this.$service.zts.layout).done();
			app.refresh({
				isoDept: true,
				children:true,
				size: 20,
				cst: this.status,
				grade: this.onGrade
			});
		},
		cfgSign(e){
			uni.setStorageSync('layId', { _id: e._id, menu: 3, page: this.status[0] })
			this.$router.push({ path: '/pages/zts/layout/layout' })
		},
		kmlInfo(e){
			this.constrOpen = false
			uni.setStorageSync('collect_check', e._id)
			this.$router.push('/pages/zts/map/map')
		},
		report(e){
			let log20 = this.constr.logs.find(x=>x.status==20),
				log40 = this.constr.logs.find(x=>x.status==40)
				
			uni.setStorageSync('constr_report', {lay:this.cur, logs: this.constr.logs, kml:e})
			openWin("/#/pages/zts/constr/report",null,880,1000)
		},
		async constrInfo(e){
			this.loading = true
			if(!e.logs) e.logs = await this.$service.zts.layLog.list({ constrId: e._id })
			if(!e.kml) {
				e.kml = await this.$service.zts.kml.info({ id: e.kmlId })
				e.kml.chart = kmlChart(e.kml.children)
				e.kml.dept = getLable(e.kml.departmentId)
				// let line = e.kml.children[0].children[0]
				// if(!line.coord) line = line.children[0].children[0]
				// this.line = line
			}
			if(!e.kml40) e.kml40 = await this.$service.zts.kml.list({ type: 40, layId: e._id })
			this.cur = e
			this.loading = false
			this.constrOpen = true
			console.log(this.cur);
		},
		
		deptExpand(e) {
			this.$emit('update:expand', !this.expand);
		},
		// 审核
		toAudit(e){
			this.cur = {}
			setTimeout(()=> {this.cur = e}, 10)
		},
		
		detail(e) { this.kml = e },
		close(){this.kml = null},
		help(){ openWin("https://zts.5618.co/repo/constr1.0.pdf") },
		async audit(e){
			await this.$service.zts.constr.audit({
													_id: this.cur._id,
													status: Number(e.status),
													reason: e.reject||undefined,
													pics: e.picss||undefined
												})
			this.refresh()
		},
		async statusBack(e){
			console.log(e);
			let ask1
			await this.$confirm("确定要退回上一状态？", "重要提示", {
				type: "warning"
			}).then(c => {
				ask1 = c == "confirm"
			})
			if(ask1) {
				this.loading = true
				await this.$service.zts.constr.auditBack({ _id: e._id })
				this.loading = false
				this.refresh()
			}
		}
	}
};
</script>
<style scoped lang="scss">
</style>
