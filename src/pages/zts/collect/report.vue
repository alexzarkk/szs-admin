<template>
	<div class="home">
        <cl-crud ref="crud" @load="onCrudLoad">
                <cl-table
                    :props="{
						'default-sort': {
							prop: 'createTime',
							order: 'descending'
						}
					}"
                    :columns="[
						{
							type: 'index',
							label: '#',
							align: 'center',
							width: 60
						},
						{
							prop: 'deptId',
							label: '部门',
							align: 'center',
							dict: dept
						},
						{
							prop: 'user',
							label: '审核人',
							align: 'center'
						},
						{
							prop: 'tar',
							label: '操作事项',
							align: 'center'
						},
						{
							prop: 'comment',
							label: '参数内容',
							align: 'center',
							width: 300
						},
						{
							prop: 'createTime',
							label: '创建时间',
							minWidth: '150',
							align: 'center',
							sortable: true
						},
						{
							label: '操作',
							align: 'center',
							type: 'op',
							buttons: ['slot-detail']
						}
					]"
                >
				<template #slot-detail="{ scope }">
					<el-button type="text" size="mini" @click="detail(scope.row)">详情</el-button>
				</template>
				</cl-table>

                <cl-pagination></cl-pagination>
        </cl-crud>
	</div>
</template>

<script>
import { getLable } from "@/config/dict";

export default {
	data() {
		return {
			kmlId: null,
			dept: getLable()
		};
	},
	onLoad() {
		this.kmlId = uni.getStorageSync('collect_report')
		console.log(this.kmlId);
	},
	methods: {
		async onCrudLoad({ ctx, app }) {
			ctx.service(this.$service.zts.log).done()
			app.refresh({ kmlId: this.kmlId, event: 'veryfy' })
		},
		detail(e) {
			// console.log(e);
			uni.setStorageSync('collect_report', e)
			this.$router.push('/pages/zts/collect/reportDetail')
		}
	}
};
</script>
<style lang="scss" scoped>
.home {
	height: calc(100% - 0px);
	overflow: hidden auto;
	padding: 12px;
}
</style>