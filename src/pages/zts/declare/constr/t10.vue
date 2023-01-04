<template>
	<cl-layout>
		<div class="list-page-layout">
			<div class="pane">
				<!-- 部门区域 -->
				<div class="dept" :class="[!expand ? '_expand' : '_collapse']">
					<cl-dept-tree :deptId="$store.getters.userInfo.dept.id" @loaded="deptLoaded" @check="deptSet"></cl-dept-tree>
				</div>
				<!-- 规划列表 -->
				<div class="user">
					<list20 v-if="ids.length" :status="[10,20,40,50,60]" :expand.sync="expand" :ids="ids"></list20>
				</div>
			</div>
		</div>
	</cl-layout>
</template>

<script>
import list20 from '../../constr/components/list20.vue'
export default {
	components: { list20 },
	data() {
		return {
			winStyle: '',
			expand: this.$store.getters.userInfo.isLeaf,
			ids: [],
			deptList: []
		};
	},
	methods: {
		deptExpand() {
			this.expand = !this.expand;
		},
		deptSet(e) {
			this.ids = e;
		},
		deptLoaded(e) {
			this.deptList = e;
		}
	}
};
</script>
<style lang="scss" scoped></style>
