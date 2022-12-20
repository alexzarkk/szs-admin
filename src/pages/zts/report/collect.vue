<template>
	<cl-layout>
		<div class="home">
			<el-row :gutter="15">
				<el-col :lg="12" :xs="24">
					<div class="card">
						<!-- 省市区地图 -->
						<geo-map :data="kml" :type="type" @change="mapChange" @showList="showList"></geo-map>
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
						<zmap :cur="cur"></zmap>
					</block>
				</el-col>
			</el-row>
			
			<cl-scrollbar>
				<el-row :gutter="15">
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
					
				</el-row>
				<el-row>
					<el-col>
						<div class="card">
							<!-- 坐标数据+图表 -->
							<poi-detail :data="poi"></poi-detail>
						</div>
					</el-col>
				</el-row>
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
		<cl-dialog :width="'100%'" :props="{ top:'0vh',fullscreen:true }" title="数据列表" :visible.sync="listShow">
			<list :data="kml"></list>
		</cl-dialog>
	</cl-layout>
</template>

<script>
import { mapGetters } from "vuex";

import geoMap from './components/geoMap.vue';
import DeptRank from "./components/dept-rank";
import LineDetail from "./components/line-detail";
import PoiDetail from "./components/poi-detail";
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
			listShow: false,
			type: 9,
			kLevel: [],
			kType: [],
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
		 this.createChart()
	},
	methods: {
		createChart(e) {
			this.$service.zts.chart.list({
				table: 'kml',
				type: this.type,
				cache: false,
				isoDept: true
			}).then(res => {
				console.log(res);
				this.kml = res
			});
		},
		
		mapChange(e) {
			
			polygonToLine(e.geo)
			
			this.chartData = e.chart
			let cid = getCids(e.dept.id),
				child = []
			for (var i = 1; i < cid.length; i++) {
				child.push(this.chartData[cid[i]])
			}
			this.child = child
			
			let cur = this.chartData[e.dept.id]
			
			console.log("当前的cur",cur)
			
			const n = (s,x,t)=>{return cur[9]? (cur[9][x][s]? cur[9][x][s][t]: ''):''}
			const line = (arr)=>{
				let t = []
				for (let s of arr) {
					t.push({
						name: prop[s].name,
						num: n(s,'t','num'),
						len: math(n(s,'t','len') / 1000, 2) || '',
						pic: n(s,'t','pic')
					})
				}
				return t
			}
			this.kLevel = line([11,12,13])
			this.kType = line([101,102,103,104,105,106,110,120])
			let poi = clone(point)
			for (let s of poi) {
				s.num = n(s.value,'p','num')
				s.pic = n(s.value,'p','pic')
			}
			
			this.poi = poi
			// console.log(this.kLevel);
			// console.log(this.kType);
			// console.log(this.poi);
			
			this.cur = e
		},
		showList(e){
			console.log(e);
			this.listShow = true
		}
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
