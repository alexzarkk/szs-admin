<template>
	
	<div class="hot-search">
		<div class="hot-search__header bg-gray">
			<span>{{title}}</span>
			<view>
				<text class="text-sm padding-left-xs text-grey">合计长度：</text>
				<text class="text-sm text-orange text-bold">{{len}}km</text>
			</view>
		</div>
	
		<div class="hot-search__container">
			
			<div class="hot-search__table">
				<el-table :data="data" border size="mini" fit style="width: 100%">
					<el-table-column prop="name" :label="title"></el-table-column>
					<el-table-column prop="num" label="路段数量"></el-table-column>
					<el-table-column prop="len" label="长度(km)"></el-table-column>
					<el-table-column prop="pic" label="照片数"></el-table-column>
				</el-table>
			</div>
			
			<div class="hot-search__chart" id="div_chart">
				
				<l-echart ref="chart" :enableHover="true"  @finished="init"></l-echart>
				
				<!-- <block v-if="data.length">
					<l-echart ref="chart" @finished="init"></l-echart>
				</block>
				<block v-else>
					 <el-divider>无数据</el-divider>
				</block> -->
			</div>
			
		</div>
	</div>
	
</template>

<script>
	
import * as echarts from 'echarts'
import { CanvasRenderer } from "echarts/renderers"
import { PieChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components"
echarts.use([ CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent ])
import LEchart from '@/uni_modules/lime-echart/components/l-echart/l-echart.vue'

export default {
	components: { LEchart },
	props: {
		data: { type: Array },
		title: { type: String, default: '' }
	},
	data() {
		return {
			option: {},
			len: 0
		};
	},
	watch: {
		data: {
			deep: true,
			handler(v) {
				if (v.length) this.cal()
			}
		}
	},
	mounted(){
		this.cal()
	},
	methods: {
		init(){
			this.$refs.chart.init(echarts, chart => {
				chart.setOption(this.option)
			})
		},
		cal() {
			// console.log('line.chart.cal .............',this.data);
			let legend = [],
				len = 0,
				data = []
				
			for (let s of this.data) {
				len += s.len*1
				legend.push(s.name)
				data.push({value: s.len, name: s.name})
			}
			this.len = this.zz.math(len, 2)
			
			let option = {
				 tooltip: {
				        trigger: 'item',
				        formatter: '{a} {b}: {c} ({d}%)'
				    },
				    legend: {
						left: 'center',
				        data: legend
				    },
				    series: [
				        {
				            name: this.title,
				            type: 'pie',
				            radius: ['35%', '60%'],
				            labelLine: {
				                length: 30,
				            },
							grid: {
								top: 20,
								bottom: 40,
								left: 55,
								right: 55
							},
				            label: {
				                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
				                backgroundColor: '#F6F8FC',
				                borderColor: '#8C8D8E',
				                borderWidth: 1,
				                borderRadius: 4,
				                
				                rich: {
				                    a: {
				                        color: '#6E7079',
				                        lineHeight: 22,
				                        align: 'center'
				                    },
				                    hr: {
				                        borderColor: '#8C8D8E',
				                        width: '100%',
				                        borderWidth: 1,
				                        height: 0
				                    },
				                    b: {
				                        color: '#4C5058',
				                        fontSize: 14,
				                        fontWeight: 'bold',
				                        lineHeight: 33
				                    },
				                    per: {
				                        color: '#fff',
				                        backgroundColor: '#4C5058',
				                        padding: [3, 4],
				                        borderRadius: 4
				                    }
				                }
				            },
				            data: data
				        }
				    ]
				}
				
			this.option = option
		}
	}
};
</script>

<style lang="scss" scoped>
.hot-search {
	// height: 800px;
	height: 100%;
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
		width: 100%;
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
