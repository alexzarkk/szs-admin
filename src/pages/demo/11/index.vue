<template>
	<div>
		<view class="flex justify-center margin">
			<el-button type="primary" @click="detail('n')">北线</el-button>
		</view>
	</div>
</template>

<script>
export default {
	data() {
		return {
			list: []
		};
	},
	onload(){
		// this.zz.req('')
	},
	mounted() {
	},
	methods: {
		async detail(url) {
			
			let kml = await this.zz.req({ $fn: 'app', $url: 'public/kml/info', _id: url+'20221127', plain: true, chart: true },1)
			
			this.zz.href('/pages/demo/11/map', {kml})
		}
	}
};
</script>
