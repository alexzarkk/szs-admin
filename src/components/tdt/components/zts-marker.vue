<template>
	<div>
		<div v-show="false">
			<div ref="infoWindow">
				<div class="text-df">
					名称：
					<text class="text-bold">{{ extData.name }}</text>
				</div>
				<div class="text-df">
					类型：
					<text class="">{{ typeValue }}</text>
				</div>
				<div v-for="(url, idx) of extData.imgs" :key="idx">
					<el-image v-if="url!=''" style="width: 200px;" fit="contain" :src="url" :preview-src-list="extData.imgs"></el-image>
				</div>
				<!-- <div style="width: 200px;"> -->
				<!-- </div> -->
				<div>
					描述：{{extData.desc}}
				</div>
				<div>
					经纬度：
					<el-link type="info">{{ extData.coord[0] + ',' + extData.coord[1] }}</el-link>
				</div>
				<div>海拔：{{ extData.coord[2] }}m</div>
				<div>时间：{{ extData.curTime }}</div>
				<view class="flex justify-start" v-if="tools">
					<el-link type="primary" @click="on('edit')">编辑</el-link>
					<span class="padding-left-xs"><el-link type="success" @click="on('dragging')">移动</el-link></span>
					<span class="padding-left-xs"><el-link type="danger" @click="on('del')">删除</el-link></span>
					<span v-if="extData.t2==28||extData.t2==29" class="padding-left-xs"><el-link type="info" @click="on('direct')">指向</el-link></span>
					<!-- <el-link type="info">信息链接</el-link> -->
				</view>
			</div>
		</div>
	</div>
</template>
<script>
import componentMixin from '../mixins/component-mixin';
import { toLngLat } from '../utils/converter';

// import ztool from "@/cool/utils/edit.js"

export default {
	name: 'zts-marker',
	mixins: [componentMixin],
	data() {
		return {
			marker: null,
			info: false,
			typeValue:'',
		};
	},
	props: {
		icon: { type: [Object, String] }, //图标类用来表达注记。默认设置为new L.Icon.Default()。
		dragging: { type: Boolean, default: false }, //决定注记是否可被鼠标或触摸拖动。
		title: { type: String }, //	默认情况下，注记图片的叠置顺序由纬度自动设置。如果你想将某一注记放置于其他之上可用这个选项，设置一个较大的值即可，比如1000（或是相反地设置一个较大的负值）。
		zIndexOffset: { type: Number }, //设置z-index。
		opacity: { type: Number }, //设置透明度。
		position: { type: Array }, //标点的坐标
		edit: { type: Boolean, default: false }, //是否可编辑
		tools: { type: Boolean, default: true }, //是否显示编辑菜单
		idx: { type: Number },
		infoOpen:{ type: Boolean, default: false },
		extData: null //自定义属性
	},
	watch: {
		dragging: {
			immediate: true,
			handler(val) {
				if (val) {
					this.$message(`拖动坐标后双击确定`);
					this.marker.closeInfoWindow();
					this.marker.setOpacity(0.6);
				}else{
					try{
						this.marker.setOpacity(1);
					}catch(e){}
				}
			}
		},
		infoOpen: {
			handler(val) {
				if (val) {
					this.$tdtComponent.openInfoWindow(this.info);
				}
			}
		}
	},
	
	methods: {
		initComponent(option) {
			// console.log(this.extData)
			// let { typeValue } = ztool.setValue(this.extData.t2, this.extData.t3)
			// this.typeValue = typeValue
			
			// 坐标
			this.marker = new T.Marker(toLngLat(this.extData.coord), option)
			this.info = new T.InfoWindow(this.$refs.infoWindow, { autoPan: true })
			this.marker.addEventListener('click', () => {
				if(!this.dragging) this.$tdtComponent.openInfoWindow(this.info)
			})
			this.$tdtComponent = this.marker
		},
		on(e) {
			this.$tdtComponent.closeInfoWindow(this.info)
			this.$emit('on', { e, idx: this.idx, pm: this.extData })
		}
	}
};
</script>
