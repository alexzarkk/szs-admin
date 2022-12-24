<template>
	<div>
		 <el-cascader
			ref="tree"
			:placeholder="title"
			:size="size"
			v-model="checked"
			:options="list"
			:props="props"
			@change="change"
			filterable
			clearable>
		</el-cascader>
	</div>
</template>

<script>
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
			list: this.$store.getters.dept,
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
			this.$refs["tree"].filter(val)
		},
		value(val) {
			this.refreshTree(val)
		}
	},
	mounted() {
		this.refreshTree(this.value)
	},
	methods: {
		refreshTree(val) {
			if (!val) {
				this.checked = []
			}
			let ids = [],
				list = this.zz.revDeepTree(this.list),
				fn = (cur) => {
					ids.unshift(cur._id)
					let p = list.find(e=>e._id==cur.parentId)
					if(p) fn(p)
				}
			
			fn(list.find(e=>e._id==val))
			this.checked = ids
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