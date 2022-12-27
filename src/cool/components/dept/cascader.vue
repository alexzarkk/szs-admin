<template>
	<div>
		 <el-cascader
			ref="cascader"
			:placeholder="title"
			:size="size"
			v-model="checked"
			:options="tree"
			:props="props"
			@change="change"
			filterable
			clearable>
		</el-cascader>
	</div>
</template>

<script>
import menu from '../../../store/modules/menu'
	
export default {
	name: "cl-dept-cascader",
	props: {
		value: [Array,String],
		title: {
			type: String,
			default: '请选择部门区域'
		},
		size: {
			type: String,
			default: 'medium'
		}
	},
	data() {
		return {
			tree: this.zz.clone(menu.state.dept),
			list: [],
			checked: [],
			keyword: "",
			props: {
				label: "name",
				value: "_id",
				children: "children",
				checkStrictly: true 
			}
		}
	},
	watch: {
		keyword(val) {
			this.$refs["cascader"].filter(val)
		},
		value(val) {
			this.refreshTree(val)
		}
	},
	mounted() {
		this.list = this.zz.revDeepTree(this.tree)
		this.refreshTree(this.value)
	},
	methods: {
		refreshTree(val) {
			if (!val) {
				return this.checked = []
			}
			if(val.length==1&&val[0]) {
				let ids = [],
					list = this.list,
					fn = (cur) => {
						ids.unshift(cur._id)
						let p = list.find(e=>e._id==cur.parentId)
						if(p) fn(p)
					}
				
				fn(list.find(e=>e._id==val[0]))
				this.checked = ids
			}
		},
		filterNode(val, data) {
			if (!val) return true;
			return data.name.includes(val);
		},
		change(e) {
			this.$emit("input", e);
		}
	}
};
</script>