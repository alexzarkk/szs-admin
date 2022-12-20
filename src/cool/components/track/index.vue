<template>
	<div class="system" id="layoutChart">
		<div class="pane">
			<!-- chart -->
			<div class="dept" v-loading="loading" @mouseup="mup">
				<l-echart ref="chart" @finished="init"></l-echart>
			</div>

			<!-- 菜单 -->
			<div class="user scroller" v-if="btn&&btn.length>0">
				<block v-for="(e,i) of act" :key="i">
					<el-row type="flex" class="padding-top-xxs" justify="center">
						<block v-for="(x,j) of btn" :key="'_'+j">
							<el-link v-if="x==e.on" :type="e.type" @click="on(i)">{{e.text}}</el-link>
						</block>
					</el-row>
				</block>
			</div>
		</div>
		
		<el-dialog title="路段选定" 
			v-el-drag-dialog
			:modal="false"
			:close-on-click-modal="false"
			:modal-append-to-body="false"
			:lock-scroll="false"
			:visible.sync="select.open">
			
			<el-form :model="select" v-if="select.open">
				<el-form-item label="">
					<el-col :span="24">
						<i class="header-icon el-icon-info"></i>
						【{{ pm.name }}】
						<text class="padding-left-xs text-grey">长度：</text>
						<text class="text-orange text-bold">{{ pm.info.len }}m</text>
						
						<text class="padding-left-xs text-grey">
							海拔：
							<text class="cuIcon-top"></text>
						</text>
						<text class="text-orange text-bold">{{ pm.info.top }}m</text>
						<text class="text-grey"><text class="cuIcon-down"></text></text>
						<text class="text-orange text-bold">{{ pm.info.bottom }}m</text>
						
						<text class="padding-left-xs text-grey">
							累计：
							<i class="header-icon el-icon-top"></i>
						</text>
						<text class="text-orange text-bold">{{ pm.info.up }}m</text>
						<text class="text-grey"><i class="header-icon el-icon-bottom"></i></text>
						<text class="text-orange text-bold">{{ pm.info.down }}m</text>
					</el-col>
				</el-form-item>
				<el-form-item label="范围设定" :label-width="'100px'">
					<el-col :span="24">
						<el-slider v-model="select.range" size="small" range :min="0" :max="pm.info.len" @change="ranged"></el-slider>
					</el-col>
				</el-form-item>
				<el-form-item label="" :label-width="'100px'">
					<el-col :span="24">
						<view class="flex justify-center">
							<el-col :span="12">
								<el-form-item label="起始">
									<el-input-number size="small" :min="0" :max="pm.info.len-1" v-model="select.range[0]" @change="ranged"></el-input-number>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="结束">
									<el-input-number size="small" :min="1" :max="pm.info.len" v-model="select.range[1]" @change="ranged"></el-input-number>
								</el-form-item>
							</el-col>
						</view>
					</el-col>
				</el-form-item>
			</el-form>
			<view class="flex align-center padding-lr">
				<i class="header-icon el-icon-c-scale-to-original"></i>
				<text class="text-dark text-bold padding-left-xs">已设定：{{select.range[1]-select.range[0]}}m</text>
			</view>
			
			<div slot="footer">
				<el-button size="small" @click="select.open = false">取 消</el-button>
				<el-button size="small" type="success" @click="submit" :disabled="!select.coord || !select.coord.length">确 定</el-button>
			</div>
		</el-dialog>
		
	</div>
</template>
<script>

import { math, clone, getDist, calData } from '@/comm/geotools'
import elDragDialog from "./el-dragDialog"

import * as echarts from 'echarts'
import { TitleComponent, ToolboxComponent, TooltipComponent, GridComponent, DataZoomComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
	TitleComponent,
	ToolboxComponent,
	TooltipComponent,
	GridComponent,
	DataZoomComponent,
	LineChart,
	CanvasRenderer,
	UniversalTransition
])
import LEchart from '@/uni_modules/lime-echart/components/l-echart/l-echart.vue'

export default {
	components: { LEchart },
	directives: { elDragDialog },
	props: {
		pm: { type: Object },//坐标数组。
		btn: {type: Array },
		loading: { type: Boolean, default: false },
		selected: { type: Object }
	},
	data() {
		return {
			select: {open:false,len:0,range:[0, this.pm.info.len]},
			option: null,
			act: [
				{
					on: 'copy',
					text:'复制片段',
					type: 'success',
					able: true
				},
				{
					on: 'cut',
					text:'剪切片段',
					type: 'warning',
					able: true
				},
				{
					on: 'del',
					text:'删除片段',
					type: 'danger',
					able: true
				},
				{
					on: 'setStatus',
					text:'路况设定',
					type: 'success',
					able: true
				},
				{
					on: 'setLevel',
					text:'路级设定',
					type: 'warning',
					able: true
				},
				{
					on: 'reverse',
					text:'反转方向',
					type: 'primary'
				},
				{
					on: 'merge',
					text:'轨迹拼接',
					type: 'warning'
				},
				{
					on: 'ele',
					text:'重设海拔',
					type: 'info'
				},
				{
					on: 'download',
					text:'下载',
					type: 'info'
				}
			]
		};
	},
	watch: {
		pm: {
			deep:true,
			handler(v) {
				if (v.coord.length > 0) {
					this.select.range = [0, this.pm.info.len]
					this.init(v)
				}
			}
		},
		// selected: {
		// 	handler(v) {
		// 		this.getSelect()
		// 	}
		// }
	},
	mounted() {
		// console.log('chart ..................');
		// this.init()
		document.addEventListener('resize', this.resize)
	},
	beforeDestroy() {
		try{
			document.removeEventListener('resize')
		}catch(e){
			//TODO handle the exception
		}
	},
	methods: {
		resize(){
			let lc = document.getElementById('layoutChart'),
				size = { width: lc.clientWidth-120, height: lc.clientHeight }
				
			this.$refs.chart.resize(size)
		},
		init(v){
			if (!v) v = this.pm
			this.getSelect()
			this.option = {
				darkMode: true,
				grid: {
					top: 30,
					bottom: 40,
					left: 40,
					right: 40
				},
				tooltip: {
					trigger: 'axis',
					position: function(pt) {
						return [pt[0], '10%'];
					}
				},
				title: {
					show: false,
					left: 'center',
					text: '距离海拔图',
					textStyle: {
						fontSize: 14
					}
				},
				toolbox: {
					show: false,
					feature: {
						restore: {},
						saveAsImage: {}
					}
				},
				xAxis: {
					type: 'value',
					boundaryGap: false
				},
				yAxis: {
					type: 'value',
					boundaryGap: false
				},
				dataZoom: [
					{
						type: 'inside',
						rengeMode:['percent'],
						start: this.select.start,
						end: this.select.end,
					},
					{
						start: 0,
						end: 20,
						height: 30
					}
				],
				series: [
					{
						name: '海拔',
						type: 'line',
						smooth: true,
						symbol: 'none',
						areaStyle: {},
						data: v.info.dElv
					}
				]
			}
			
			this.$refs.chart.init(echarts, 'dark', chart => {
				chart.setOption(this.option)
				chart.on('datazoom', (e) => {
					this.datazoom(e)
				})
			})
		},
		getSelect(){
			if (this.selected&&this.selected.coord) {
				this.select = clone(this.selected)
			} else {
				this.select = {
						range:[0, this.pm.info.len],
						open:false,
						old: [0, 0],
						new: [],
						start:0,
						end:100,
						len: 0,
						coord: []
					}
			}
		},
		datazoom(e) {
			if (e.batch) e = e.batch[0]
			let d = this.pm.coord.length
			
			let start = math(d * (e.start * 0.01), 0)
			let end = math(d * (e.end * 0.01), 0)
			this.select.new = [start, end]
			this.select.start = e.start
			this.select.end = e.end
		},
		mup(e) {
			setTimeout(()=> { this.trunc() }, 33)
		},
		trunc() {
			let pm = this.pm,
				s = this.select
				
			if (s.new.length > 0) {
				if (s.old[0] != s.new[0] || s.old[1] != s.new[1]) {
					let start = math(pm.info.dElv[s.new[0]][0], 0),
						end = math(pm.info.dElv[s.new[1] - 1][0], 0),
						v = pm.coord,
						len = 0,
						c1,
						coord = []
					
					s.range[0] = len
					for (let i = 0; i < v.length; i++) {
						if(i>s.new[1]) break
						if(i>=s.new[0] && i<=s.new[1]) coord.push(v[i])
						
						if(i==s.new[0]) s.range[0] = len
						if(i==s.new[1]) s.range[1] = len
						
						let c2 = v[i]
						if(i>0){
							//水平距离
							let dist = getDist(c1[0], c1[1], c2[0], c2[1])
							
							//斜边距离
							let _dist = dist
							if(c2[2]) _dist = Math.sqrt(Math.pow(dist, 2) + Math.pow(Math.abs(c1[2] - c2[2]), 2))
							
							len += math(_dist,0)
						}
						c1 = v[i]
					}
					s.old = [s.new[0], s.new[1]];
					
					// console.log(s);
					
					
					const h = this.$createElement;
					s.h = [
							h('i', { style: 'color: teal' }, '路段：' + s.range[0] + 'm - ' + s.range[1] + 'm'),
							h('br', null),
							h('i', { style: 'color: orange' }, '长度：' + (s.range[1]-s.range[0]) + 'm')
						]
					
					this.note = this.$notify({
						title: '已选取',
						message: h('p', null, s.h),
						offset: 0
					});
					// s.len = len
					s.coord = coord
					
					this.$emit('on', {select:s, act:'select'})
				}
			}
		},
		on(idx){
			if(this.act[idx].able) {
				this.select.act = this.act[idx].on
				if(!this.select.coord || !this.select.coord.length) this.select.coord = this.pm.coord
				return this.select.open = true
			}
			this.$emit('on', { select: this.select, act: this.act[idx].on })
		},
		ranged(){
			let h = this.$createElement,
				pm = this.pm,
				s = this.select,
				v = pm.coord,
				len = 0,
				c1,
				coord = []
			
			for (let i = 0; i < v.length; i++) {
				if(len>s.range[1]) break
				if(len>=s.range[0] && len<=s.range[1]) coord.push(v[i])
				
				let c2 = v[i]
				if(i>0) {
					//水平距离
					let dist = getDist(c1[0], c1[1], c2[0], c2[1]),
						_dist = dist
					if(c2[2]) _dist = Math.sqrt(Math.pow(dist, 2) + Math.pow(Math.abs(c1[2] - c2[2]), 2))
					
					len += math(_dist,0)
				}
				c1 = v[i]
			}
			
			s.len = s.range[1]-s.range[0]
			s.h = [
						h('i', { style: 'color: teal' }, '路段：' + s.range[0] + 'm - ' + s.range[1] + 'm'),
						h('br', null),
						h('i', { style: 'color: orange' }, '长度：' + s.len + 'm')
					]
					
			s.coord = coord
			this.$emit('on', {select: s, act:'select'})
		},
		submit(){
			this.select.open = false
			this.$emit('on', {select: this.select, act: this.select.act})
		}
		
	}
};
</script>

<style lang="scss" scoped>
.system {
	// height: 100%;
	height: calc(100% - 46px);
	width: 100%;
	.pane {
		display: flex;
		height: 100%;
		width: 100%;
		position: relative;
	}

	.dept {
		height: 100%;
		flex: auto;
		background-color: #f3f3f3;
	}

	.user {
		width: 120px;
		min-width: 120px;
		overflow-y: auto;
		overflow-x: hidden;
		background-color: #2f3447;
		transition: width 0.2s;
		margin-left: 4px;
	}
	.scroller {
		border-top: 1px solid #eaedf4;
		height: 100%;
		box-sizing: border-box;
		overflow-x: hidden;
		overflow-y: scroll;
		// overflow:visible;
		
		&::-webkit-scrollbar
			{
				width:16px;
				height:100%;
				background-color:#000000;
				z-index:99;
				
			}
	}
	

	// @media only screen and (max-width: 768px) {
	// 	.dept {
	// 		width: calc(100% - 100px);
	// 	}
	// }
}
</style>
