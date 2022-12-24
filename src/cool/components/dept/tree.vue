<template>
	<div class="cl-dept-tree">
		<div class="header">
			<div class="text-black">区域部门</div>
		</div>
		<div class="container scroller">
			<el-tree
				node-key="id"
				highlight-current
				:default-expanded-keys="[did]"
				:data="list"
				:props="{ label: 'name' }"
				:expand-on-click-node="false"
				@node-click="rowClick"
			>
			</el-tree>
		</div>
	</div>
</template>

<script>
export default {
	name: "cl-dept-tree",
	props: {
		init: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			list: this.$store.getters.dept,
			did: this.$store.getters.userInfo.dept.id+'',
		};
	},
	mounted() {
		if(this.init) this.rowClick(this.list[0])
	},

	methods: {
		rowClick(e) {
			let ids = this.zz.revDeepTree(e.children).map((e) => e.id)
			ids.unshift(e.id)
			this.$emit("check", ids)
		}
	}
};
</script>

<style lang="scss" scoped>
.cl-dept-tree {
	height: calc(100%);
	width: 200px;
	border: 1px solid #e9ecf1;
	background-color: #eeeeee;
	overflow-y: auto;
	overflow-x: hidden;
	transition: width 0.3s;
	margin-right: 10px;

	.header {
		display: flex;
		align-items: center;
		height: 40px;
		padding: 0 10px;
		background-color: #fff;
		letter-spacing: 1px;
		position: relative;
	
		div {
			font-size: 14px;
			flex: 1;
			white-space: nowrap;
		}
	
		i {
			font-size: 18px;
			cursor: pointer;
		}
	}
	.container {
		background-color: #ffffff;
		overflow-y: auto;
		overflow-x: hidden;
	}
	.scroller {
		border-top: 1px solid #eaedf4;
		height: calc(100% - 40px);
		box-sizing: border-box;
		overflow-x: hidden;
	}
	
	::v-deep .el-tree-node__content {
		height: 32px;
		span {
			&:nth-child(2) {
				display: flex;
				align-items: center;
				height: 100%;
				width: 100%;
	
				div {
					display: flex;
					align-items: center;
					height: 100%;
					width: 100%;
					font-size: 13px;
				}
			}
		}
	}
}
</style>
