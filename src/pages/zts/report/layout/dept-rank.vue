<template>
	<div class="sales-rank">
		<div class="sales-rank__header bg-gray">
			<view class="padding-left-sm">统计排名 
				<text class="text-sm padding-left-xs text-grey">合计：</text>
				<text class="text-sm text-orange text-bold">{{len}}km</text>
			</view>
		</div>
		<el-container v-loading="data.length==1">
			<div class="sales-rank__container">
				<v-chart v-if="option" :option="option" autoresize></v-chart>
				<!-- <ul class="sales-rank__list">
					<div class="sales-rank__header bg-gray">
						<view class="padding-left-sm"><span>子部门进度</span></view>
					</div>
					<block v-if="childDept.length">
						<el-table :data="childDept" height="352" border size="mini" fit style="width: 100%">
							<el-table-column prop="name" label="部门"></el-table-column>
							<block v-for="(k,idx) of kml" :key="idx">
								<el-table-column :prop="k.value+''" :label="k.text"></el-table-column>
							</block>
						</el-table>
					</block>
					<block v-else>
						<li>
							<span></span>
							<span>暂无数据 ...</span>
						</li>
					</block>
				</ul> -->
			</div>
		</el-container>
	</div>
</template>

<script>
//import VChart, { THEME_KEY } from 'vue-echarts';
import * as echarts from 'echarts'
import { GridComponent, LegendComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([GridComponent, LegendComponent, BarChart, CanvasRenderer]);

// import { math } from '@/cool/utils/ztool.js';
export default {
	components: {
		VChart
	},
	provide: {
		[THEME_KEY]: 'auto'
	},
	data() {
		return {
			childDept: [],
			option: null,
			len: 0,
			kml: [ {text:'布局组网',value:9} ]
		};
	},
	props: {
		data: { type: Array },
		kmlType: { type: Number, default: 9 }
	},
	watch: {
		data: {
			deep: true,
			handler(v) {
				if (v != null) this.init();
			}
		}
	},
	mounted(){
		this.init()
	},
	methods: {
		init() {
			let kt = this.kmlType,
				len=0,
				seriesData = [],
				yAxisData = []
			
			for (let s of this.data) {
				if(s) {
					len += s.chart?s.chart[10].len:0
					seriesData.push(s.chart?math(s.chart[10].len / 1000, 2):0);
					yAxisData.push(s.name);
				}
			}
			this.len = math(len/1000, 2)
			
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
@import '@/static/css/common.scss';

.sales-rank {
	&__header {
		display: flex;
		align-items: center;
		height: 40px;
		width: 100%;
		font-size: 15px;
		font-weight: bold;
		color: $uni-color-main;
		padding: 0;
	}

	&__container {
		height: 570px;
		padding: 20px;
		width: 100%;
		.echarts {
			height: 100%;
			width: 100%;
		}
	}


	&__list {
		height: 392px;

		li {
			display: flex;
			align-items: center;
			height: 52px;
			list-style: none;
			font-size: 13px;
			cursor: pointer;

			span {
				&:first-child {
					display: inline-block;
					height: 14px;
					width: 14px;
					border-radius: 14px;
					text-align: center;
					line-height: 14px;
					font-size: 12px;
				}

				&:nth-child(2) {
					flex: 1;
					margin: 0 10px;
					letter-spacing: 0.5px;
					color: #222;
					@include text_ellipsis();
				}
			}

			&:nth-last-child(n + 3) {
				span {
					&:first-child {
						background-color: $uni-color-main;
						color: #fff;
					}
				}
			}

			&:hover {
				span:nth-child(2) {
					text-decoration: underline;
				}
			}
		}
	}
}
</style>
