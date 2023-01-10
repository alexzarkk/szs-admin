<template>
	<div>
		<view class="flex justify-center align-center">
			<canvas :id="cid" :canvas-id="cid" :style="'width: '+size+'px;height: '+size+'px;'"></canvas>
		</view>
		<view v-if="preview" class="text-center">
			<el-link type="primary" @click="hview">H5预览</el-link>
		</view>
	</div>
</template>

<script>
	import UQRCode from 'uqrcodejs'
	import { uniqId } from '@/comm/geotools.js'
	
	export default {
		props: {
		    baseUrl: {
		        type: String,
		        default: 'https://zts.5618.co/h5/#/pages/share?'
		    },
			url: {
			    type: String,
			    default: ''
			},
			size: {
		        type: Number,
		        default:190
		    },
			bgImg:{
		        type: String,
		        default: 'https://zts.5618.co/repo/logoIcon.png'
		    },
			paddin:{
			    type: Number,
			    default: 0.25
			},
			margin:{
			    type: Number,
			    default: 10
			},
			preview: {
		        type: Boolean,
		        default: true
		    }
		},
		data() {
			return {
				cid: uniqId()
			}
		},
		mounted() {
			// 获取uQRCode实例
			let qr = new UQRCode();
			
			qr.margin = this.margin; // 指定二维码的边距
			
			qr.foregroundPadding = this.paddin
			
			//logo
			if(this.bgImg) qr.foregroundImageSrc = this.bgImg
			
			// 设置二维码内容
			qr.data = this.baseUrl+this.url
			// 设置二维码大小，必须与canvas设置的宽高一致
			qr.size = this.size;
			// 调用制作二维码方法
			qr.make();
			// 获取canvas上下文
			let canvasContext = uni.createCanvasContext(this.cid, this); // 如果是组件，this必须传入
			// 设置uQRCode实例的canvas上下文
			qr.canvasContext = canvasContext;
			// 调用绘制方法将二维码图案绘制到canvas上
			qr.drawCanvas();
		},
		methods: {
			hview(){
				this.zz.openWin({url:this.baseUrl+this.url,w:380,h:780})
			}
		}
	};
</script>

