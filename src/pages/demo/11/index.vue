<template>
	<div>
		<view class="flex justify-center">
			<el-button type="primary" size="mini" @click="detail('north')">北线</el-button>
			<el-button type="primary" size="mini" @click="detail('east')">东线</el-button>
			<el-button type="primary" size="mini" @click="detail('south')">南线</el-button>
			<el-button type="primary" size="mini" @click="detail('west')">西线</el-button>
			<el-button type="primary" size="mini" @click="detail('zs')">舟山</el-button>
		
			<el-button type="success" size="mini" @click="show(['north'])">北线</el-button>
			<el-button type="success" size="mini" @click="show(['east'])">东线</el-button>
			<el-button type="success" size="mini" @click="show(['south'])">南线</el-button>
			<el-button type="success" size="mini" @click="show(['west'])">西线</el-button>
			<el-button type="success" size="mini" @click="show(['zs'])">舟山</el-button>
			<el-button type="success" size="mini" @click="show(['dt'])">洞头</el-button>
			<el-button type="success" size="mini" @click="show(['north','east','south','west','zs'])">全省</el-button>
		</view>
			
		<map11 v-if="loaded" :pms="kml" :winH="800" @drawFinish="drawFinish"></map11>
		
	</div>
</template>

<script>
	
import { getPms, getKml } from './dict.js'

import map11 from "./map11.vue";

export default {
	components: {
		map11
	},
	data() {
		return {
			loaded: true,
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
		async show(k) {
			this.loaded = false
			this.kml = await getKml(k)
			this.loaded = true
			console.log(this.kml);
		},
		drawFinish(){
			console.log('drawFinish');
			
		}
	}
};
</script>
