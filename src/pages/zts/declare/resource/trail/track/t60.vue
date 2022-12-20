<template>
	<cl-layout>
		<div class="system-user" :style="winStyle">
			<div class="pane">
				<!-- 部门区域 -->
				<div class="dept" :class="[!expand ? '_expand' : '_collapse']">
					<cl-dept-tree :deptId="userInfo.dept.id" @loaded="deptLoaded" @check="deptSet"></cl-dept-tree>
				</div>
				<!-- 规划列表 -->
				<div class="user">
					<cList v-if="ids.length" :expand.sync="expand" :ids="ids" :list="deptList"></cList>
				</div>
			</div>
		</div>
	</cl-layout>
</template>

<script>
import { mapGetters } from "vuex";
import cList from './list.vue';

export default {
	components: { cList },
	data() {
		return {
			winStyle: '',
			expand: this.$store.getters.userInfo.isLeaf,
			ids: [],
			deptList: []
		};
	},
	computed: {
		...mapGetters(['userInfo'])
	},
	watch: {
		lay: {
			deep: true,
			handler(v) {
				this.setWin();
			}
		}
	},
	methods: {
		setWin() { this.winStyle = `width:${this.lay.width}px; height:${this.lay.height}px;` },
		deptExpand() {
			this.expand = !this.expand;
		},
		deptSet(e) {
			this.ids = e
		},
		deptLoaded(e){
			console.log(e);
			this.deptList = e
		}
	}
};
</script>

<style lang="scss" scoped>
.system-user {
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
	}
}

</style>
