<template>
	<div class="container">
		<el-row type="flex" align="middle">
			<el-tooltip v-if="tar == 'placemark'" class="item" effect="dark" content="轨迹下载" placement="top">
				<el-button type="primary" plain @click="download" size="mini">下载</el-button>
			</el-tooltip>
			
			<cl-flex1></cl-flex1>
			<cl-filter label="地图">
				<el-select style="width: 60px;" size="mini" v-model="selects.map" @change="mapChange">
					<el-option :value="0" label="天地图"></el-option>
					<el-option :value="2" label="浙江"></el-option>
					<el-option :value="3" label="3D"></el-option>
				</el-select>
			</cl-filter>
		</el-row>

		<div class="tmap" id="_map" v-loading="loading">
			<block v-if="selects.map==0">
				<!-- <tdt-map :center="center" :zoom="zoom" :controls="controls">
					<tdt-infowindow :target="infowindow.target" :content="infowindow.content" @close="infowindow.target = null"></tdt-infowindow>
					<tdt-marker-cluster :markers="clusterMarkers" :styles="cMarker" @click="clusterClick"></tdt-marker-cluster>
				
					<block v-for="(pm, idx) of polyline" :key="9999 + idx">
						<tdt-polyline :path="pm.coord" color="#ff4322" :opacity="0.7" :weight="5" @click="openInfowidow" :extData="idx"></tdt-polyline>
					</block>
				
					<block v-if="cur.geo">
						<block v-for="(ft, idx) of cur.geo.features" :key="idx">
							<block v-for="(coord, idxx) of ft.geometry.coordinates" :key="idx + '' + idxx">
								<tdt-polygon :path="coord[0]" color="white" :opacity="0.5" :lineStyle="'dashed'" :fillColor="'white'" :fillOpacity="0"></tdt-polygon>
							</block>
						</block>
					</block>
				</tdt-map> -->
			</block>
			
			<block v-if="selects.map==2">
				<mapbox-map :center="center" :zoom="zoom" :editble="false" @mb-created="init">
					<!-- 边界线 -->
					<block v-if="cur.geo">
						<block v-for="(pm, i) of cur.geo.line" :key="i+'9'">
							<z-line :pm="pm" :opt="layerStyle['bound']"></z-line>
						</block>
					</block>
					<!-- 默认轨迹kml -->
					<block v-for="(pm, i) of t10" :key="i+'1'">
						<z-line :pm="pm" :opt="layerStyle.grade[pm.grade]"  mouseEfc></z-line>
					</block>
				</mapbox-map>
			</block>
			<block v-if="selects.map==3">
				<MapboxMap3D :center="center" :zoom="zoom" :editble="false" @mb-created="init">
					<!-- 边界线 -->
					<block v-if="cur.geo">
						<block v-for="(pm, i) of cur.geo.line" :key="i+'9'">
							<z-line :pm="pm" :opt="layerStyle['bound']"></z-line>
						</block>
					</block>
					<!-- 默认轨迹kml -->
					<block v-for="(pm, i) of t10" :key="i+'1'">
						<z-line :pm="pm" :opt="layerStyle.grade[pm.grade]"  mouseEfc></z-line>
					</block>
				</MapboxMap3D>
			</block>
		</div>
	</div>
</template>

<script>
import { deepTree, isArray, revDeepTree, isPc } from '@/cool/utils';
// import { styles } from '@/components/tdt/utils/utils.js';
// import { ajax } from '@/cool/utils/ajax.js';
import { dc_pm } from '@/config/dict';
// import { layerStyle } from '@/components/mapbox/utils/mbtool.js'
import { clone,  } from '@/cool/utils/dict.js';

export default {
	data() {
		return {
			layerStyle: layerStyle,
			selects: {
				map: 3,
				ids: []
			},
			map:null,
			t10: [],
			
			loading: true,
			center: [120.15, 30.28],
			zoom: 10,
			controls: [
				'mapType',
				{
					name: 'scale',
					position: 'bottomright'
				}
			],
			clusterMarkers: [],
			cMarker: styles,
			marker: [],
			polyline: [],

			infowindow: {
				content: '',
				target: null
			}
		};
	},
	props: {
		cur: { type: Object, default:()=>{return {}}},
		tar: { type: String, default:'placemark'}
	},
	watch: {
		cur: {
			deep: true,
			handler(v) {
				this.loadData();
			}
		}
	},
	mounted() {
		// console.log('mounted--------------',this.cur, this.tar);
		this.loadData()
	},
	methods: {
		init(e){this.map = e.map},
		async loadData() {
			// console.log(this.cur);
			this.center = this.cur.geo.features[0].properties.center
			this.t10=[]
			this.polyline=[]
			this.loading = true
			
			let pm = []
			if(this.tar == 'placemark') {
				pm = await this.$service.zts.placemark.list({ kmlIds: this.cur.kml.map(e=> e._id), t2: 10, list: true })
				for (let x of pm) {
					for (let s of this.cur.kml) {
						if(s._id==x.kmlId) {
							x.grade = s.grade
							x.type = s.type
							break
						}
					}
					x.prop = layerStyle.grade[x.grade]
					x.showDetail = true
					this.polyline.push(x)
					// console.log(x);
				}
			}else {
				for (let s of this.cur.kml) {
					let p = await this.$service.zts.layout.list({pid:s._id})
					let t10 = p.find(e=>{return e.t2==10})
					t10.grade = s.grade
					t10.prop = layerStyle.grade[s.grade]
					pm.push(t10)
				}
			}
			this.loading = false
			this.t10 = pm
		},
		detail(e) {
			console.log('mbAction', e);
			uni.setStorageSync('collect_check', e)
			this.$router.push('/pages/zts/collect/check')
		},
		mapChange(e) {
			console.log(e);
		},
		download() {
			// import('@/cool/utils/ExportKml').then(exp => {
			// 	exp.expKml({
			// 		name: this.cur.dept.name,
			// 		children: this.t10
			// 	})
			// })
		}
	}
};
</script>

<style lang="scss" scoped>
	.container{
		width: 100%;
		height: 100%;
		background-color: #fff;
		padding: 2px;
	}
	.tmap {
		width: 100%;
		height: 625px;

	}
</style>
