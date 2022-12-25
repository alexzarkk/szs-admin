<template>
	<div class="system-user">
		<div class="pane">
			<!-- 部门区域 -->
			<div class="dept " :class="[expand ? '_expand' : '_collapse']">
				<cl-dept-tree @check="deptSet"></cl-dept-tree>
			</div>
			<!-- 规划列表 -->
			<div class="user solid">
				<cList :ids="ids" @add="add" :expand.sync="expand"></cList>
			</div>
		</div>
	</div>
</template>

<script>
import cList from './list10.vue';

export default {
	components: { cList },
	props: {
		kmlId: { type: String }
	},
	data() {
		return {
			expand: true,
			ids: []
		};
	},
	methods: {
		deptSet(e) {
			this.ids = e
		},
		add(e) {
			this.$emit('add',e)
		}
	}
};
</script>
<style lang="scss" scoped>
.system-user {
	height: 100%;
	.pane {
		display: flex;
		height: 100%;
		position: relative;
	}
	.dept {
		height: 100%;
		width: 200px;
		border: 1px solid #e9ecf1;
		background-color: #fff;
		overflow-y: auto;
		overflow-x: hidden;
		transition: width 0.3s;
		margin-right: 8px;

		&._collapse {
			margin-right: 0;
			width: 0;
		}
	}
	.user {
		width: calc(100% - 310px);
		flex: 1;
		height: 100%;
	}
}
</style>