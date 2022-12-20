<template>
	<div class="system">
		<view>
			<view class="flex align-center justify-between">
				<view class="solid-bottom">
					<text class="padding-left-xs text-grey">位置：</text>
					<text class="text-orange text-bold">{{pm.curName}}</text>
					<text class="padding-left-xs text-grey">名称：</text>
					<text class="text-orange text-bold">{{pm.name}}</text>
					<text class="padding-left-xs text-grey">海拔：</text>
					<text class="text-orange text-bold">{{pm.coord[2]}}m</text>
					
					<text class="padding-left-xs text-grey">记录时间：</text>
					<text class="text-orange text-bold">{{pm.curTime.substring(0,16)}}</text>
				</view>
				<view>
					<el-button size="mini" @click="refresh">重置</el-button>
				</view>
			</view>
		</view>
		<v-chart class="chart" v-if="option" :option="option" @click="events" autoresize></v-chart>
		
	</div>
</template>
<script>
import { clone } from '@/cool/utils';
// import { math } from '@/cool/utils/ztool';

// //import VChart, { THEME_KEY } from 'vue-echarts';
// import * as echarts from 'echarts'
// import { GaugeChart } from 'echarts/charts';
// import { CanvasRenderer } from 'echarts/renderers';

// import { GridComponent, ToolboxComponent } from 'echarts/components'

// // import { SVGRenderer } from 'echarts/renderers';
// echarts.use([GaugeChart, CanvasRenderer, GridComponent, ToolboxComponent])

let thiz;
export default {
	components: {
		VChart
	},
	provide: {
		[THEME_KEY]: 'auto'
	},
	props: {
		pm: { type: Object }, //坐标数组。
		selected: { type: Object } //当前选取的
	},
	data() {
		return {
			cur: 0,
			targets: [],
			curEdit: { idx: -1, edit: -1 },
			option: null
		};
	},
	watch: {
		pm: {
			deep: true,
			handler(v1,v2) {
				// if(v1._id!=v2._id) {
					this.option = null
					setTimeout(function() {thiz.init(v1)}, 1);
				// }else {
					// this.init(v1)
				// }
			}
		}
	},
	mounted() {
		thiz = this;
		console.log('direction chart mounted ===========================');
		this.init();
	},
	methods: {
		init(v) {
			// console.log(this.pm)
			let curD = this.pm.curDrect
			let series = [{
						name: 'readDirect',
						type: 'gauge',
						startAngle: 90 + curD,
						endAngle: -270 + curD+0.1,
						min: 0,
						max: 360,
						splitNumber: 12,
						//边框
						axisLine: {
							color: '#000000',
							lineStyle: {
								width: 3,
								color: [
									[1, 'rgba(0, 0, 0, 0.7)']
								],
								shadowColor: 'rgba(166, 166, 166, 0.5)',
								// shadowBlur: 15,
								// roundCap:true
							}
						},
						//度数指示
						splitLine: {
							color: '#000000',
							lineStyle: {
								
								shadowColor: 'rgba(68, 68, 68, 0.3)',
								// shadowBlur: 6,
								// shadowOffsetX: 1,
								// shadowOffsetY: 2
							}
						},
						//度数表
						axisLabel: {
							fontSize: 14,
							distance: 10,
							color: '#000000',
							lineHeight:10,
							width:10,
							formatter: function (value) {
								if (value == 0) {
									return '';
								}
								return value;
							}
						},
						
						//logo
						anchor: {
							show: true,
							size: 15,
							showAbove: true,
							itemStyle: {
								color: '#000000',
								// shadowColor: 'rgba(0, 0, 0, 0.3)',
								// shadowBlur: 8,
								// shadowOffsetX: 2,
								// shadowOffsetY: 2
							}
						},
						//站位朝向
						pointer: {
							show:true,
							icon:'arrow',
							width: 14,
							length: '12%',
							offsetCenter: [0, '-120%'],
							itemStyle: {
								color: '#000000',
								shadowColor: 'rgba(225, 225, 225, 0.3)',
								// shadowBlur: 2,
								// shadowOffsetX: 2,
								// shadowOffsetY: 2,
								// opacity:0.8
							}
						},
						detail: {
							show: true,
							offsetCenter: [0, '-108%'],
							formatter: [
								'{a|'+curD+'° '+(this.pm.curName)+'\n'+(this.pm.name||this.pm.sn)+' '+this.pm.coord[2]+'m' + '}',
							].join('\n'),
							rich: {
								a: {
									color: 'black',
									lineHeight: 16
								}
							}
						},
						title: {
							offsetCenter: [0, '30%']
						},
						data: [{
							value: 0
						}],
					}]
					
			const setTarget = (t)=>{
				return  [''+ t.map((e)=>{
							let t = '{a|'+e.name 
							if(e.data) t += ' '+(e.data[0]>=1000?e.data[0]/1000+'km':e.data[0]+'m')+' '+(e.data[1]>0?'↑'+(e.data[1]):'')+(e.data[2]>0?'↓'+(e.data[2]):'')+'m'
							return t + '}'
						}).join('\n') +''].join('\n')
			}
			if(this.pm.direction) {
				for (var i = 0; i < this.pm.direction.length; i++) {
					let t = this.pm.direction[i]
					
					const hudu = 2*Math.PI/360*t.angle[0]
					let x = Math.sin(hudu) * 120
					let y = -Math.cos(hudu) * 120
					
					series.push(this.getPointer({
									name:'target'+i,
									len: t.angle[1]==-1?60:40,
									offc: [0, '-10%'],
									value: t.angle[0],
									color: (this.cur.idx==i&&this.cur.edit==0)? '#39b54a':'#e26817',
									opacity: 0.8,
									detail: {
										show: t.angle[1]==-1,
										offc: [x+'%', y+'%'],
										fmt: setTarget(t.target)
									} 
								}))
					
					if(t.angle[1]>-1) {
						
						const hudu2 = 2*Math.PI/360*(t.angle[0]-t.angle[1])
						let m = Math.sin(hudu2) * 48
						let n = -Math.cos(hudu2) * 48
						series.push(this.getPointer({
										name:'target'+i+'2',
										len: 48,
										offc: [m+'%', n+'%'],
										value: t.angle[1],
										color: (this.cur.idx==i&&this.cur.edit==1)? '#39b54a':'#e26817',
										opacity: 0.7,
										detail: {
											show: t.angle[1]>-1,
											offc: [x+'%', y+'%'],
											fmt: setTarget(t.target)
										}
									}))
						
					}else{
						//
					}
				}
			}
			this.option = {
							grid: {
								top: 20,
								bottom: 20,
								left: 20,
								right: 20
							},
							toolbox: {
								show: true,
								feature: {
									saveAsImage: {
										type: 'png', // png svg
										name: '指引柱',
										title: '下载'
									}
								}
							}, series }
			return
			
			const getEswn = (d,a,name) => {
				let _a = 360 - d + a
				if (_a > 360) _a -= 360
				if (_a == 360) _a = 0
				return {_a,name}
			}
			let eswn = [getEswn(curD,90,'东'), getEswn(curD,180,'南'), getEswn(curD,270,'西'), getEswn(curD,360,'北')]
			// console.log(eswn)
			for (let s of eswn) {
				const hudu = 2*Math.PI/360*s._a
				let x = Math.sin(hudu) * 78
				let y = -Math.cos(hudu) * 78
				
				series.push({
					name: 'eswn',
					type: 'gauge',
					startAngle: 90,
					endAngle: -270,
					min: 0,
					max: 360,
					splitNumber: 12,
					axisLabel: false,
					axisLine: { show: false },
					axisTick: { show: false },
					splitLine: { show: false },
					detail: { show:false },
					pointer: { show: false },
					data: [{
						value: s._a,
						name: s.name,
						title: {
							offsetCenter:  [x+'%', y+'%'],
						}
					 }]
				})
			}
		},
		getPointer(d){
			return {
				name: d.name,
				type: 'gauge',
				startAngle: 90,
				endAngle: -270,
				min: 0,
				max: 360,
				animationEasingUpdate: 'bounceOut',
				axisLine: {
					show: false
				},
				splitLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				axisLabel: {
					show: false
				},
				pointer: {
					icon: d.len==40?'rect':'path://M239.223,199.878 L218.906,228.903 C218.435,229.576 218.182,230.376 218.182,231.197 L218.182,231.197 C218.182,233.406 219.973,235.196 222.183,235.196 L222.183,235.196 L233.303,235.196 L233.304,505.697 C233.304,510.667 237.333,514.697 242.304,514.697 L242.304,514.697 C247.275,514.697 251.304,510.667 251.304,505.697 L251.304,505.697 L251.303,235.196 L262.818,235.196 C263.638,235.196 264.438,234.944 265.111,234.473 L265.111,234.473 C266.922,233.206 267.361,230.712 266.094,228.903 L266.094,228.903 L245.777,199.878 C245.509,199.495 245.177,199.163 244.794,198.895 L244.794,198.895 C244.096,198.406 243.297,198.172 242.505,198.172 L242.505,198.172 C241.243,198.172 240.002,198.767 239.223,199.878 L239.223,199.878 Z',
					width: d.len==40?8:20,
					length: d.len+'%',
					offsetCenter: d.offc,
					itemStyle: {
						color: d.color,
						opacity: d.opacity,
						// shadowColor: 'rgba(0, 0, 0, 0.3)',
						// shadowBlur: 8,
						// shadowOffsetX: 2,
						// shadowOffsetY: 2
					}
				},
				anchor: {
					show: false,
				},
				detail: {
					show: d.detail.show,
					fontSize: 14,
					color: '#ff5500',
					offsetCenter: d.detail.offc,
					formatter:  d.detail.fmt,
					rich: {
						a: {
							color: 'red',
							fontSize: 16,
							lineHeight: 20
						}
					}
				},
				
				data: [{
						value: d.value
					}]
			}
		},
		mup(e) {
			console.log('mouse up ----------->',this.pm)
			let thiz = this;
			setTimeout(function() {
				// thiz.trunc();
			}, 111);
		},
		events(e){
			console.log('events ----------->',e)
		},
		on(act) {
			//this.$emit('on', { act });
		},
		refresh(){
			this.option = null
			// let t = this
			// setTimeout(function() {t.init()}, 10);
			this.$emit('refresh');
		}
	}
};
</script>

<style lang="scss" scoped>
.system {
	padding: 0px;
	position: relative;
	height: 100%;
	width: calc(100%);
	.echarts {
		width: calc(100%);
		height: calc(100%);
	}
}
</style>
