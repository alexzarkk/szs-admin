<template>
	<div>
		<view class="flex justify-center margin">
			<el-button type="primary" @click="detail('north')">北线</el-button>
			<el-button type="primary" @click="detail('east')">东线</el-button>
			<el-button type="primary" @click="detail('south')">南线</el-button>
			<el-button type="primary" @click="detail('west')">西线</el-button>
			<el-button type="primary" @click="detail('zs')">舟山</el-button>
		</view>
		
		<view class="flex justify-center margin">
			<el-button type="success" @click="show(['north'])">北线</el-button>
			<el-button type="success" @click="show(['east'])">东线</el-button>
			<el-button type="success" @click="show(['south'])">南线</el-button>
			<el-button type="success" @click="show(['west'])">西线</el-button>
			<el-button type="success" @click="show(['zs'])">舟山</el-button>
			<el-button type="success" @click="show(['dt'])">洞头</el-button>
			<el-button type="success" @click="show(['north','east','south','west','zs','dt'])">全省</el-button>
		</view>
		<!-- <view class="flex justify-center margin"> -->
			
			<zz-map :pms="kml" :winH="800"></zz-map>
			
		<!-- </view> -->
		
	</div>
</template>

<script>
	
import { getPms, getKml } from './dict.js'
	
export default {
	data() {
		return {
			kml: null
		};
	},
	onload(){
		// this.zz.req('')
	},
	mounted() {
	},
	methods: {
		detail(k) {
			let kml = getPms(k)
			this.zz.href('/pages/demo/11/map', {kml})
		},
		show(k) {
			this.kml = getKml(k)
			console.log(this.kml);
		}
	}
};
</script>
