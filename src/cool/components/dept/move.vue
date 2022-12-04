<template>
	<view>
		<cl-form ref="dept-move"></cl-form>
	</view>
</template>

<script>
export default {
	name: "cl-dept-move",
	props: {
		tar: { type: String },
		ids: { type: Array },
	},
	data() {
		return {
			list: [],
			loading: true
		};
	},
	mounted() {
		console.log(this.ids);
		let dept = uni.getStorageSync('cur_dept_list')
		
		this.$refs["dept-move"].open({
			props: {
				title: "部门转移",
				width: "600px",
				"label-width": "80px"
			},
			items: [
				{
					label: "选择部门",
					prop: "dept",
					component: {
						name: "system-user__dept-move",
	
						methods: {
							selectRow(e) {
								this.$emit("input", e);
							}
						},
	
						render() {
							return (
								<div
									style={{
										border: "1px solid #eee",
										"border-radius": "3px",
										padding: " 2px"
									}}>
									<el-tree
										data={dept}
										{...{
											props: {
												props: {
													label: "name"
												}
											}
										}}
										node-key="id"
										highlight-current
										on-node-click={this.selectRow}></el-tree>
								</div>
							);
						}
					}
				}
			],
			on: {
				submit: (data, { done, close }) => {
					if (!data.dept) {
						this.$message.warning("请选择部门");
						return done();
					}
					const { name, id } = data.dept;
					this.$confirm(`是否将数据转移到部门 ${name} 下`, "提示", {
						type: "warning"
					}).then(() => {
						this.$emit('moved', id)
					}).catch(() => {
						done();
						// this.$emit('moved')
					});
				},
				close:()=>{
					this.$emit('moved')
				}
			}
		});
	
	},

	methods: {
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
