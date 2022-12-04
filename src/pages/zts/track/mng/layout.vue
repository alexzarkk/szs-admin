<template>
	<cl-layout>
		<div class="system-user" :style="winStyle">
			<div class="pane">
				<!-- 部门区域 -->
				<div v-show="ids.length" class="dept" :class="[!expand ? '_expand' : '_collapse']">
					<cl-dept-tree :deptId="userInfo.dept.id" @check="deptSet"></cl-dept-tree>
				</div>

				<!-- 规划列表 -->
				<div class="user">
					<div class="container">
						<el-collapse v-if="map" v-model="activeName" accordion>
							<view class="solid">
								<el-collapse-item name="1">
									<template slot="title">
										<div class="icon cursor padding-xs flex align-center"  @click.stop="deptExpand">
											<i class="text-xl el-icon-arrow-right" v-if="expand"></i>
											<i class="text-xl el-icon-arrow-left" v-else></i>
										</div>
										<i class="header-icon el-icon-info"></i>
										<el-link class="padding-left-xs" type="info">当前部门：{{dname}}</el-link>
									</template>
									<div class="track-chart solid">
										<kmlList :deptId="userInfo.dept.id" :ids="ids" @on="onSelect"></kmlList>
									</div>
								</el-collapse-item>
							</view>
						</el-collapse>
						<div class="tmap" id="_map" v-loading="loading">
							<!-- <tdt-map :center="t.center" :zoom="t.zoom" :controls="t.controls" @init="init">
								<tdt-infowindow :target="t.infowindow.target" :content="t.infowindow.content" @close="t.infowindow.target = null"></tdt-infowindow>
								<tdt-marker-cluster :markers="t.clusterMarkers" :styles="t.cMarker" @click="clusterClick"></tdt-marker-cluster>
								
								<block v-for="(pm, idx) of t.polyline" :key="9000+idx">
									<zts-polyline
										:path="pm.coord"
										:edit="pm.edit"
										:weight="pm.prop.weight"
										:lineStyle="pm.prop.lineStyle"
										:color="pm.prop.color"
										:opacity="pm.prop.opacity"
										:tools="false"
										:extData="pm">
									</zts-polyline>
								</block>
									
								<block v-if="geo.length">
									<block v-for="(ft, idx) of geo" :key="idx">
										<block v-for="(coord, idxx) of ft.geometry.coordinates" :key="idx+''+idxx">
											<tdt-polygon :path="coord[0]"
												color="white" 
												:opacity="0.3"
												:fillColor="'white'"
												:fillOpacity="0">
											</tdt-polygon>
										</block>
									</block>
								</block>
							</tdt-map> -->
						</div>
					</div>
				</div>
			</div>
		</div>
	</cl-layout>
</template>

<script>
import kmlList from './list.vue';

import { mapGetters } from "vuex";
// import { revDeepTree } from "@/cool/utils";
// import { ajax } from '@/cool/utils/ajax.js';
// import { styles } from '@/components/tdt/utils/utils.js';
// import { kmlType, dept } from '@/cool/utils/dict.js';

export default {
	components: {
		kmlList
	},
	data() {
		return {
			deptTree: false,
			expand: this.$store.getters.userInfo.isLeaf,
			kt: kmlType,
			ids: [],
			dname:'',
			activeName: '1',
			winStyle: '',
			geo:[],
			loading: false,
			
			curNode: {},
				
			
			map:null,
			t: {
				center: [120.15, 30.28],
				zoom: 10,
				geocoder: null,
				controls: [
					'mapType',
					{
					  name: "scale",
					  position: "bottomright"
					}
				],
				clusterMarkers: [],
				cMarker: styles,
				marker: [],
				polyline: [],
				
				infowindow: {
					content: "",
					target: null
				}
			}
		}
	},
	watch: {
		lay: {
			deep: true,
			handler(v) {
				this.setWin();
			}
		}
	},
	computed: {
		...mapGetters(['lay','userInfo'])
	},
	mounted() {
		this.setWin()
		this.setBounds(this.userInfo.dept.id)
	},
	methods: {
		setWin() { this.winStyle = `width:${this.lay.width}px; height:${this.lay.height}px;` },
		init(e){
			this.map = e
			this.t.geocoder = new T.Geocoder()
			this.setCenter(this.userInfo.dept.name)
		},
		setBounds(id){
			ajax({
				url: './static/geo/chart/' + id + '.json'
			}).then(geo=>{
				this.geo = geo.features
			})
		},
		setCenter(name){
			if(!this.t) return
			this.t.geocoder.getPoint(name, (e)=>{
				this.t.center = [e.location.lon, e.location.lat]
			})
		},
		deptExpand() { this.expand = !this.expand },
		async onSelect(e){
			let coord,
				marker = [],
				polyline = [],
				clusterMarkers = [];
			if(e.length) {
				this.loading = true;
				for (let s of e) {
					await this.$service.zts.placemark.list({ kmlId: s._id }).then((t) => {
						let pms = revDeepTree(t)
						for (let pm of pms) {
							if(pm.t1){
								if(pm.t1==1) polyline.push(pm)
								if(pm.t1==2) marker.push(pm)
							}
						}
						clusterMarkers = marker.map(e => {
							return {
								position: e.coord,
								extData: e
							};
						})
					})
				}
				this.loading = false
			}
			if(polyline.length){
				coord = polyline[0].coord
				coord = coord[(coord.length/2).toFixed(0)*1]
			} else if(marker.length){
				coord = marker[0].coord
			}
			if(coord) this.map.centerAndZoom(new T.LngLat(coord[0], coord[1]), 12);
			
			this.t.marker = marker
			this.t.polyline = polyline
			this.t.clusterMarkers = clusterMarkers
		},
		
		deptSet(e) { 
			this.ids = e
			this.setBounds(e[0])
			this.dname = dept[e[0]]
			this.setCenter(this.dname)
		},
		clusterClick({ layer }) {
			const { options: { extData } } = layer
			this.t.infowindow = {
				target: layer,
				content: `<h3>${extData.name}</h3>`
			};
		}
	}
};
</script>

<style lang="scss" scoped>
.system-user {
	
	.pane {
		display: flex;
		height: 100%;
		position: relative;
	}

	.dept {
		height: 100%;
		width: 200px;
		border: 1px solid #e9ecf1;
		background-color: #fff;
		overflow-y: auto;
		overflow-x: hidden;
		transition: width 0.3s;
		margin-right: 8px;

		&._collapse {
			margin-right: 0;
			width: 0;
		}
	}

	.user {
		width: calc(100% - 310px);
		flex: 1;
	}
	
	.dept,
	.user {
		.container {
			height: calc(100% - 0px);
			display: flex;
			flex-direction: column;
			height: 100%;
			position: relative;
			padding: 0px 10px 10px 0px;
			box-sizing: border-box;
			background-color: #fff;
			overflow: hidden;
			.tmap{
				width: calc(100%);
				height: calc(100%);
			}
			.el-menu-vertical-demo {
				border: 1px solid #dcdfe6;
				position: absolute;
				top: 43px;
				font-size: 14px;
				min-width: 200px;
				z-index: 999;
				::v-deep .el-tree-node__content {
					height: 36px;
				}
			}
			::v-deep .el-submenu__title{
				height: 40px;
				display: flex;
				flex: 1;
				justify-content: flex-start;
				align-items: center
			}
			::v-deep .el-collapse-item__header {
				height: 36px;
				background-color: #f5f5f5;
			}
			::v-deep .el-collapse-item__content {
				padding: 6px;
			}
			::v-deep .cl-crud {
				padding: 0px;
			}
		}
		.scroller {
			border-top: 1px solid #eaedf4;
			height: calc(100% - 60px);
			box-sizing: border-box;
			overflow-x: hidden;
		}
	}

	.track-chart {
		height: calc(100vh - 1000px);
		min-height: calc(100vh * 0.4);
		width: 100%;
	}
	
	@media only screen and (max-width: 768px) {
		.dept {
			width: calc(100% - 100px);
		}
	}
}

</style>
