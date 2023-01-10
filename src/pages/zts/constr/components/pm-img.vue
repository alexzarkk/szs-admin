<template>
	<view class="flex flex-direction">
		<text class="text-sm">{{pm.curTime}}</text>
		<text v-if="pm.desc">{{pm.desc}}</text>
		<view>
			<block v-for="(p, j) of pm.imgs" :key="j">
				<el-image style="width: 120px; height: 120px;margin-left: 2px;" :src="p" :preview-src-list="pm.imgs"></el-image>
			</block>
			<view v-if="pm.video" class="flex flex-direction align-center">
				<zz-qrcode :baseUrl="''" :url="pm.video.url" :size="110" :bgImg="''" :preview="false" :margin="0" :paddin="0.32"></zz-qrcode>
				<text class="text-sm">扫码查看视频</text>
			</view>
		</view>
	</view>
</template>

<script>

export default {
	props: {
		pm: { type: Object },
	},
	mounted(){
		
	},
	methods: {}
};
</script>

<style lang="scss" scoped>
.tmap {
	width: 18cm;
	height: 15cm;
}
.minimap{
	justify-content: center;
	align-items: center;
	width: 220px;
	height: 180px;
}
</style>
