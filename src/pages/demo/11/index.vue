<template>
	<div>
		<view class="flex justify-center margin">
			<el-button type="primary" @click="detail('north')">北线</el-button>
			<el-button type="primary" @click="detail('east')">东线</el-button>
			<el-button type="primary" @click="detail('south')">南线</el-button>
			<el-button type="primary" @click="detail('west')">西线</el-button>
			<el-button type="primary" @click="detail('zs')">舟山</el-button>
		</view>
	</div>
</template>

<script>
	
import {getPms} from './dict.js'
	
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
		detail(k) {
			let kml = getPms(k)
			this.zz.href('/pages/demo/11/map', {kml})
		}
	}
};
</script>
