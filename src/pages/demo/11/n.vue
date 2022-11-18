<template>
	<cl-layout>
		<div id="app">
			<tdt-map :center="center" :zoom="zoom" :controls="controls" @contextmenu="mapCT">
			<!-- <tdt-map :center="center" :zoom="zoom"> -->
				<!-- <tdt-tilelayer :url="tilelayer"></tdt-tilelayer> -->
				<!-- <tdt-tilelayer-tdt :url="imageUrl"></tdt-tilelayer-tdt> -->
				<!-- <tdt-tilelayer-wms v-bind="option"></tdt-tilelayer-wms> -->
				<tdt-marker :position="marker2" :dragging="true" :edit="edit" @click="openInfowidow" extData="marker-info"></tdt-marker>
				
				<tdt-marker :position="marker" 
					:icon="{iconUrl:'../../static/icon/map/t200.png',iconSize: [44,44], iconAnchor:[22,44] }" 
					:dragging="true" :edit="edit" @click="openInfowidow" extData="marker-info"></tdt-marker>
				
				<tdt-label :position="label" text="Hello World!"></tdt-label>
				<tdt-polyline :path="polyline" :edit="edit" color="black" :opacity="1" ></tdt-polyline>
				<tdt-polygon :path="polygon" :edit="edit" color="black" :opacity="1"></tdt-polygon>
				<tdt-rectangle :bounds="rectangle" :edit="edit" color="black" :opacity="1"></tdt-rectangle>
				<tdt-circle :center="circle" :radius="3000" :edit="edit" color="black" :opacity="1"></tdt-circle>
				<tdt-infowindow :target="infowindow.target" :content="infowindow.content" @close="infowindow.target = null"></tdt-infowindow>
				<tdt-mousetool ref="mousetool" :markTool="{ follow: true }" :polygonTool="{ showLabel: true }" :polyLineTool="{ showLabel: true }"></tdt-mousetool>
				<tdt-search></tdt-search>
				<tdt-cartrack ref="tdtCartrack" :Datas="cartrack" :interval="5" :speed="10" :startOnInit="true"></tdt-cartrack>
				<tdt-marker-cluster :markers="clusterMarkers" @click="clusterClick"></tdt-marker-cluster>
				
			</tdt-map>
			<div class="btns">
				<el-button size="mini" @click="changeLayer">切换图层</el-button>
				<el-button size="mini" @click="edit = !edit">编辑</el-button>
				<el-button size="mini" @click="startTrack">车辆轨迹</el-button>
				<el-button size="mini" @click="addCluster">点聚合</el-button>
				<el-button size="mini" @click="openTool('markTool')">标点</el-button>
				<el-button size="mini" @click="openTool('polygonTool')">测面</el-button>
				<el-button size="mini" @click="openTool('polylineTool')">标线</el-button>
				<el-button size="mini" @click="openTool('rectangleTool')">画矩形</el-button>
				<el-button size="mini" @click="openTool('circleTool')">画圆</el-button>
				<el-button size="mini" @click="clearAll()">清空</el-button>
			</div>
		</div>
	</cl-layout>
</template>

<script>
const tilelayerUrl =
	'http://t0.tianditu.gov.cn/eia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=70ede380913047ef13bc4dc92ff4f75b';
	// 'http://t0.tianditu.gov.cn/cta_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=70ede380913047ef13bc4dc92ff4f75b';
	
export default {
	name: 'App',
	data() {
		return {
			center: [119.26762, 28.65137],
			zoom: 11,
			tilelayer: tilelayerUrl,
			imageUrl: 'http://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=70ede380913047ef13bc4dc92ff4f75b',
			option: {
				url: "http://ditu.zjzwfw.gov.cn/services/wmts/emap/default/oss",
				version: "1.0.0",
				layers: "emap",
				transparent: true,
				styles: "default",
				format: "image"
			},
			
			controls: [
				'zoom',
				'mapType',
				'copyright',
				'overviewMap',
				{
					name: 'scale',
					position: 'bottomright'
				}
			],
			marker: [113.280637, 23.125178],
			marker2: [113.280637, 23.125178],
			label: [113.290637, 23.155178],
			polyline: [[113.32839, 23.14352], [113.280637, 23.125178], [113.3332, 23.11889]],
			polygon: [[113.22716, 23.14162], [113.26973, 23.14225], [113.27316, 23.105], [113.23265, 23.11131]],
			rectangle: [[113.22716, 23.14162], [113.27316, 23.105]],
			circle: [113.280637, 23.125178],
			infowindow: {
				content: '',
				target: null
			},
			edit: false,
			cartrack: [				[113.282417, 23.112452],
				[113.282422, 23.112878],
				[113.28279, 23.113568],
				[113.283307, 23.113864],
				[113.283307, 23.113864],
				[113.283717, 23.114324],
				[113.283913, 23.114592],
				[113.283913, 23.114592],
				[113.283913, 23.114592],
				[113.28914, 23.137385],
				[113.291526, 23.137098],
				[113.29414, 23.137017],
				[113.296902, 23.137084],
				[113.24633, 23.142696],
				[113.244502, 23.14353],
				[113.251482, 23.140548],
				[113.25275, 23.140262],
				[113.254188, 23.139822],
				[113.252869, 23.140541],
				[113.250713, 23.141234],
				[113.249815, 23.141546],
				[113.25071, 23.141067],
				[113.252108, 23.140466]],
			clusterMarkers: [],
			// masked:null
		};
	},
	mounted() {
		// console.log('turf 对象===================', this.$turf);
		// let polygon = this.$turf.polygon([[[121, 30], [122, 31], [122, 32], [121, 31], [122, 31], [121, 30]]]);
		// let mask = this.$turf.polygon([[[121.5, 30.5], [122.5, 31.5], [122.5, 32.5], [121.5, 31.5], [122.5, 31.5], [121.5, 30.5]]]);
		// let masked = this.$turf.mask(polygon, mask);
		// console.log('masked================', masked);
		// this.masked = masked
	},
	methods: {
		changeLayer() {
			// this.tilelayer = tilelayerUrl;
			this.tilelayer = 'http://t0.tianditu.gov.cn/cta_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=70ede380913047ef13bc4dc92ff4f75b'
		},
		openTool(tool) {
			this.$refs.mousetool.open(tool);
		},
		clearAll() {
			this.$refs.mousetool.clearAll();
		},
		openInfowidow({ target, extData }) {
			this.infowindow = {
				target,
				content: `<h3>${extData}</h3>`
			};
		},
		startTrack() {
			this.cartrack = [
				[113.282417, 23.112452],
				[113.282422, 23.112878],
				[113.28279, 23.113568],
				[113.283307, 23.113864],
				[113.283307, 23.113864],
				[113.283717, 23.114324],
				[113.283913, 23.114592],
				[113.283913, 23.114592],
				[113.283913, 23.114592],
				[113.28914, 23.137385],
				[113.291526, 23.137098],
				[113.29414, 23.137017],
				[113.296902, 23.137084],
				[113.24633, 23.142696],
				[113.244502, 23.14353],
				[113.251482, 23.140548],
				[113.25275, 23.140262],
				[113.254188, 23.139822],
				[113.252869, 23.140541],
				[113.250713, 23.141234],
				[113.249815, 23.141546],
				[113.25071, 23.141067],
				[113.252108, 23.140466]
			];
			
			this.$refs.tdtCartrack.start();
		},
		mapCT(e){
			console.log(e)
		},
		addCluster() {
			this.clusterMarkers = new Array(500).fill(0).map((item, index) => {
				return {
					position: [Math.random() * 40 + 85, Math.random() * 30 + 21],
					extData: 'cluster-' + index
				};
			});
		},
		clusterClick({ layer }) {
			const {
				options: { extData }
			} = layer;
			this.infowindow = {
				target: layer,
				content: `<h3>${extData}</h3>`
			};
		}
	}
};
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	width: 100%;
	height: 100%;
}

.tdt-search {
	position: absolute;
	left: calc(70%);
	top: 70px;
	z-index: 999;
}

.btns {
	position: absolute;
	left: calc(20%);
	top: 70px;
	z-index: 999;
}
</style>
