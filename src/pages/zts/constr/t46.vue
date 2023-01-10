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
					<list-kml v-if="ids.length" :status="[6]" :expand.sync="expand" :ids="ids" />
				</div>
			</div>
		</div>
	</cl-layout>
</template>

<script>
import listKml from './components/list-kml.vue'
export default {
	components: { listKml },
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
