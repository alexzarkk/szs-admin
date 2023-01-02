<template>
	<cl-crud ref="crud10" @load="onCrudLoad" v-loading="loading" boder >
		<el-row type="flex">
			<view class="flex align-center">
				<div class="icon padding-lr-xs" @click="deptExpand">
					<i class="cursor el-icon-arrow-left" v-if="expand"></i>
					<i class="cursor el-icon-arrow-right" v-else></i>
				</div>
			</view>
			<el-button size="mini" type="primary" @click="edit(false)">新增/导入</el-button>
			<cl-flex1 />
			<cl-search-key />
		</el-row>

		<el-row>
			<cl-table :contextMenu="[]"
				:props="{
					'default-sort': {
						prop: 'updateTime',
						order: 'descending'
					}
				}"
				:columns="[
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
							prop: 'user',
							label: '创建人',
							align: 'center'
						},

						{
							prop: 'desc',
							label: '描述',
							align: 'center'
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
							buttons: ['slot-detail', 'slot-add']
						}
					]"
				>
				<template #slot-add="{ scope }">
					<el-button type="text" size="mini" @click="add(scope.row)">选择</el-button>
				</template>
				<template #slot-detail="{ scope }">
					<el-button type="text" size="mini" @click="detail(scope.row)">详情</el-button>
				</template>
			</cl-table>
		</el-row>

		<el-row type="flex">
			<cl-flex1 />
			<cl-pagination />
		</el-row>
		
	</cl-crud>
</template>

<script>
import { mapGetters } from 'vuex'
import { upload } from "@/cool/utils/uploadKml.js"
export default {
	data() {
		return {
			onType: 9,
			onGrade: '',
			onStatus: 10,
			name: '',
			selected: [],
			dept: this.$store.getters.deptLabel,
			loading: false,
		};
	},
	props: {
		ids: { type: Array },
		section: { type: Object },
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
	computed: {
		...mapGetters(['userInfo']),
	},
	methods: {
		refresh(e) {
			this.$refs['crud10'].refresh({
				dpids: this.ids,
				type: 60,
				name: this.name,
				children: false
			});
		},
		onCrudLoad({ ctx, app }) {
			ctx.service(this.$service.zts.kml).done()
			this.refresh();
		},
		deptExpand(){
			this.$emit('update:expand',!this.expand)
		},
		edit(kml) {
			upload.call(this, { kml, e:{ coord:'', ids: this.userInfo.deptChild }, kt:[{label:"推荐路线", value:60}]})
		},
		async add(e) {
			this.$emit('add', e._id)
		},
		async detail(e) {
			uni.setStorageSync('collect_check', e._id)
			this.$router.push('/pages/zts/map/map')
		}
	}
};
</script>
