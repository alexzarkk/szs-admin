<template>
	<cl-layout>
		<div class="list-page-layout">
			<div class="pane">
				<!-- 部门区域 -->
				<div class="dept" :class="[!expand ? '_expand' : '_collapse']">
					<cl-dept-tree :init="true" @check="deptSet"></cl-dept-tree>
				</div>
				<!-- 规划列表 -->
				<div class="user">
					<list-done v-if="ids.length" :status="[40]" :expand.sync="expand" :ids="ids"></list-done>
				</div>
			</div>
		</div>
	</cl-layout>
</template>

<script>
import listDone from './components/list-done.vue'
export default {
	components: { listDone },
	data() {
		return {
			expand: this.$store.getters.userInfo.isLeaf,
			ids: []
		};
	},
	methods: {
		deptExpand() {
			this.expand = !this.expand
		},
		deptSet(e) {
			this.ids = e
		},
	}
};
</script>
