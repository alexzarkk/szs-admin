<template>
	
	<el-row :gutter="15">
		<el-col :lg="12" :xs="24">
			<div class="card">
				
				<div class="hot-search">
					<div class="hot-search__header bg-gray">
						<span>坐标数据</span>
					</div>
				
					<div class="hot-search__container">
				
						<div class="hot-search__table">
							<el-table :data="data" border size="mini" fit style="width: 100%">
								<el-table-column prop="text" label="坐标名称"></el-table-column>
								<el-table-column prop="num" label="数量"></el-table-column>
								<el-table-column prop="pic" label="照片数"></el-table-column>
							</el-table>
						</div>
					</div>
				</div>
				
			</div>
		</el-col>
		<el-col :lg="12" :xs="24">
			<div class="card">
				<div class="hot-search">
					<div class="hot-search__header bg-gray">
						<span>图表</span>
					</div>
					<div class="hot-search__container">
						<div class="hot-search__chart">
							<v-chart v-if="option" :option="option" autoresize></v-chart>
						</div>
					</div>
				</div>
			</div>
		</el-col>
	</el-row>
	
	
	
	
</template>

<script>
	
	//import VChart, { THEME_KEY } from 'vue-echarts';
	import * as echarts from 'echarts'
	import { GridComponent, LegendComponent } from 'echarts/components';
	import { BarChart } from 'echarts/charts';
	import { CanvasRenderer } from 'echarts/renderers';
	
	echarts.use([GridComponent, LegendComponent, BarChart, CanvasRenderer]);
	

export default {
	components: {
		VChart,
	},
	provide: {
		[THEME_KEY]: 'auto'
	},
	data() {
		return {
			option: null,
		};
	},
	props: {
		data: { type: Array }
	},
	watch: {
		data: {
			deep: true,
			handler(v) {
				if (v.length) this.init();
			}
		}
	},
	mounted(){
		this.init()
	},
	methods: {
		init() {
			let seriesData = [],
				yAxisData = []
			
			for (let s of this.data) {
				if(s) {
					seriesData.push(s.num);
					yAxisData.push(s.text);
				}
			}
			let option = {
				grid: {
					top: 20,
					bottom: 40,
					left: 55,
					right: 55
				},
				title: {
					text: 'Weather Statistics'
				},
				xAxis: {
					max: 'dataMax'
				},
				yAxis: {
					type: 'category',
					data: yAxisData,
					inverse: true,
					animationDuration: 200,
					animationDurationUpdate: 200,
					// max: 13 // only the largest 3 bars will be displayed
				},
				title: { show: false },
				series: [
					{
						realtimeSort: true,
						name: 'fdd',
						type: 'bar',
						data: seriesData,
						itemStyle: {
								color: '#5470c6'
							},
						label: {
							show: true,
							position: 'right',
							valueAnimation: true
						}
					}
				],
				legend: {
					show: false
				},
				animationDuration: 0,
				animationDurationUpdate: 2000,
				animationEasing: 'linear',
				animationEasingUpdate: 'linear'
			};
			this.option = option;
		}
	}
};
</script>

<style lang="scss" scoped>
.hot-search {
	height: 580px;
	&__header {
		display: flex;
		align-items: center;
		height: 50px;
		font-size: 15px;
		font-weight: bold;
		color: $uni-color-main;
		padding: 0 20px;
	}

	&__chart {
		display: flex;
		justify-content: space-between;
		padding: 20px;
		height: 440px;

	}

	&__table {
		padding: 10px;

		::v-deep .el-table {
			&__header {
				th {
					background-color: #fff !important;
				}
			}
		}
	}
}
</style>
