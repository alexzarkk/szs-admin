<template>
	<div class="tab-chart">
		<div class="tab-chart__header">
			<ul class="tab-chart__tab">
				<li class="active">部门数据</li>
				<!-- <li>km</li> -->
			</ul>
			<span class="tab-chart__year">Km</span>
		</div>

		<div class="tab-chart__container">
			<v-chart :option="option" autoresize></v-chart>
		</div>
	</div>
</template>

<script>
//import VChart, { THEME_KEY } from 'vue-echarts';
import * as echarts from 'echarts'
import { ToolboxComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([ToolboxComponent, TooltipComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer]);

import { kml } from '@/cool/utils/dict.js';
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
			option: {}
		};
	},
	props: {
		data: { type: Object },
		cur: { type: Object }
	},
	watch: {
		cur: {
			deep: true,
			handler(v) {
				if (v != null) this.init();
			}
		}
	},
	methods: {
		init() {
			let series = [],
				xAxisData = [],
				legend = {
					data: [],
					selected: {}
				},
				labelOption = {
					show: false,
					position: 'insideBottom',
					distance: 15,
					align: 'left',
					verticalAlign: 'middle',
					rotate: '90',
					formatter: '{c}  {name|{a}}',
					fontSize: 12,
					
					rich: {
						name: {}
					}
				}
				
			kml.forEach((k, i) => {
				legend.data.push(k.text)
				legend.selected[k.text] = (i==0 || this.cur.t2 == k.value)
				series.push({
						name: k.text,
						type: 'bar',
						barGap: 0,
						label: labelOption,
						emphasis: {
							focus: 'series'
						},
						data: []
					})
			})
			
			let dept = this.cur.dept
			if(!dept.leaf){
				let child = []
				for (let k in this.data) {
					let s = this.data[k]
					if(s.pid == dept.id) {
						xAxisData.push(s.name)
						child.push(s)
					}
				}
				for (var i = 0; i < child.length; i++) {
					let s = child[i]
					kml.forEach((k, j) => {
						series[j].data[i] = 0
						if(s[k.value]) {
							series[j].label.show = true
							series[j].data[i] = math(s[k.value].line.len / 1000, 2)
						}
					})
				}
			}
			
			this.option = {
				grid: {
					top: 60,
					bottom: 40,
					left: 60,
					right: 60
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					}
				},
				legend: legend,
				toolbox: {
					show: true,
					orient: 'vertical',
					left: 'right',
					top: 'center',
					feature: {
						// mark: { show: true },
						// dataView: { show: true, readOnly: false },
						// magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
						// restore: { show: true },
						saveAsImage: { show: true }
					}
				},
				xAxis: [
					{
						type: 'category',
						axisTick: { show: false },
						data: xAxisData
					}
				],
				yAxis: [
					{
						type: 'value'
					}
				],
				series: series
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.tab-chart {
	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 50px;
		padding: 0 20px;

		ul {
			li {
				list-style: none;
				float: left;
				margin-right: 20px;
				font-size: 15px;
				color: #dbdbdb;
				cursor: pointer;

				&.active {
					color: #000;
					font-weight: bold;
				}
			}
		}
	}

	&__year {
		font-size: 14px;
		position: relative;

		&::before {
			display: block;
			content: "";
			height: 8px;
			width: 8px;
			border-radius: 8px;
			background-color: #000;
			position: absolute;
			left: -15px;
			top: 4px;
		}
	}

	&__container {
		height: 600px;
		min-height: 400px;
		padding: 0 15px;

		.echarts {
			height: 100%;
			width: 100%;
		}
	}
}
</style>
