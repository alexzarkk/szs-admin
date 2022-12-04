<template>
	<cl-layout>
		<div class="system-user" :style="winStyle">
			<div class="pane">
				<!-- 轨迹坐标 列表  可折叠 -->
				<div class="kml scroller1" :class="[pm.expand ? '_expand' : '_collapse']">
					<div class="header solid flex align-center justify-between">
						<!-- 采集 -->
						<block v-if="kml.type == 9">
							<block v-if="kml.status == -1">
								<el-tooltip class="item" effect="dark" content="恢复" placement="top">
									<el-button type="success" size="mini" icon="el-icon-refresh-right" circle @click="setStatus(2)"></el-button>
								</el-tooltip>
								<el-tooltip class="item" effect="dark" content="下载轨迹(防止误操作,下载以作备份)" placement="top">
									<el-button type="info" size="mini" icon="el-icon-download" circle @click="download"></el-button>
								</el-tooltip>
							</block>
							<block v-else>
								<block v-if="kml.status < 6">
									<el-tooltip class="item" effect="dark" content="复核" placement="top">
										<el-button type="success" size="mini" icon="el-icon-check" circle @click="check"></el-button>
									</el-tooltip>
								</block>
								<block v-if="kml.status == 6">
									<el-tooltip class="item" effect="dark" content="审核" placement="top">
										<el-button v-permission="$service.zts.kml.permission.verify" icon="el-icon-s-check" size="mini" circle type="success" @click="veryfy"></el-button>
									</el-tooltip>
								</block>
								<block v-if="kml.status >= 10">
									<el-tooltip class="item" effect="dark" content="详情统计/更新" placement="top">
										<el-button type="success" size="mini" icon="el-icon-finished" circle @click="reCount"></el-button>
									</el-tooltip>
								</block>

								<block v-if="kml.status >= 10">
									<el-tooltip v-permission="$service.zts.kml.permission.veriBack" class="item" effect="dark" content="退审" placement="top">
										<el-button type="warning" size="mini" icon="el-icon-refresh-left" circle @click="setStatus(kml.status==10?4:10)"></el-button>
									</el-tooltip>
									
									<!-- <el-tooltip class="item" effect="dark" content="上传轨迹" placement="top">
										<el-button type="info" size="mini" icon="el-icon-upload2" circle @click="upload"></el-button>
									</el-tooltip> -->
								</block>
							
								<block v-else>
									<el-tooltip class="item" effect="dark" content="上传轨迹" placement="top">
										<el-button type="info" size="mini" icon="el-icon-upload2" circle @click="upload"></el-button>
									</el-tooltip>
								</block>

								<el-tooltip class="item" effect="dark" content="下载轨迹(防止误操作,下载以作备份)" placement="top">
									<el-button type="info" size="mini" icon="el-icon-download" circle @click="download"></el-button>
								</el-tooltip>

								<el-tooltip class="item" effect="dark" content="编辑" placement="top">
									<el-button type="primary" size="mini" icon="el-icon-edit" circle :disabled="!cur.pm.t1 > 0" @click="edit"></el-button>
								</el-tooltip>
								<el-tooltip class="item" effect="dark" content="删除" placement="top">
									<el-button type="danger" size="mini" icon="el-icon-delete" circle :disabled="!cur.pm.t1 > 0" @click="del"></el-button>
								</el-tooltip>
							</block>
						</block>
						<block v-else>
							<el-tooltip class="item" effect="dark" content="下载轨迹" placement="top">
								<el-button type="info" size="mini" icon="el-icon-download" circle @click="download"></el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="上传轨迹" placement="top">
								<el-button type="info" size="mini" icon="el-icon-upload2" circle @click="upload"></el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="编辑" placement="top">
								<el-button type="primary" size="mini" icon="el-icon-edit" circle :disabled="!cur.pm.t1 > 0" @click="edit"></el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="删除" placement="top">
								<el-button type="danger" size="mini" icon="el-icon-delete" circle :disabled="!cur.pm.t1 > 0" @click="del"></el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="统计信息" placement="top">
								<el-button type="success" size="mini" icon="el-icon-finished" circle @click="reCount"></el-button>
							</el-tooltip>
						</block>
						
						<el-tooltip class="item" effect="dark" content="清理缓存并刷新" placement="top">
							<el-button style="padding:2px;" type="primary" size="mini" icon="el-icon-refresh" circle @click="kmlRefresh(0,1)"></el-button>
						</el-tooltip>
					</div>
					<!-- 树形结构 -->
					<div class="container">
						<div class="scroller">
							<el-table v-loading="pm.loading"
								border
								ref="table"
								style="width: 100%"
								row-key="_id"
								size="mini"
								highlight-current-row
								
								:data="pm.list"
								:expand-row-keys="pm.keys"
								:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
								@row-click="rowClick"
								@row-contextmenu="onRowContextMenu">
								
								<el-table-column prop="name"  label="轨迹/坐标" header-align="center" tooltip-effect>
									<template slot-scope="scope">
										
										<el-checkbox :indeterminate="scope.row.isIndeterminate" v-model="scope.row.checked" @change="rowCheck(scope.row)"></el-checkbox>
										
										<!-- folder -->
										<block v-if="scope.row.t1==9">
											<el-tag size="mini" :effect="scope.row._id<11?'dark':'plain'" type="primary" style="margin-left:4px;cursor:pointer;">{{scope.row.name}}</el-tag>
										</block>
										
										<!-- linestring -->
										<block v-else-if="scope.row.t1==1">
											<el-link type="Warning" style="margin-left:4px;">{{scope.row.name}}</el-link>
										</block>
										
										<!-- placemark -->
										<block v-else-if="scope.row.t1==2">
											<el-link type="info" style="margin-left:4px;font-size: 10pt;">{{scope.row.name}}</el-link>
										</block>
										
										<!-- polygon -->
										<block v-else="scope.row.t1==3">

										</block>
										
									</template>
								</el-table-column>
								
								<!-- <el-table-column label="编辑" width="50" align="center">
									<template slot-scope="scope">
										<el-button type="danger" size="mini" @click="del(scope.row)">删除</el-button>
									</template>
								</el-table-column> -->
								
							</el-table>
						</div>
					</div>
				</div>

				<!-- 成员列表 -->
				<div class="user">
					<div class="header">
						<div class="icon padding-left-xs" @click="pm.expand=!pm.expand">
							<i class=" el-icon-arrow-left" v-if="pm.expand"></i>
							<i class="el-icon-arrow-right" v-else></i>
						</div>
						<!-- 选择部门 -->
						<el-tooltip class="item" effect="dark" content="设定当前地图的区域范围和边界线" placement="top">
							<span class="padding-left-xs">
								<cl-dept-cascader :size="'mini'" @input="deptChange" />
							</span>
						</el-tooltip>
						<span class="padding-left-xs">
							<el-tooltip effect="light" :content="(tmap.onNear?'关闭':'加载')+'已组网路线（当前范围）'" placement="top">
								<el-button style="padding:5px;" size="mini" :icon="tmap.onNear?'el-icon-circle-close':'zts-layout'" circle @click="onNear" ></el-button>
							</el-tooltip>
						</span>
						<span class="padding-left-xs" v-if="kml.type == 9 && t9.length && kml.status <= 4">
							<el-tooltip class="item" effect="dark" content="还原默认轨迹" placement="top">
								<el-button type="primary" size="mini" icon="el-icon-refresh-right" circle @click="backDef"></el-button>
							</el-tooltip>
						</span>
						<span class="padding-lr-xs">
							<block v-if="drawing">
								<el-button size="mini" type="infor" @click="cancelDraw">取消</el-button>
								<el-button v-if="drawed && drawed.pm.t1==1" size="mini" type="success" @click="continueDraw">继续</el-button>
								<el-button size="mini" type="primary" :disabled="drawed == null && !lookingEle" v-loading="lookingEle" @click="saveDraw">保存</el-button>
							</block>
							<block v-else>
								<view class="padding-left-xs">
									<el-tooltip class="item" effect="dark" content="新增坐标" placement="top">
										<el-button type="success" size="mini" icon="el-icon-s-flag" circle @click="doDraw('draw_point')"></el-button>
									</el-tooltip>
									<el-tooltip class="item" effect="dark" content="绘制轨迹" placement="top">
										<el-button type="success" size="mini" icon="el-icon-share" circle @click="doDraw('draw_line_string')"></el-button>
									</el-tooltip>
								</view>
							</block>
						</span>
						<cl-flex1 />
						
						<!-- 测试 -->
						<!-- <el-tooltip class="item" effect="dark" content="测试" placement="top">
							<el-button type="primary" size="mini" icon="el-icon-setting" circle @click="_test"></el-button>
						</el-tooltip> -->
						
						<span class="padding-right-sm">
							<!-- 采集 -->
							<block v-if="kml.type == 9">
								<el-tooltip v-if="kml._id">
									<div slot="content">
										采集员：{{ kml.collectorname }}
										<br />
										采集时间：{{ kml.startTime.substring(0, 16) + ' - ' + kml.endTime.substring(11, 16) }}
										<br />
										上传时间：{{ kml.createTime.substring(0, 16) }}
										<br />
										上次修改：{{ kml.updateTime.substring(0, 16) }}
										<br />
									</div>
									<el-link type="info">{{ (kml.sn || '') + ' ' + kml.name }}</el-link>
								</el-tooltip>
							</block>
							<block v-else>
								<el-link type="info">{{ kml.name }}</el-link>
							</block>
						</span>
					</div>
					<div class="container">
						<cl-crud ref="crud">
							
							<zz-map-draw v-if="!pm.loading"
								ref="zmap"
								:pms="pms"
								:cur="acted"
								:lay="mapHeight"
								
								@action="action"
								:grid="false"></zz-map-draw>
							
							<el-collapse v-if="acted.info" v-model="activeName" accordion>
								<el-collapse-item name="1">
									<template slot="title">
										<i class="header-icon el-icon-info"></i>
										【{{ acted.name }}】
										<text class="padding-left-xs text-grey">长度：</text>
										<text class="text-orange text-bold">{{ acted.info.len }}m</text>

										<text class="padding-left-xs text-grey">
											海拔：
											<text class="cuIcon-top"></text>
										</text>
										<text class="text-orange text-bold">{{ acted.info.top }}m</text>
										<text class="text-grey"><text class="cuIcon-down"></text></text>
										<text class="text-orange text-bold">{{ acted.info.bottom }}m</text>

										<text class="padding-left-xs text-grey">
											累计：
											<i class="header-icon el-icon-top"></i>
										</text>
										<text class="text-orange text-bold">{{ acted.info.up }}m</text>
										<text class="text-grey"><i class="header-icon el-icon-bottom"></i></text>
										<text class="text-orange text-bold">{{ acted.info.down }}m</text>
										
										<block v-if="cur.sInfo.len">
											<text class="padding-left-xs text-dark">
												(已选取路段)
											</text>
										</block>
									</template>
									<div class="track-chart">
										<zts-track-chart
											:pm="acted"
											:btn="['copy','cut','del', 'setStatus', 'setLevel', 'reverse', 'merge','ele', 'download']"
											:selected="cur.selectedTrack"
											@on="tcAction"
										></zts-track-chart>
									</div>
								</el-collapse-item>
							</el-collapse>
						</cl-crud>
						<!-- 线路详情统计/更新 -->
						<cl-dialog :width="'60%'" :height="lay.height - 42 + 'px'" :props="{ top: '0vh' }" :title="kml.name" :visible.sync="checking">
							<!-- <checking :kml="kml" :height="lay.height" @checked="checked"></checking> -->
						</cl-dialog>
						<!-- 指引柱的详细信息 -->
						<cl-dialog :width="'100%'" :props="{ top: '0vh', fullscreen: true }" title="指引柱" :visible.sync="cur.directionChart">
							<block v-if="t29 && cur.directionChart">
								<!-- <direction :t29="t29" :refKml="refKml" :directPoi.sync="directPoi" :height="lay.height" :t10="t10" @refresh="kmlRefresh"></direction> -->
							</block>
						</cl-dialog>
					</div>
				</div>
			</div>
		</div>
	</cl-layout>
</template>

<script>
import { mapGetters } from 'vuex';
// import { deepTree, dateToTime, isArray, revDeepTree, isPc, clone, openWin } from '@/cool/utils';

import { open, merge, check, veryfy, del, veri } from '@/cool/utils/pmCurd';
import { upload } from '@/cool/utils/uploadKml.js';
import { calData } from '@/comm/geotools';

// import { coord2String, layerStyle, polygonToLine, createGeo, getAround, getElevation, pmTree, removeLayer } from '@/components/mapbox/utils/mbtool.js';

// import Checking from '../collect/checking.vue';
// import Direction from './direction.vue';

// import { setMask, setLineString } from '@/cool/utils/ztool.js'

export default {
	// components: {
	// 	Direction,
	// 	Checking
	// },
	data() {
		return {
			kml: {},
			pms: [],
			acted: {},
			pm: {
				list: [],
				keys: ['10','2','3'],
				loading: false,
				expand: true
			},
			
			
			isMapDataReady: false,
			checking: false,
			// layerStyle: layerStyle,
			winStyle: '',
			maptype: '3D',
			
			directPoi: {},
			cur: {
				pm: {},
				sInfo:{},
				line: { info: {} },
				selectedTrack: {},
				chartRender: false,
				directionChart: false
			},
			activeName: '1',
			trackEdit: false,

			tmap: {
				render: true,
				center: [120.15, 30.28],
				zoom: 10,
				onLoc: false,
				aroundLoc: null,
				onNear: false,
				controls: [
					'mapType',
					{
						name: 'scale',
						position: 'bottomright'
					}
				]
			},

			geo: null,
			
			drawing: false,
			drawed: null,
			kmlDraw: null,
			lookingEle: false,
			
			t10: null,
			t29: null,
			t9: [],
			refKml: {
				line: [],
				point: []
			},

			marker: [],
			polyline: [],
			zx: [],

			infowindow: {
				content: '',
				target: null
			}
		};
	},
	computed: {
		...mapGetters(['lay', 'userInfo']),
		mapHeight() {
			return [this.lay.height - 460, this.lay.width - (this.pm.expand? 416:16)]
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
	activated() {
		this.kmlRefresh(true);
		// let memory = window.performance.memory.usedJSHeapSize
		// console.log("map页面获得焦点（单位：MB）",(memory/1024)/1024)
	},
	deactivated() {
		// let memory = window.performance.memory.usedJSHeapSize
		// console.log("map页面失去焦点（单位：MB）",(memory/1024)/1024)
		this.activeName = '1';
		this.polyline = [];
		this.marker = [];
		this.infowindow.target = null;
		this.cur.selectedTrack = {};
		this.cur.sInfo = {};
		this.cur.chartRender = false;
		this.kml.cur = { status: 0 };
		this.t10 = null;
		this.t29 = null;
		this.t9 = [];

		// window.m = null
		this.reset();
	},
	mounted() {
		this.setWin();
		this.kmlRefresh(true);
		
		// let memory = window.performance.memory.usedJSHeapSize
		// console.log("map页面加载时内存（单位：MB）",(memory/1024)/1024)
		
		
	},
	beforeDestroy() {
		// let memory = window.performance.memory.usedJSHeapSize
		// console.log("map页面销毁时内存情况（单位：MB）",(memory/1024)/1024)
		delete window.m;
	},
	methods: {
		setZx(e) { this.zx = e },
		setWin() {
			this.winStyle = `width:${this.lay.width}px; height:${this.lay.height}px;`;
		},
		
		rowClick(e,c){
			if (c.property && e.children) {
				this.$refs["table"].toggleRowExpansion(e)
			} else {
				this.acted = e
			}
			console.log(e,c);
		},
		rowCheck(z){
			const set = (d) =>{
				if(d.children) {
					for (let s of d.children) {
						s.checked = d.checked
						set(s)
					}
				}
			}
			set(z)
			this.pm = this.zz.clone(this.pm)
			
			// let pms = []
			// const deep =(d)=>{
			// 	if(d.children) {
			// 		for (let s of d.children) {
			// 			deep(s)
			// 		}
			// 	}else{
			// 		if(d.checked) pms.push(d)
			// 	}
			// }
			// for (let s of this.pm.list) {
			// 	deep(s)
			// }
			this.setPms()
			
			console.log('line ----->', this.pms,this);
		},
		
		
		changeMapType(e) {
			if (e == '3D' && !this.notified3D) {
				this.$notify({ title: '提示', message: '按住鼠标右键并移动（查看3D地形）', offset: 100 });
				this.notified3D = true;
			}
			// if (e == 'zj' && !this.notifiedZj) {
			// 	this.$notify({ title: '提示', message: '浙江天地图提供影像和标注存在西南偏移20-30m情况，绘制或标注时请作参考使用', offset: 100 });
			// 	this.notifiedZj = true;
			// }
		},
		init(e) {
			this.map = e.map;
			this.draw = e.draw;
			window.m = this;
		},
		reset() {
			this.tmap.aroundLoc = null;
			this.marker = [];
			this.polyline = [];
			this.activeLine = {};
			this.refKml = { line: [], point: [] };
			this.kml.checked = []
			if (this.maptype != 'tdt' && this.map) {
				this.cancelDraw();
				removeLayer(this.map);
				try {
					this.map.pp.remove();
				} catch (e) {}
			}
		},

		async kmlRefresh(center,force=0) {
			if(force) {
				let tp = this.maptype
				this.maptype = ''
				setTimeout(()=>{this.maptype=tp},1)
			}
			this.kml.loading = true; // 开始加载地图
			let id = uni.getStorageSync('collect_check'); //  kml id ？
			// console.log('获取到的id', id);
			let kml = await this.$service.zts.kml.info({ id, noChild: true }); //   从这个id 获取到kml 的详情   === 当前的轨迹详情
			// console.log('接口获取到的kml的数据', kml);
			// this.$api.log(kml,'kml-info 接口数据==========================')
			console.log('当前的kml---->', kml);
			// this.$api.log(this.kml,"当前的this.kml")
			let thiz = this
			
			//{label:"制图", value:6}
			if (center){
				setTimeout(function(){
					if(kml.type==6) thiz.maptype = 'outdoor'
				},1)
			}
			
			
			//是否改变了kml
			if (!this.kml._id || this.kml._id != id) {
				this.geo = null;
				if (kml.departmentId != 330000) {
					// this.zz.ajax({
					// 	url: './static/geo/chart/' + kml.departmentId + '.json'
					// }).then(g => {
					// 	polygonToLine(g);
					// 	this.geo = g
					// 	this.map.fitBounds(this.zz.geo.turf.box(g.line[0].coord), {
					// 		padding: {top:40, bottom:40, left: 40, right: 40}
					// 	})
					// });
				}
				//采集时引用的轨迹
				if (kml.type==9&&kml.kmlId) {
					this.$service.zts.kml.info({ id: kml.kmlId }).then(res => {
						// console.log('kml-info接口======================', res);
						let refKml = revDeepTree(res.children),
							line = [],
							point = [];
						for (let s of refKml) {
							s.ref = true;
							if (s.t1 == 1) line.push(s);
							if (s.t1 == 2) point.push(s);
						}
						this.refKml.line = line;
						this.refKml.point = point;
					})
				}
			}
			this.kml = kml
			this.pm = {
				list: [],
				keys: ['10','2','3'],
				loading: true,
				expand: true
			}
			
			this.$service.zts.placemark.list({ kmlId: id, tree: true, force }).then(res => {
				let keys = [],
					checked = []
				
				if(res.length<100) {
					for(let s of res) {
						s.checked = true
						if(s.kmlId) {
							if(s.t1==1) s.info = calData(s.coord,true)
							checked.push(s)
						}
						
						// if(typeof s._id == 'number') keys.push(s._id+'')
					}
				}
				this.pm = {
					list: this.zz.deepTree(res),
					keys,
					loading: false,
					expand: true
				}
				this.setPms()
				console.log('获取到的标记点的信息placemark-list接口  ============', this.pms);
			})
		},
		setPms(){
			this.pms = this.zz.revDeepTree(this.pm.list).filter(e=>e.coord!=undefined)
		},

		chartRefresh(time) {
			this.cur.chartRender = false;
			let thiz = this;
			setTimeout(function() {
				thiz.cur.chartRender = true;
			}, time);
		},

		kmlExpand() {
			this.kml.expand = !this.kml.expand;
			this.chartRefresh(300);
		},
		// 轨迹点击 展示动画
		
		
		//tdt
		
		action(e){
			console.log('map.action',e);
			// if (!veri.call(this, {})) return;
			
			switch (e.act){
				case 'drawing':
					this.drawEvt(e)
					break;
				case 'add':
					open.call(this,{act: 'addLine', pm: e.pm })
					break;
				case 'edit':
					open.call(this,{act: 'edit', pm: e.pm })
					break;
				case 'del':
					del.call(this,{pm: e.pm })
					break;
				case 'draw':
					this.drawing = true
					this.kmlDraw = e.pm
					this.$refs.zmap.exec({m:'doDraw', e})
					break;
				case 'direct':
					this.directPoi = e.pm
					this.cur.directionChart = true
					break;
				default:
					break;
			}
		},
		markOn(e) {
			// console.log(e)
			if (e.e == 'edit') return open({ thiz: this, act: 'edit', pm: e.pm });
			if (e.e == 'del') return del({ thiz: this, pm: e.pm });
			if (e.e == 'direct') {
				this.directPoi = e.pm;
				return (this.cur.directionChart = true);
			}
			//move
			this.cur.idx = e.idx;
			this.cur.t1 = e.pm.t1;
			this.cur.e = e.e;
			e.pm[e.e] = true;
			this.marker.splice(e.idx, 1, e.pm);
		},
		//更新坐标位置
		mkDbclick(e) {
			if (this.cur.e == 'dragging') {
				if (veri.call(this, {})) {
					this.$service.zts.placemark.update({ _id: e.extData._id, coord: [e.lnglat.getLng(), e.lnglat.getLat(), e.extData.coord[2]], updateCoord: true }).then(res => {
						this.$message.success(`更新成功`)
						e.extData[this.cur.e] = false
						this.marker.splice(this.cur.idx, 1, e.extData)
						this.cur.e = ''
					});
				}
			}
		},

		marked(e) {
			// console.log('marked',e)
			open({ thiz: this, act: 'addPoint', pm: { coord: [e.currentLnglat.getLng(), e.currentLnglat.getLat(), 0] } });
		},
		check() {
			this.checking = true;
		},
		checked(e) {
			// console.log('checked',e);
			this.kml.cur = e
			this.checking = false
		},
		veryfy() {
			openWin('/#/pages/zts/collect/verify');
		},
		edit() {
			open({ thiz: this, act: 'edit', pm: this.cur.pm });
		},
		del() {
			return del({ thiz: this, pm: this.cur.pm });
		},
		//从chart中返回的事件
		tcAction({ select, act }) {
			console.log('tcAction', select);
			if (act == 'select') {
				let center
				// console.log(select)
				if (this.activeLine.id) {
					// 尾部相等
					if (coord2String(this.activeLine.coord[this.activeLine.coord.length - 1]) == coord2String(select.coord[select.coord.length - 1])) {
						center = select.coord[0];
					} else if (coord2String(this.activeLine.coord[0]) == coord2String(select.coord[0])) {
						center = select.coord[select.coord.length - 1];
						
					} else {
						center = select.coord[(select.coord.length / 2).toFixed(0) * 1];
					}
				} else {
					center = select.coord[(select.coord.length / 2).toFixed(0) * 1];
				}
				this.activeLine = { id: 'selected', coord: select.coord };
				
				this.cur.sInfo = this.zz.geo.calData(select.coord)
				this.map.flyTo({center})
				return (this.cur.selectedTrack = select);
			}
			if (act == 'addPoint') {
				this.$notify({
					title: '提示',
					message: '请用鼠标在地图上选取坐标位置',
					position: 'bottom-right'
				});
				return this.$refs.mousetool.open('markTool');
			}
			if (act == 'reverse') {
				let pm = this.cur.line;
				// if(pm.t2==10) return this.$message.error("原始采集轨迹不支持更新操作！")
				return this.updateCoord(pm._id, pm.coord.reverse());
			}
			if (act == 'merge') {
				return merge.call(this);
			}
			if (act == 'ele') {
				if (!veri.call(this, {})) return;
				this.$confirm('此操作将会覆盖原有数据，是否继续？', '提示', {
					type: 'warning'
				}).then(res => {
						if (res === 'confirm') {
							this.kml.loading = true;
							getElevation(this.cur.line.coord).then(e => {
								// console.log('getElevation ............',e);
								this.$service.zts.placemark.update({ _id: this.cur.line._id, coord: e, updateCoord: true }).then(res => {
									this.$message.success(`海拔更新成功`);
									this.kmlRefresh();
								});
							});
						}
					}).catch(() => null)
				return;
			}
			if (act == 'download') {
				let kml = clone(this.kml.cur);
				kml.children = [{_id: 'LineString_t1',
								name: '轨迹',
								children: [this.cur.line],
							}]
				return this.zz.expKml(kml);
			}
			this.cur.selectedTrack = select
			open({ thiz: this, act, pm: this.cur.pm })
		},
		updateCoord(_id, coord) {
			if (veri.call(this, {})) {
				this.$service.zts.placemark.update({ _id, coord, updateCoord: true }).then(res => {
					this.$message.success(`更新成功`);
					this.kml.loading = false;
					this.reset();
					this.kmlRefresh();
					// this.kmlCheck(e)
				});
				if (this.kml.cur.status >= 10) this.$service.zts.kml.createChart({ _id: this.kml.cur._id });
			}
		},
		upload() {
			if (veri.call(this, {})) {
				upload.call(this, {
					kml: null,
					e: { coord: false },
					kt: this.kml.cur.type,
					fn: async (pms,data) => {
						for (let s of pms) {
							// return console.log({...s, ...data, kmlId: this.kml.cur._id});
							await this.$service.zts.placemark.add({...s, ...data, kmlId: this.kml.cur._id})
						}
						this.reset();
						this.kmlRefresh();
					}
				});
				if (this.kml.cur.status >= 10) this.$service.zts.kml.createChart({ _id: this.kml.cur._id });
			}
		},
		download() {
			let kml = clone(this.kml.cur);
			kml.children = clone(this.kml.list);
			this.zz.expKml(kml);
		},
		async reCount() {
			// this.kml.loading = true;
			// this.chart = await this.$service.zts.chart.get({ id: this.kml.cur._id })
			// this.kml.loading = false;
			this.check();
		},
		setStatus(e) {
			if (veri.call(this, {})) {
				this.$confirm('确定' + (e == 2 ? '撤销删除' : '退回审核') + '？', '提示', {
					type: 'warning'
				}).then(res => {
					if (res === 'confirm') {
						this.$service.zts.kml
							.update({
								status: e,
								_id: this.kml.cur._id
							})
							.then(e => {
								if (e == 4) this.$service.zts.chart.delete({ ids: [this.kml.cur._id] });

								this.kml.cur.status = e;
								// uni.setStorageSync('collect_check', this.kml.cur._id);
								this.kmlRefresh();
								//删除报表
							});
					}
				});
			}
		},
		async backDef() {
			this.kml.loading = true;
			for (let s of this.t9) {
				let pm = clone(s);
				pm.t2 = 10;
				pm.coord = pm.coord.map(e => {
					return [e[0], e[1], e[2]];
				});
				delete pm._id;
				await this.$service.zts.placemark.add(pm);
			}
			this.kml.loading = false;
			this.reset();
			this.kmlRefresh();
		},
		
		// mapbox ----------------------------------------- /////////////////// >
		doDraw(e) {
			if (!veri.call(this, {})) return
			this.$refs.zmap.exec({m:'doDraw', e:{e}})
			this.drawing = true
		},
		continueDraw() {
			let coord = this.drawed.pm.coord
			this.$refs.zmap.exec({m:'doDraw', e:{
													e:'draw_line_string',
													name:this.drawed.pm.name,
													o:{
														featureId: this.drawed.featureId,
														from: coord[coord.length - 1]
													}}})
		},
		cancelDraw(id) {
			this.lookingEle = false
			this.drawing = false
			this.drawed = null
			
			this.$refs.zmap.exec({m:'finishDraw', e:{pm:this.kmlDraw}})
			this.kmlDraw = null
		},
		drawEvt(e) {
			let geo = e.geo.geometry,
				id = e.geo.id,
				coord = geo.coordinates;

			if (e.type == 'draw.create') {
				if (geo.type == 'Point') this.drawed = {thiz: this, act: 'addPoint', pm: {t1:2, coord } };
				if (geo.type == 'LineString') this.drawed = {thiz: this, act: 'addLine', pm: {t1:1, coord } };
			}
			if (e.type == 'draw.update') {
				try {
					this.drawed.pm.coord = coord
				} catch (e) {
					this.drawed = { pm: { ...this.kmlDraw, coord } }
				}
			}
			this.drawed.featureId = id
		},
		async saveDraw() {
			this.lookingEle = true;
			console.log(this.drawed.pm);
			let pm = this.drawed.pm,
			coord = await getElevation(pm.coord, pm.t1==1)
			
			this.lookingEle = false;
			if (this.kmlDraw) {
				this.updateCoord(this.kmlDraw._id, coord)
			} else {
				this.drawed.pm.coord = coord
				open(this.drawed)
			}
			try{ this.draw.notify.close() }catch(e){ }
			this.draw.notify = null
		},

		
		mbEvt(e) {
			
		},
		
	
		
		
		deptChange(event) {
			// console.log('获取到的部门的信息', event);
			let deptNum = event[event.length -1]; // 当前选择的部门
			// console.log("当前选择的部门",deptNum)
			if(deptNum){
				setMask(this.map,Number(deptNum));
				// setLineString(this.map,Number(deptNum))
			}
		},
		
		
	}
};
</script>

<style lang="scss" scoped>
.system-user {
	.pane {
		display: flex;
		height: 100%;
		position: relative;
		.container {
			.scroller {
				border: 1px solid #dcdfe6;
				border-radius: 3px;
				box-sizing: border-box;
				overflow-x: hidden;
				height: calc(100% - 10px);
			}
			height: calc(100% - 36px);
		}
	}
	.kml {
		height: 100%;
		width: 400px;
		background-color: #fff;
		overflow-y: auto;
		overflow-x: hidden;
		transition: width 0.3s;
		// margin-right: 10px;

		&._collapse {
			margin-right: 0;
			width: 0;
		}

		.header {
			height: 36px;
			padding: 0 10px;
			background-color: #ffffff;
			letter-spacing: 1px;
			position: relative;
		}

		::v-deep .el-tree-node__content {
			height: 32px;
			display: flex;
			span {
				font-size: 14px;
				&:nth-child(2) {
					display: block;
					height: 100%;
					width: 100%;

					div {
						display: flex;
						align-items: center;
						height: 100%;
						width: 100%;
						font-size: 1px;
					}
				}
			}
		}
	}
	.user {
		width: calc(100% - 310px);
		flex: 1;

		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 36px;
			background-color: #ffffff;
			span {
				font-size: 14px;
				white-space: nowrap;
				overflow: hidden;
			}
			.icon {
				font-size: 18px;
				cursor: pointer;
			}
		}
		.container {
			height: calc(100% - 40px);
			padding: 0  6px ;
			.tmap {
				width: calc(100%);
				height: calc(100%);
			}
			.direct {
				height: 500px;
				width: 600px;
				// padding: 0 10px;
				min-height: 400px;
			}
			::v-deep .cl-crud {
				padding: 0px;
			}
		}
		::v-deep .el-collapse-item__header {
			height: 36px;
		}
	}
	.track-chart {
		height: calc(100vh - 1000px);
		min-height: 204px;
		max-height: 300px;
		width: 100%;
	}

	@media only screen and (max-width: 768px) {
		.kml {
			width: calc(100% - 100px);
		}
	}
}
</style>
