<template>
	<!-- 
			@name:线路介绍的编辑页面
			@desc：
			@date：2021-11-03
			@author: 
	 -->
	<cl-layout>
		<el-form class="padding">
			<el-form-item label="线路介绍" prop="content"><cl-editor-tinymce v-model="content" :options="{ height: 1000 }"></cl-editor-tinymce></el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">保存</el-button>
		 	<el-button>返回上一级</el-button>
		 </el-form-item>
		</el-form>
	</cl-layout>
</template>

<script>
export default {
	created() {},
	mounted() {
		console.log('路由信息', this.$route);
	},
	data() {
		return {
			content: ''
		};
	},
	methods: {
		async loadData() {
			
		},
		onSubmit() {
			
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
}
</style>
