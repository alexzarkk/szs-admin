<template>
	<div
		:class="svgClass"
		:style="{
			'font-size': size2
		}"
	>
		<i
			:class="iconName"
			:style="{
				color: color || 'currentColor'
			}"
		></i>
	</div>
</template>

<script>
export default {
	name: "icon-svg",

	props: {
		name: { // 传进来的
			type: String
		},
		className: {
			type: String
		},
		type:{
			type:String,
			default:'cl-icon'  // cuIcon
		},
		size: {
			type: [String, Number],
			default: 20
		},
		color: String
	},

	computed: {
		iconName() {
			let IconName = ''
			if(this.name){
				IconName = `${this.type}-${this.name}`
			}else{
				IconName = 'cuIcon-calendar'
			}
			
			// console.log("展示的图标",IconName)
			return IconName;
		},
		svgClass() {
			return ["icon-svg", `icon-svg__${this.name}`, this.className];
		},
		size2() {
			return typeof this.size == "string" ? this.size : `${this.size}px`;
		}
	},
	mounted() {
		// console.log("获取到的type",this.type)
	}
};
</script>

<style lang="scss" scoped>
.icon-svg {
	display: inline-block;
}
</style>
