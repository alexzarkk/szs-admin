<template>
	<div>
		 <el-cascader
			ref="cascader"
			placeholder="请选择部门区域"
			filterable
			:size="size"
			:options="list"
			:props="props"
			@change="change"
			clearable>
		</el-cascader>
	</div>
</template>

<script>
import { deepTree } from "../../utils";
export default {
	name: "cl-dept-cascader",
	props: {
		value: Array,
		title: String,
		size: {
			type: String,
			default: 'medium'
		}
	},
	data() {
		return {
			list: [],
			checked: [],
			keyword: "",
			props: {
				label: "name",
				children: "children",
				checkStrictly: true 
			},
			loading: false
		};
	},
	watch: {
		keyword(val) {
			this.$refs["tree"].filter(val);
		},
		value(val) {
			this.refreshTree(val);
		}
	},
	mounted() {
		// console.log(this.props)
		this.refresh();
	},
	methods: {
		refreshTree(val) {
			if (!val) {
				this.checked = [];
			}
			let ids = [];
			// 处理半选状态
			let fn = (list) => {
				list.forEach((e) => {
					
					e.label = e.name
					e.value = e.id
					
					if (e.children) {
						fn(e.children);
					} else {
						ids.push(e._id);
					}
				});
			};
			fn(this.list);
			
			this.checked = ids.filter((id) => (val || []).includes(id));
		// console.log(this.checked)
		},
		refresh() {
			this.$service.system.dept
				.list({load:true})
				.then((res) => {
					this.list = deepTree(res);
					this.refreshTree(this.value);
				})
				.catch((err) => {
					this.$message.error(err);
				});
		},
		filterNode(val, data) {
			if (!val) return true;
			return data.name.includes(val);
		},
		change(e) {
			// console.log(e)
			this.$emit("input", e);
			// const cascader = this.$refs["cascader"];
			// 选中的节点
			// const checked = cascader.getCheckedNodes();
			// 半选中的节点
			// console.log(checked[0].data)
		}
	}
};
</script>