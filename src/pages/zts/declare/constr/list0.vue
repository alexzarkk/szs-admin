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
						prop: 'cst',
						label: '状态',
						align: 'center',
						dict: st
					},
					{
						prop: 'reason',
						label: '说明'
					},
					{
						type: 'op',
						align: 'center',
						width: 200,
						buttons: ['slot-cfgSign','slot-kmlInfo','slot-detail']
					}
				]"
			>
				<template #slot-kmlInfo="{ scope }">
					<el-button type="text" size="mini" @click="kmlInfo(scope.row)">采集信息</el-button>
				</template>
				<template #slot-cfgSign="{ scope }">
					<el-button type="text" size="mini" @click="cfgSign(scope.row)">标牌配置</el-button>
				</template>
				<template #slot-detail="{ scope }">
					<el-button type="text" size="mini" @click="detail(scope.row)">填报</el-button>
				</template>
				<template #column-t28="{ scope }">
				</template>
				<template #column-t29="{ scope }">
				</template>
				<template #column-progress="{ scope }">	
				</template>
			</cl-table>
		</el-row>

		<el-row type="flex">
			<cl-flex1 />
			<cl-pagination />
		</el-row>
		
		<detail v-if="kml" :kml="kml" @close="close"></detail>
	</cl-crud>
</template>

<script>
import { mapGetters } from 'vuex';
import { getLable } from '@/config/dict';
import { openWin } from "@/cool/utils"
import detail from '../../constr/components/detail.vue'
export default {
	components: { detail },
	props: {
		ids: { type: Array },
		status: { type: Array },
		expand: { type: Boolean }
	},
	data() {
		return {
			laySt: this.zz.toObj(this.zz.dict.laySt),
			st: this.zz.dict.kmlSt,
			grade: this.zz.dict.kmlGrade,
			onGrade: 1,
			onStatus: '',
			name: '',
			selected: [],
			dept: getLable(),
			
			loading: false,
			kml: null
		};
	},
	computed: {
		...mapGetters(['userInfo'])
	},
	watch: {
		ids: {
			deep: true,
			handler(v) {
				this.refresh()
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
		
		detail(e) { this.kml = e },
		close(e){
			if(e) this.refresh()
			this.kml = null
		},
		help(){ openWin("https://zts.5618.co/repo/zts-%E5%A1%AB%E6%8A%A5%E6%AD%A5%E9%AA%A4%E8%AF%B4%E6%98%8E.pdf") },
		cfgSign(e){
			uni.setStorageSync('layId', { _id: e._id, menu: 3, page: 0 })
			this.$router.push({ path: '/pages/zts/layout/layout' })
		},
		kmlInfo(e){
			uni.setStorageSync('collect_check', e.kmlId)
			this.$router.push('/pages/zts/map/map')
		},
		deptExpand(e) {
			this.$emit('update:expand', !this.expand);
		}
	}
};
</script>
<style scoped lang="scss">
</style>