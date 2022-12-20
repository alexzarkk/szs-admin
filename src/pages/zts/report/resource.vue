<template>
	<cl-layout>
		<div class="home">
			<el-row :gutter="15">
				<el-col :lg="12" :xs="24">
					<div class="card">
						<!-- 省市区地图 -->
						<geo-map :data="kml" :status="status" @change="mapChange" @showList="showList"></geo-map>
					</div>
				</el-col>
				<el-col :lg="12" :xs="24">
					<block v-if="child.length">
						<div class="card">
							<!-- 统计排名 -->
							<dept-rank :data="child"></dept-rank>
						</div>
					</block>
					<block v-else>
						<zmap :cur="cur" :tar="'layout'" ></zmap>
					</block>
				</el-col>
			</el-row>
			
			<cl-scrollbar>
				<el-row>
					<el-col>
						<div class="card">
							<!-- 坐标数据+图表 -->
							<poi-detail :data="poi"></poi-detail>
						</div>
					</el-col>
				</el-row>
				<!-- <el-row :gutter="15">
					<el-col :lg="12" :xs="24">
						<div class="card">
							<line-detail :title="'路况类型'" :data="kType"></line-detail>
						</div>
					</el-col>
					<el-col :lg="12" :xs="24">
						<div class="card" style="height: 875px;">
							<line-detail :title="'路况等级'" :data="kLevel"></line-detail>
						</div>
					</el-col>
				</el-row> -->
				
				<el-row :gutter="15">
					<el-col :lg="12" :xs="24">
						<div class="card">
							<!-- <count-effect></count-effect> -->
						</div>
					</el-col>
					<el-col :lg="12" :xs="24">
						<div class="card">
							<!-- <hot-search></hot-search> -->
						</div>
					</el-col>
				</el-row>
			</cl-scrollbar>
		</div>
	</cl-layout>
</template>

<script>
import { mapGetters } from "vuex";

import geoMap from './layout/geoMap.vue';
import DeptRank from "./layout/dept-rank";
import LineDetail from "./layout/line-detail";
import PoiDetail from "./layout/poi-detail";
import zmap from "./map/map.vue";
import list from "./list.vue";

import { dept, getCids } from "@/config/dict";
import { prop, point, clone } from '@/cool/utils/dict.js';
// import { math } from '@/cool/utils/ztool.js';
// import { polygonToLine } from '@/components/mapbox/utils/mbtool.js'

export default {
	components: {
		zmap,
		list,
		geoMap,
		LineDetail,
		PoiDetail,
		DeptRank,
	},
	data() {
		return {
			status: 0,
			line: [],
			poiStatus: [],
			poi: [],
			
			cur: {},
			chartData: null,
			kml: [],
			child: [1]
		};
	},
	computed: {
		...mapGetters(['userInfo'])
	},
	mounted(){
		this.dept = dept()
		this.createChart()
	},
	methods: {
		async createChart(e) {
			let geo = this.zz.geo
			let chart = await this.$service.zts.chart.list({ table: 'layout', isoDept: true })
			// console.log(chart);
			this.kml = chart
		},
		
		mapChange(e) {
			
			polygonToLine(e.geo)
			
			this.chartData = e.chart
			let cid = getCids(e.dept.id),
				child = []
			for (var i = 1; i < cid.length; i++) {
				child.push(this.chartData[cid[i]])
			}
			
			let kml = []
			if(!child.length) {
				for (let s of e.kml) {
					if(s.deptId == e.dept.id) {
						kml.push(s)
					}
				}
			}
			let dept = this.zz.geo.clone(e.dept)
			dept.kml = kml
			dept.geo = e.geo
			this.cur = dept
			this.child = child
			console.log('当前cur:',this.cur);
			
			// this.kml = kml
			let cur = this.chartData[e.dept.id]
			// console.log("当前的cur",cur,e)
			let poi = []
			for (let s of clone(point)) {
				if(s.value>20 && s.value<30) {
					poi.push({
						num: cur.chart[s.value]? cur.chart[s.value].total : 0,
						text: s.text
					})
				}
			}
			this.poi = poi
		},
		async getPm(d){
			d.loading = true
			d.pm = await this.$service.zts.layout.list({pid:d._id})
			delete d.loading
		},
	}
};
</script>

<style lang="scss" scoped>
	.home {
		overflow: hidden auto;

		::v-deep .card {
			background-color: #fff;
			border-radius: 5px;
			margin-bottom: 15px;
			font-size: 12px;
			letter-spacing: 0.5px;

			&__header {
				display: flex;
				align-items: center;
				height: 50px;
				padding: 0 20px;

				.label {
					font-size: 12px;
				}

				.value {
					font-size: 18px;
					font-weight: bold;
					margin-left: 10px;
				}
			}

			&__container {
				padding: 0 20px;
				height: 50px;
			}

			&__footer {
				display: flex;
				align-items: center;
				height: 50px;
				border-top: 1px solid #f7f7f7;
				font-size: 12px;
				margin: 0 5px;
				padding: 0 15px;
				box-sizing: border-box;

				.label {
					margin-right: 10px;
				}

				.value {
					font-size: 13px;
				}
			}
		}
	}
</style>
