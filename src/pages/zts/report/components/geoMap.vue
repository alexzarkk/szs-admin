<template>
	<div class="tab-chart">
		<view class="flex align-center justify-between" style="width: 90%;">
			<view class="flex justify-start padding-bottom-xs">
				<el-radio-group size="mini" v-model="grade" @change="changeGrade">
					<block v-for="(g,i) of kmlGrade" :key="i">
						 <el-radio-button :label="g.value">{{g.label}}</el-radio-button>
					</block>
				</el-radio-group>
				<view class="padding-left-xs flex align-center">
					<!-- <el-link type="primary" @click="showList">列表</el-link> -->
				</view>
			</view>
			
			<view class="flex align-center justify-start">
				<block v-for="(b, idx) of breads" :key="idx">
					<i v-if="idx > 0" class="el-icon-arrow-right"></i>
					<el-link @click="levelBack(idx)">{{ b.name }}</el-link>
				</block>
			</view>
		</view>
		<div class="echarts" id="main" autoresize></div>
	</div>
</template>
<script>
import * as echarts from 'echarts'
import { TitleComponent, ToolboxComponent, TooltipComponent, VisualMapComponent, GeoComponent } from 'echarts/components';
import { MapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TitleComponent, ToolboxComponent, TooltipComponent, VisualMapComponent, GeoComponent, MapChart, CanvasRenderer]);

// import { math } from '@/cool/utils/ztool.js';
// import { ajax } from '@/cool/utils/ajax.js';

import { dept } from "@/config/dict";
import { kmlGrade, clone } from '@/cool/utils/dict.js';

let thiz;
export default {
	name: 'geo-map',
	props: {
		data: { type: Array },
		type: { type: Number }
	},
	watch: {
		data: {
			deep: true,
			handler(v) {
				if (v != null) this.init(this.user.departmentId);
			}
		}
	},
	data() {
		return {
			kmlGrade: clone(kmlGrade),
			chartData: null,
			grade: 0,
			
			kml:null,
			deptId:0,
			geo:null,
			user: {},
			myChart: {},
			breads: [],
			option: {}
		};
	},
	mounted() {
		thiz = this;
		this.kmlGrade.unshift({label:"全部", value:0})
		this.dept = dept()
		this.user = uni.getStorageSync('8C7D00B_token');
		this.breads.push(this.user.dept);

		let myChart = echarts.init(document.getElementById('main'));
		myChart.on('click', function(params) {
			if (params.data.leaf) return;
			thiz.breads.push(params.data);
			thiz.init(params.data.id);
		});
		window.onresize = myChart.resize;
		this.myChart = myChart;
		this.myChart.showLoading();
	},
	methods: {
		levelBack(e) {
			let arr = [];
			for (var i = 0; i < this.breads.length && i <= e; i++) {
				arr.push(this.breads[i]);
			}
			this.breads = arr;
			this.init(this.breads[e].id);
		},
		init(deptId) {
			// console.log(this.breads);
			this.deptId = deptId
			this.myChart.showLoading();
			ajax({
				url: './static/geo/chart/'+((deptId % 100 === 0)?'/full/':'') + deptId + '.json'
			}).then(geoJson => {
				this.geo = geoJson
				
				thiz.breads[thiz.breads.length - 1].leaf = geoJson.features.length == 1;

				echarts.registerMap('zts', geoJson);
				let dept = [];
				for (let s of geoJson.features) {
					dept.push({ name: s.properties.name, leaf: geoJson.features.length == 1, id: s.properties.adcode, pid: s.properties.parent.adcode });
				}
				thiz.option = {
					title: {
						// left: 'right',
						text: '数据采集进度 （Km）',
						subtext: '数据列表',
						sublink: '/#/pages/zts/collect/list'
					},
					tooltip: {
						trigger: 'item',
						formatter: `{b}：{c}km`
						// 地图 : {a}（系列名称），{b}（区域名称），{c}（合并数值）, {d}（无）
					},
					toolbox: {
						show: true,
						orient: 'vertical',
						left: 'right',
						top: 'center',
						feature: {
							// dataView: { readOnly: false },
							// restore: {},
							// saveAsImage: {}
						}
					},
					visualMap: {
						min: 0,
						max: 3000,
						text: ['High', 'Low'],
						realtime: false,
						calculable: true,
						inRange: {
							color: ['white', 'lightskyblue', 'yellow', 'orangered']
						}
					},
					series: [
						{
							name: '环浙步道实施进度',
							type: 'map',
							map: 'zts', // 自定义扩展图表类型
							label: {
								show: true
							},
							data: dept,
							// 自定义名称映射
							nameMap: {}
						}
					]
				};
				this.changeGrade()
				
			});
		},
		changeGrade(e){
			if(e) this.grade = e
			let dept = clone(this.dept)
			
			let kmls = []
			for (let kml of this.data) {
				if(this.deptId == kml.deptId && ((kml.type == this.type && !this.grade) || (kml.type == this.type && kml.grade == this.grade))) {
					kmls.push(kml)
				}
				
				const setDept = (dp, key) => {
					if(!dp[key]) {
						dp[key] = {
									kmlNum: 0,
									line: {num: 0, len: 0, pic: 0},
									poi: {num: 0, pic: 0},
									t: {},
									p: {}
								}
					}
					if((kml.type == this.type && !this.grade) || (kml.type == this.type && kml.grade == this.grade)) {
						
						for (let k in kml.t) {
							if(!dp[key].t[k]) dp[key].t[k] = {num: 0, len: 0, pic: 0}
							dp[key].t[k].num += kml.t[k].num
							dp[key].t[k].len += kml.t[k].len
							dp[key].t[k].pic += kml.t[k].pic
						}
						for (let k in kml.p) {
							if(!dp[key].p[k]) dp[key].p[k] = {num: 0, pic: 0}
							dp[key].p[k].num += kml.p[k].num
							dp[key].p[k].pic += kml.p[k].pic
						}
						
						dp[key].kmlNum ++
						dp[key].line.num += kml.line.num
						dp[key].line.len += kml.line.len
						dp[key].line.pic += kml.line.pic
						
						dp[key].poi.num += kml.poi.num
						dp[key].poi.pic += kml.poi.pic
						
						if(dp.pid > 0 && dept[dp.pid]) {
							setDept(dept[dp.pid], key)
						}
					}
				}
				setDept(dept[kml.deptId], this.type)
			}
			// console.log('chartData------------', kmlIds);
			this.kml = kmls
			this.chartData = dept
			this.setData();
		},
		setData(e) {
			let cur = this.breads[this.breads.length - 1];
			let max = 0;
			for (let s of this.option.series[0].data) {
				s.value = 0;
				let deptV = this.chartData[s.id][this.type];
				if (deptV) s.value = math(deptV.line.len / 1000, 2);
				if (s.value > max) max = s.value;
			}
			this.option.visualMap.max = max;
			thiz.myChart.setOption(thiz.option);
			thiz.myChart.hideLoading();
			this.$emit('change', {dept: cur, chart: this.chartData, geo: this.geo, kml: this.kml});
		},
		showList(){
			this.$emit('showList');
		}
	}
};
</script>

<style lang="scss" scoped>
.tab-chart {
	width: 100%;
	height: 600px;
	padding: 25px;
	.echarts {
		height: 100%;
		width: 100%;
	}
}
</style>
