<template>
	<div>
		<block v-if="edit">
			<div class="btns">
				<el-button size="mini" type="infor" @click="on('cancelDraw')">取消</el-button>
				<el-button size="mini" type="primary" @click="save">保存</el-button>
			</div>
		</block>
		<div v-show="false">
			<div ref="infoWindow" style="min-width: 120px;">
				<div class="text-df">
					名称：
					<text class="text-bold">{{ extData.name }}</text>
				</div>
				<div class="text-df" v-if="extData.sn">
					编号：
					<text class="text-bold text-lg">{{ extData.sn }}</text>
				</div>
				<div class="text-df" v-if="extData.typeValue">
					类型：
					<text class="">{{ extData.typeValue }}</text>
				</div>
				<div class="padding-tb-xs" v-if="extData.info">
					<div>
						<text class="padding-left-xs text-grey">长度：</text>
						<text class="text-orange text-bold">{{ extData.info.len }}m</text>
					</div>
					<div>
						<text class="padding-left-xs text-grey">
							海拔：
							<text class="cuIcon-top"></text>
						</text>
						<text class="text-orange text-bold">{{ extData.info.top }}m</text>
						<text class="text-grey"><text class="cuIcon-down"></text></text>
						<text class="text-orange text-bold">{{ extData.info.bottom }}m</text>
					</div>
					<div>
						<text class="padding-left-xs text-grey">
							累计：
							<i class="header-icon el-icon-top"></i>
						</text>
						<text class="text-orange text-bold">{{ extData.info.up }}m</text>
						<text class="text-grey"><i class="header-icon el-icon-bottom"></i></text>
						<text class="text-orange text-bold">{{ extData.info.down }}m</text>
					</div>
				</div>
				<div class="text-df" v-if="extData.num">
					岗位人数：
					<text class="">{{ extData.num }}</text>
				</div>
				<div style="padding: 2px 0 2px 0;">
					说明：<text class="">{{extData.desc}}</text>
				</div>
				<div v-for="(url, idx) of extData.imgs" :key="idx">
					<el-image v-if="url!=''" style="width: 200px;" fit="contain" :src="url" :preview-src-list="extData.imgs"></el-image>
				</div>
				<view class="flex justify-start" v-if="tools">
					<el-link type="primary" @click="on('edit')">编辑</el-link>
					<span class="padding-left-xs"><el-link type="success" @click="on('draw')">绘制</el-link></span>
					<span class="padding-left-xs"><el-link type="danger" @click="on('del')">删除</el-link></span>
				</view>
			</div>
		</div>
	</div>
</template>

<script>
import componentMixin from '../mixins/component-mixin';
import { toLngLat } from '../utils/converter';

export default {
	name: 'zts-polyline',
	mixins: [componentMixin],
	props: {
		color: { type: String }, //折线颜色。
		weight: { type: Number }, //折线的宽度，以像素为单位。
		opacity: { type: Number }, //折线的透明度（范围0-1 之间）。
		lineStyle: { type: String }, //折线的样式（solid或dashed）。
		path: { type: Array }, //坐标数组。
		edit: { type: Boolean, default: false }, //是否可编辑
		tools: { type: Boolean, default: true }, //是否显示编辑菜单
		idx: { type: Number }, 
		extData: {type: Object} //自定义属性
	},
	methods: {
		initComponent(option) {
			// let coord = this.path.map(e=>{return [e[0],e[1],e[2]]})
			// console.log(coord)
			
			let line = new T.Polyline(this.path, option)
			this.info = new T.InfoWindow(this.$refs.infoWindow, { autoPan: true })
			line.addEventListener('click', () => {
				if(!this.edit) this.$tdtComponent.openInfoWindow(this.info)
			})
			this.$tdtComponent = line
			this.line = line
		},
		on(e) {
			this.closeInfo()
			this.$emit('on', { e, t:'polyline', idx: this.idx, pm: this.extData || {}})
		},
		closeInfo(){
			this.$tdtComponent.closeInfoWindow(this.info)
		},
		save(){
			let coord = []
			for (let s of this.line.getLngLats()) {
				coord.push([s.getLng(), s.getLat(), 0])
			}
			this.$emit('on', { e: 'updateCoord', t:'polyline', idx: this.idx, coord })
		}
	}
};
</script>
<style lang="scss" scoped>
.btns {
	position: absolute;
	left: 10px;
	top: 10px;
	z-index: 999;
}
</style>