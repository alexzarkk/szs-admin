<template>
	<cl-layout>
		<zz-map :grid="true" :dept="330000"></zz-map>
	</cl-layout>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			winStyle:'',
			cur:{}
		}
	},
	computed: { ...mapGetters(['lay', 'userInfo']) },
	watch: { },
	mounted() {
	},
	methods: {
	}
};
</script>

<style lang="scss" scoped>
</style>

