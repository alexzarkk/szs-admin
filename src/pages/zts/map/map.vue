<template>
	<cl-layout>
		<div class="system-user">
			<!-- 线路编辑 -->
			<cl-form ref="dept-upsert"> </cl-form>
			<!-- 右键按钮 -->
			<cl-context-menu ref="context-menu"> </cl-context-menu>
			
			<div class="pane">
				<!-- 轨迹坐标 列表  可折叠 -->
				<div class="kml" :class="[expand ? '_expand' : '_collapse']">
					
					<kml-menu :kml="kml" :cur="cur" @refresh="kmlRefresh"/>
					<!-- 树形结构 -->
					<div class="container">
						<div class="scroller"> 
							<el-table v-loading="loading"
								border
								ref="table"
								style="width: 100%"
								row-key="_id"
								size="mini"
								highlight-current-row
								
								:data="tree"
								:expand-row-keys="expandKeys"
								:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
								@row-click="rowClick"
								@row-contextmenu="onRowContextMenu"
								>
								
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
								
							</el-table>
						</div>
					</div>
				</div>

				<!-- 成员列表 -->
				<div class="user">
					<div class="header">
						<div class="icon padding-left-xs" @click="expand = !expand">
							<i class="el-icon-arrow-left" v-if="expand"></i>
							<i class="el-icon-arrow-right" v-else></i>
						</div>
						<!-- 选择部门 -->
						<el-tooltip class="item" effect="dark" content="设定当前地图的区域范围和边界线" placement="top">
							<span class="padding-left-xs">
								<cl-dept-cascader :value="[kml.departmentId]" :size="'mini'" @input="deptChange" />
							</span>
						</el-tooltip>
						<!-- <span class="padding-left-xs">
							<el-tooltip effect="light" :content="(tmap.onNear?'关闭':'加载')+'已组网路线（当前范围）'" placement="top">
								<el-button style="padding:5px;" size="mini" :icon="tmap.onNear?'el-icon-circle-close':'zts-layout'" circle @click="onNear" ></el-button>
							</el-tooltip>
						</span> -->
						
						<span class="padding-lr-xs">
							<block v-if="drawing">
								<el-button size="mini" type="infor" @click="cancelDraw">取消</el-button>
								<el-button v-if="drawed && drawed.pm.t1==1" size="mini" type="success" @click="continueDraw">继续</el-button>
								<el-button size="mini" type="primary" :disabled="drawed == null && !onEle" v-loading="onEle" @click="saveDraw">保存</el-button>
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
							<zz-map-draw ref="zmap" v-if="tree.length"
								:pms="pms"
								:cur="cur"
								:extraW="expand?414:14"
								@action="action"
								@tcAction="tcAction"
								:grid="false"></zz-map-draw>
								
						</cl-crud>
					</div>
				</div>
			</div>
		</div>
	</cl-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { open, merge, del, veri } from '@/cool/utils/pmCurd'
import { calData, isSame } from '@/comm/geotools'
import { getElevation } from '@/comm/libs/mapbox/mbtool'

import kmlMenu from './components/kml-menu.vue'
// import Checking from '../collect/checking.vue';
// import Direction from './direction.vue';
// import { setMask, setLineString } from '@/cool/utils/ztool.js'

export default {
	components: { kmlMenu },
	data() {
		return {
			loading: false,
			expand: true,
			expandKeys: ['10','2','3'],
			refKml: null,
			
			kml: {},
			list:[],
			tree:[],
			pms: [],
			cur: {},
			
			
			directPoi: {},
			
			// draw
			drawing: false,
			drawed: null,
			drawPm: null,
			onEle: false,
			t9: null
			
		};
	},
	computed: { ...mapGetters(['lay', 'userInfo']) },
	activated() {
		console.log('map.activated');
		this.kmlRefresh()
	},
	deactivated() {
		console.log('map.deactivated')
	},
	mounted() {
		this.kmlRefresh()
	},
	methods: {
		exec(e){ this.$refs.zmap.exec(e) },
		setPms(){ this.pms = this.zz.revDeepTree(this.tree).filter(e=>e.coord!=undefined) },
		rowClick(e,c){
			if (c.property && e.children) {
				this.$refs.table.toggleRowExpansion(e)
			} else {
				if(e.t1==1 && !e.info) e.info = calData(e.coord, true)
				this.cur = e
				// setTimeout(()=>{ this.cur = e }, 60)
			}
			
			console.log('rowClick',e)
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
			// this.pm = this.zz.clone(this.pm)
			this.setPms()
			
			console.log('line ----->', this.pms)
		},

		async kmlRefresh(init=0) {
			
			let id = uni.getStorageSync('collect_check')
			if (init || !this.kml._id || this.kml._id != id) {
				
				this.loading = true
				try{ this.exec({m:'remove',e:{}}) }catch(e){ } 
				let kml = await this.$service.zts.kml.info({ id, noChild: true }),
					list = await this.$service.zts.placemark.list({ kmlId: id, tree: true, force: init==2 })
				
				this.loading = false
				
				
				console.log('kmlRefresh ----->',kml);
				for(let s of list) {
					
					//完工巡线 锁定修改 
					if(kml.type == 40) {
						s.lock = (!s.status || s.status>=1)
					}
					
					//采集的默认轨迹
					if(kml.type == 9) {
						s.lock = s.t2==9
					}
					
					s.checked = true
					if(s.kmlId && s.t1==1) { s.info = calData(s.coord, true) }
				}
				
				this.kml = kml
				this.list = list
				this.reTree()
				this.setPms()
				
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
				if (kml.type==9 && kml.kmlId) {
					this.refKml = await this.$service.zts.kml.info({ id: kml.kmlId, plain:true })
				}
			}
		},
		reTree(pm) {
			if(pm) {
				let idx = this.list.findIndex(e=>e._id==pm._id)
				if(idx) Object.assign(this.list[idx],pm)
			}
			this.tree = this.zz.deepTree(this.list)
		},
		
		onRowContextMenu(d, column, event) {
			console.log('onRowContextMenu',d);
			let permission = this.$service.zts.kml.permission,
				list = [
					{
						label: "编辑",
						"suffix-icon": "el-icon-edit-outline",
						callback: (item, done) => {
							this.reset(d)
							done()
						}
					},
					{
						label: "删除",
						"suffix-icon": "el-icon-delete",
						callback: (item, done) => {
							this.reset(d)
							done()
						}
					}
				]
			
			if(d.t1==9){
				list.unshift({
					label: "添加子集",
					"suffix-icon": "el-icon-plus",
					callback: (item, done) => {
						this.layEdit({
							name: "",
							pid: d._id,
							parentName: d.name,
							label:'添加子集',
						})
						done()
					}
				})
			} 
			
			this.$refs['context-menu'].open(event, { list })
		},
		layEdit(e){
			console.log('layEdit',e);
			if(typeof e === 'string'){
				e = this.zz.revDeepTree(this.list).find(x=>x._id==e)
			}
			let title = e.label || (e._id?'编辑-'+e.name:"新增"),
				method = e.id?"update":"add",
				items = [
					{
						label: "名称",
						prop: "name",
						value: e.name || '',
						span: 12,
						component: {
							name: "el-input",
							attrs: {
								placeholder: "请填写名称"
							}
						},
						rules: {
							required: true,
							message: "名称不能为空"
						}
					},
					{
						label: "排序",
						prop: "orderNum",
						span: 12,
						value: e.orderNum || 0,
						component: {
							name: "el-input-number",
							props: {
								min: 0,
								max: 1000
							}
						}
					}
				]
			
			this.$refs["dept-upsert"].open({
				title,
				width: "720px",
				props: { "label-width ": "120px" },
				items,
				on: {
					submit: (data, { done, close }) => {
						let obj = {
							_id: e._id,
							pid: e.pid,
							name: data.name,
							lock: data.lock,
							orderNum: data.orderNum,
							prefix: data.prefix
						}
						if(data.status !=undefined) obj.status = data.status
						
						if(e.root) { obj.root = true }
						if(!e.id&&!e.root) {
							obj.deptId = data.deptId[data.deptId.length-1]
						}
						if(e.kmlId) obj.grade = data.grade
						
						this.loading = true;
						this.$service.zts.layout[method](obj).then((res) => {
							// console.log(method,res);
							this.$message.success('保存成功');
							close();
							this.loading = false;
							this.refresh();
						}).catch((err) => {
							this.$message.error(err);
							done();
						});
					}
				}
			});
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
					open.call(this,{ act: 'addLine', pm: e.pm })
					break;
				case 'edit':
					open.call(this,{ act: 'edit', pm: e.pm })
					break;
				case 'del':
					del.call(this,{ pm: e.pm })
					break;
				case 'draw':
					this.drawing = true
					this.drawPm = e.pm
					this.exec({m:'doDraw', e})
					break;
				case 'direct':
					this.directPoi = e.pm
					this.directionChart = true
					break;
				case 'lineActived':
					this.cur = e.e
					break;
				default:
					break;
			}
		},
		
		
		//从chart中返回的事件
		async tcAction({ select, act }) {
			console.log('tcAction', select);
			
			switch (act){
				case 'reverse':
					this.updateCoord(this.cur._id, this.cur.coord.reverse())
					break;
				case 'merge':
					merge.call(this)
					break;
				case 'ele':
					if (!veri.call(this, {})) return
					let ask = await this.$confirm('此操作将会覆盖原有数据，是否继续？', '提示', { type: 'warning' })
					if(ask) {
						this.loading = true
						let coord = await getElevation(this.cur.coord)
						this.updateCoord(this.cur._id, coord)
					}
					break;
				case 'download':
					let kml = clone(this.kml.cur)
					kml.children = [{_id: 'LineString_t1',
									name: '轨迹',
									children: [this.cur],
								}]
					this.zz.expKml(kml)
					break;
				default:
					open.call(this, { act, pm: this.cur, select })
					break;
			}
		},
		async updateCoord(_id, coord) {
			if (veri.call(this, {})) {
				this.loading = true
				await this.$service.zts.placemark.update({ _id, coord, updateCoord: true }).then(res => {
					this.loading = false
					this.$message.success(`更新成功`)
					this.exec({m:'remove', e:{ids:[_id]}})
					this.kmlRefresh(1)
					// this.reTree({_id, coord})
				})
				if (this.kml.status >= 10) this.$service.zts.kml.createChart({ _id: this.kml._id })
			}
		},
		
		// mapbox ----------------------------------------- /////////////////// >
		doDraw(e) {
			if (!veri.call(this, {})) return
			this.exec({m:'doDraw', e:{e}})
			this.drawing = true
		},
		continueDraw() {
			let coord = this.drawed.pm.coord
			this.exec({m:'doDraw', e:{
										e:'draw_line_string',
										name:this.drawed.pm.name,
										o:{ featureId: this.drawed.featureId, from: coord[coord.length-1] } }})
		},
		cancelDraw(id) {
			this.onEle = false
			this.drawing = false
			this.drawed = null
			this.drawPm = null
			this.exec({m:'finishDraw', e:{pm:this.drawPm}})
		},
		drawEvt(e) {
			let geo = e.geo.geometry,
				id = e.geo.id,
				coord = geo.coordinates

			if (e.type == 'draw.create') {
				if (geo.type == 'Point') this.drawed = { act: 'addPoint', pm: {t1:2, coord } }
				if (geo.type == 'LineString') this.drawed = { act: 'addLine', pm: {t1:1, coord } }
			}
			if (e.type == 'draw.update') {
				try {
					this.drawed.pm.coord = coord
				} catch (e) {
					this.drawed = { pm: { ...this.drawPm, coord } }
				}
			}
			this.drawed.featureId = id
		},
		async saveDraw() {
			this.onEle = true
			let pm = this.drawed.pm,
				coord = await getElevation(pm.coord, pm.t1==1)
			this.onEle = false
			console.log('saveDraw ...', pm,coord)
			
			if (this.drawPm) {
				await this.updateCoord(this.drawPm._id, coord)
				//显示轨迹
			} else {
				pm.coord = coord
				open.call(this, this.drawed)
			}
			this.cancelDraw()
		},

		
		mbEvt(e) {
			
		},
		
		
		deptChange(event) {
			return console.log('获取到的部门的信息', event);
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
				// height: calc(100% - 4px);
				height: 100%;
				
				::v-deep .el-table__header {
					display: none;
				}
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
		width: calc(100% - 400px);
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
			height: calc(100% - 36px);
			padding: 0 0 0 4px ;
			
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
}
</style>
