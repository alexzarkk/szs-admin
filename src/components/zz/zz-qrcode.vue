<template>
	<div>
		<view class="flex justify-center">
			<view id="qrcodezz" :style="'width: '+width+'px;height:'+height+'px;position:relative;'"></view>
			<view v-if="h5" style="position: absolute; top: 266px;">
				<el-link type="primary" @click="hview">H5预览</el-link>
			</view>
		</view>
	</div>
</template>

<script>
	import UQRCode from 'uqrcodejs'
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
		    width: {
		        type: Number,
		        default: 200
		    },
		    height: {
		        type: Number,
		        default: 200
		    },
			size: {
		        type: Number,
		        default: 190
		    },
			bgImg:{
		        type: String,
		        default: 'https://zts.5618.co/repo/logoIcon.png'
		    },
			h5: {
		        type: Boolean,
		        default: true
		    }
		},
		mounted() {
			var qr = new UQRCode();
			// 设置二维码内容
			qr.data = this.baseUrl+this.url
			// 设置二维码大小，必须与canvas设置的宽高一致
			qr.size = this.size
			// 设置二维码前景图，可以是路径
			qr.foregroundImageSrc = this.bgImg
			// 调用制作二维码方法
			qr.make();
							
			// 遍历drawModules创建dom元素
			var qrHtml = '';
			for (var i = 0; i < qr.drawModules.length; i++) {
				var drawModule = qr.drawModules[i];
				switch (drawModule.type) {
				case 'block':
					/* 绘制小块 */
					qrHtml += `<div style="position: absolute;left: ${drawModule.x}px;top: ${drawModule.y}px;width: ${drawModule.width}px;height: ${drawModule.height}px;background: ${drawModule.color};"></div>`;
					break;
				case 'image':
					/* 绘制图像 */
					qrHtml += `<img style="position: absolute;left: ${drawModule.x}px;top: ${drawModule.y}px;width: ${drawModule.width}px;height: ${drawModule.height}px;" src="${drawModule.imageSrc}" />`;
					break;
				}
			}
			document.getElementById('qrcodezz').innerHTML = qrHtml;
		},
		methods: {
			hview(){
				this.zz.openWin({url:this.baseUrl+this.url,w:380,h:780})
			}
		}
	};
</script>

