<script module="_mapbox" lang="renderjs">
	import mapboxgl from '!mapbox-gl/dist/mapbox-gl'
	import MapboxDraw from '@/comm/libs/mapbox/draw/mapbox-gl-draw'
	import mbtool from '@/comm/libs/mapbox/mbtool.js'
	import comm from '@/comm/comm'
	import icon from '@/comm/libs/icon'
	import { CompassControl, TerrainControl, GridControl, RulerControl } from '@/comm/libs/mapbox/ctrl/index.js'
	import { calData, uniqId, fixNum, trans } from '@/comm/geotools.js'
	import { amapKey } from '@/comm/bd'
	
	import '@/comm/libs/mapbox/mapbox.css'
	import '@/comm/libs/mapbox/draw/mapbox-gl-draw.css'
	
	const mapid = uniqId()
	
export default {
	data() {
		return {
			map: null,
			self: null,
			mapid,
			
			key: {
				mb: 'pk.eyJ1IjoiYWxleHphcmtrIiwiYSI6ImNrcWdzNXdrcjI3NmEyb3F0cmVzd291amcifQ.tPuMJfthzboYHg3MzbKtKw',
				tdt: '70ede380913047ef13bc4dc92ff4f75b',
				amap: amapKey
			},
			
			settings: {
				style: 'mapbox://styles/alexzarkk/ckqt2gqrc650n17nw67q4glqu',
				container: mapid,
				center: [120.109913, 29.181466],
				zoom: 15,
				minZoom: 3,
				maxZoom: 20,
				pitch: 0,
				maxPitch: 0
			},
			noti:null
		}
	},
	async mounted() {
		mapboxgl.accessToken = this.key.mb
		window.mbAct = this.mbAct
		this.newMb()
	},
	beforeDestroy() {
		console.log('map.beforeDestroy')
		this.map = null
		window.mbAct = null
	},
	methods: {
		fixNum,
		resize(){
			let ct = document.getElementById(this.mapid)
			if(ct) {
				// ct.style.width = this.lay.width-10+'px'
				// ct.style.height = this.lay.height-10+'px'
			}
			if(this.map) this.map.resize()
		},
		newMb(){
			let map = new mapboxgl.Map(this.settings)
			
			map.addControl(new CompassControl(), 'bottom-left')
			map.addControl(new mapboxgl.FullscreenControl(), 'top-right')
			
			map.zz = {sid:'default',pm:{},nav:{r:{}},_2p:[], editble:1}
			this.map = map
		},
		init(self,si,ct) {
			this.self = self
			let map = this.map,
				ctrl = new TerrainControl(true, map.zz.sid, si.platform)
				
			map.addControl(ctrl, 'top-left')
			if(si.grid) {
				map.ztsGrid = true
				map.addControl(new GridControl(), 'top-left')
			}
			
			 
			// map.resize()
			// if(isf) {
				// this.resize()
				// window.addEventListener('resize', this.resize)
			// }
			
			const evt = (e) =>{
				let _c = (c)=>{return [mbtool.fixNum(c.lng), mbtool.fixNum(c.lat)]},
					center = _c(map.getCenter()),
					zoom = mbtool.fixNum(map.getZoom(), 0),
					bounds = map.getBounds(),
					_ne = _c(bounds.getNorthEast()),
					_sw = _c(bounds.getSouthWest())
					
				return { event: e.type, center, zoom, _ne, _sw }
			}
			// if(ct){
			// 	map.setZoom(14)
			// 	map.setCenter(map.zz.sid=='amap'? trans([ct[0],ct[1]]): [ct[0],ct[1]])
			// }else{
				map.setZoom(6.5)
			// }
			map.on('click', (e) => {
				self.callMethod('mbClick', [mbtool.fixNum(e.lngLat.lng), mbtool.fixNum(e.lngLat.lat)])
			})
			// map.on('rotateend', ()=>{ })
			
			
			for (let k in icon) {
				map.loadImage(icon[k], (x,m)=>{ map.addImage(k, m) })
			}
			
			map.on('load', (e) => {
				// map.addControl(new RulerControl(), 'top-right')
				ctrl.done()
				map.init = true
				self.callMethod('mapDone', true)
			})
			map.on('moveend', (e) => {
				mbtool.on(map)
				self.callMethod('mbEvent', evt(e))
			});
			map.on('zoomend', () => {
				mbtool.on(map)
			})
			
			
			//simple_select direct_select  draw_line_string  draw_polygon  draw_point
			this.mdraw = new MapboxDraw({ 
					keybindings: true,
					clickBuffer: 5,
					displayControlsDefault: true, 
					controls:{ trash: true, point:false, line_string:false, polygon:false, combine_features:false, uncombine_features:false }
				})
			for (let s of ['create', 'delete', 'update']) {
				map.on('draw.'+s, e => {
					this.noti = {name:this.noti.name}
					let g = {act: 'drawing', geo: e.features[0], type: e.type },
						coord = g.geo.geometry.coordinates
					if(map.sid=='amap') {
						coord = trans(coord, 'gcj02towgs84')
					}
					
					if(g.geo.geometry.type == 'LineString') {
						this.noti.info = calData(coord)
					} else if(g.geo.geometry.type == 'Point') {
						//计算海拔
						this.noti.coord = coord
					} else {
						//计算面积
					}
					self.callMethod('mapDo', g)
				})
			}
			
			map.addControl(this.mdraw)
		},
		
		async updateData({exec=null, option={}, center=null, pms=null, line=[], point=[], gon=[]}, ov, self) {
			if(exec) return this[exec.m](exec.e)
			let map = this.map
			if (!map) return
			if (!map.init) return this.init(self, option)
			
			// console.log('updateData:=======================', center,point,line);
			// console.log('updateData.old:====',ov);
			
		},
		
		setBound(e){ mbtool.setBound(this.map,e.e) },
		fit(e){ mbtool.setActive(this.map, e.pm, e.opt||{}) },
		fly(e){ this.map.flyTo({center:e.coord, zoom:16, bearing: e.curDrect||0}) },
		fitBounds(e){
			this.map.fitBounds(mbtool.turf.box(this.map.zz.sid=='amap'? trans(e): e), {
				duration: 6000,
				padding: {top:50, bottom:50, left: 50, right: 50}
			})
		},
		remove({ids}){
			let m = this.map
			clearTimeout(m.zz.running)
			mbtool.removeObj(m, 'selected')
			mbtool.removeObj(m, 'active_running')
			for(let k in m.zz.pm) {
				if(!ids||(ids.includes(k))) {
					mbtool.removeObj(m, k, m.zz.pm[k].t1==2?'_':'')
					delete m.zz.pm[k]
				}
			}
		},
		setPms(e) {
			let map = this.map,
				fn = {1:'setLine', 2: 'setPoint', 3: 'setGon'}
				
			for (let s of e.pms) {
				let id = s._id
				if(map.getLayer(id)) {
					map.setLayoutProperty(id, 'visibility', s.checked? 'visible' :'none')
				} else {
					mbtool[fn[s.t1]](map,[s], 1, 1)
				}
				if(s.t1==1 && !s.checked) {
					clearTimeout(map.zz.running)
					mbtool.removeObj(map, 'active_running')
				}
			}
		},
		
		doDraw(e){
			let m = this.map
			try { m.zz.pp.remove() } catch (e) {}
			m.zz.drawing = true
			clearTimeout(m.zz.running)
			mbtool.removeObj(m, 'active_running')
			
			
			let geo
			if (e.pm) {
				geo = {
					id: e.pm._id,
					name: e.pm.name,
					type: 'Feature',
					properties: {},
					geometry: { 
						type: ['LineString','Point','Polygon'][e.pm.t1-1], 
						coordinates: m.zz.sid=='amap'? trans(e.pm.coord): e.pm.coord
					}
				}
				this.mdraw.add(geo)
				m.setLayoutProperty(e.pm._id, 'visibility', 'none')
			} else {
				this.noti = { title:'点击地图开始绘制...' }
				this.mdraw.changeMode(e.e, e.o)
				if(e.o) geo = this.mdraw.getAll().features.find(f=>f.id==e.o.featureId)
			}
			
			if(geo) {
				this.noti = { title:'点击轨迹或坐标进行修改...', name: geo.name||e.name }
				if(geo.geometry.type == 'LineString') {
					this.noti.info = calData(geo.geometry.coordinates)
				} else if(geo.geometry.type == 'Point') {
					//计算海拔
					this.noti.coord = geo.geometry.coordinates
				} else {
					//计算面积
				}
			}
		},
		finishDraw(e){
			this.noti = null
			this.map.zz.drawing = false
			this.mdraw.deleteAll()
			this.mdraw.changeMode('simple_select')
			if(e.pm) {
				this.map.setLayoutProperty(e.pm._id, 'visibility', 'visible')
			}
		},
		
		
		
		runx(e){ mbtool.run(this.map,e) },
		getAround(e){ mbtool.getAround(this.map,null,e) },
		onGrid(){mbtool.on(this.map,1)},
		mbAct(e){
			if(this[e.act]) {
				this[e.act](e.e)
			} else {
				this.self.callMethod('mapDo', e)
			}
		}
	}
}
</script>

<template>
    <view>
        <view :id="mapid" :style="{ height: mapLay[0] + 'px', width: (mapLay[1]-extraW) + 'px' }" :prop="mb" :change:prop="_mapbox.updateData"></view>
        
		<!-- <view class="dept-select">
			<cl-dept-cascader :size="'mini'" @input="deptChange" />
		</view> -->
		
		<view v-if="noti" class="calculation-box flex flex-direction">
			<text class="text-df text-blue">{{noti.title}}</text>
			<text class="text-df text-bold">{{noti.name}}</text>
			<view v-if="noti.coord" class="flex flex-direction justify-start text-dark text-sm">
				<text>经纬度：{{fixNum(noti.coord[0])+','+fixNum(noti.coord[1])}}</text>
				<text>海拔：{{noti.coord[2]||'？'}}
					<!-- <el-button v-if="!noti.coord[2]" style="margin-left:2px;padding:4px;" type="success" size="mini" icon="el-icon-s-flag" @click="calNoti">计算</el-button> -->
				</text>
			</view>
			<view v-if="noti.info" class="flex flex-direction justify-start text-dark text-sm">
				<text>坐标数：{{noti.info.size}}个</text>
				<text>长度：{{noti.info.len}}m</text>
				<text>累计上/下：{{'↑'+noti.info.up + '↓'+ noti.info.down}}m</text>
				<!-- <el-button style="margin-left:2px;padding:4px; width: 60px;" type="success" size="mini" icon="el-icon-s-flag" @click="calNoti">计算</el-button> -->
			</view>
		</view>
		
        <view class="cu-modal" :class="video ? 'show' : ''">
            <view class="cu-dialog">
                <view class="cu-bar bg-white justify-end">
                    <view class="content">短视频</view>
                    <view class="action" @tap="video=null"><text class="cuIcon-close text-red"></text></view>
                </view>
               <video v-if="video" id="myVideo" :src="video" controls></video>
            </view>
        </view>
		
		<!-- :class="cur.info?'animation-slide-bottom':'animation-slide-top'" -->
		<view :style="{height: mapLay[2] +'px'}">  
			<el-collapse v-if="cur.info" v-model="activeName" accordion>
				<el-collapse-item name="1">
					<template slot="title">
						<i class="header-icon el-icon-info"></i>
						【{{ cur.name }}】
						<text class="padding-left-xs text-grey">长度：</text>
						<text class="text-orange text-bold">{{ cur.info.len }}m</text>
			
						<text class="padding-left-xs text-grey">
							海拔：
							<text class="cuIcon-top"></text>
						</text>
						<text class="text-orange text-bold">{{ cur.info.top }}m</text>
						<text class="text-grey"><text class="cuIcon-down"></text></text>
						<text class="text-orange text-bold">{{ cur.info.bottom }}m</text>
			
						<text class="padding-left-xs text-grey">
							累计：
							<i class="header-icon el-icon-top"></i>
						</text>
						<text class="text-orange text-bold">{{ cur.info.up }}m</text>
						<text class="text-grey"><i class="header-icon el-icon-bottom"></i></text>
						<text class="text-orange text-bold">{{ cur.info.down }}m</text>
						
						<block v-if="sInfo.len">
							<text class="padding-left-xs text-dark">
								(已选取路段)
							</text>
						</block>
					</template>
					<view :style="{height: (mapLay[2]-40) +'px'}">
						<zts-track-chart ref="tChart" :pm="cur" @on="tcAction"></zts-track-chart>
					</view>
				</el-collapse-item>
			</el-collapse>
		</view>
		
		
		
    </view>
</template>
<script>
import { mapGetters } from 'vuex'
import { calData, isSame } from '@/comm/geotools';
export default {
    name: 'zzMapDraw',
    data() {
        return {
			mdone: false,
			mb: {},
			ver: 0,
			sysInfo: {},
			
			// draw
			geo: null,
			drawing: false,
			drawed: null,
			drawPm: null,
			lookingEle: false,
			
			// chart
			sInfo: {},
			activeName:'1',
			
			// lay
			mapLay: [0,0],
			chartHight: 0,
			
			video: null
        }
    },
	computed: { ...mapGetters(['lay']) },
    props: {
		pms: 	{ type: Array, default: () => { return [] } },
        line: 	{ type: Array, default: () => { return [] } },
        point: 	{ type: Array, default: () => { return [] } },
        gon: 	{ type: Array, default: () => { return [] } },
		refKml: { type: Object, default: () => { return {} } },
		cur: 	{ type: Object, default: () => { return {} } },
		
		
		btn: 	{ type: Array, default: () => { return null } },
		
		// 组网路线
		grid: { type: Boolean, default: true },
		// dept
		dept: { type: Number, default: 330000 },
		// 屏幕布局
		extraW: { type: Number, default: 0 },
    },
    watch: {
        line(e, o) {
			if(o&&JSON.stringify(o)!=JSON.stringify(e)) this.setProp()
        },
        point(e, o) {
			if(o&&JSON.stringify(o)!=JSON.stringify(e)) this.setProp()
        },
        gon(e, o) {
            if(o&&JSON.stringify(o)!=JSON.stringify(e)) this.setProp()
        },
		refKml(e, o) {
		    if(o&&JSON.stringify(o)!=JSON.stringify(e)) this.mb = { exec: {m:'setKml', e} }
		},
		pms(e, o) {
			this.exec({m:'setPms', e:{pms:e}})
		},
        cur(e, o) {
			this.calLay()
			setTimeout(()=>{this.exec({m:'fit', e:{pm:e}})}, 200)
        },
		activeName(){ this.calLay() },
		extraW(e,o) { this.calLay() },
		lay(e,o) { this.calLay() }
		
    },
	created(){ this.calLay() },
    mounted() {
		this.sysInfo = uni.getStorageSync('szsSys')
        this.setProp()
    },
    methods: {
		calLay(){
			let h = 0
			if(this.cur.info){
				h = this.lay.height * 0.3
				if(h>360) h = 360
				if(h<240) h = 240
				h = this.activeName? h : 40*2
			}
			this.mapLay = [this.lay.height - h, this.lay.width, h]
			try{ this.$refs.tChart.resize() }catch(e){ }
			try{ this.exec({m:'resize'}) }catch(e){ }
			// console.log(this.lay.height,this.lay.width ,'---', this.mapLay, ' ........this.mapLay',this.cur);
		},
        setProp() {
			if(this.mdone) {
				if(this.pms.length) {
					this.exec({m:'setPms', e:{pms:this.pms}})
					let e = []
					for (let s of this.pms) {
						if(s.t1==2) {
							e.push(s.coord)
						} else {
							e = e.concat(s.coord)
						}
					}
					
					setTimeout(()=>{
						this.exec({m:'fitBounds', e})
					}, 300)
				}
				if(this.refKml.line) {
					setTimeout(()=> {this.exec({m:'setKml', e:this.refKml})}, 3000)
				}
			} else {
				this.mb = {
				    option: {...this.sysInfo, dept:this.dept, grid:this.grid}
				}
			}
        },
		exec({m,e}){
			this.mb = {exec:{m,e}}
		},
		
        mapDone() {
			this.mdone = true
			this.setProp()
            this.$emit('mapDone', true)
        },
		
		
		mbClick(e) {
			// console.log('mapbox.mbClick: ',e);
			this.$emit('mbClick', e);
		},
		mbEvent(e){
			// console.log('mapbox.mbEvent: ',e);
		},
		//从chart中返回的事件
		tcAction({ select, act }) {
			if (act == 'select') {
				if (this.activeLine) {
					let coord
					// 尾部相等
					if (isSame(this.activeLine.coord[this.activeLine.coord.length - 1],select.coord[select.coord.length - 1])) {
						coord = select.coord[0]
					} else if (isSame(this.activeLine.coord[0],select.coord[0])) {
						coord = select.coord[select.coord.length - 1]
					}
					setTimeout(()=>{
						if(coord) this.exec({m:'fly', e: {coord}})
					}, 1200)
				}
				this.activeLine = {id: 'selected', coord: select.coord}
				this.exec({m:'fit', e:{pm:this.activeLine,opt:{t:30}}})
				return this.sInfo = calData(select.coord)
			}
			
			this.$emit('tcAction', { select, act })
		},
		
		mapDo(e) {
			console.log('mapDo ------ >', e)
			switch (e.act){
				case 'loading':
					uni.showLoading({ mask:true })
					break;
				case 'hideloading':
					uni.hideLoading()
					break;
				case 'viewImg':
					// Image.components.ImageViewer
					this.zz.viewIMG(e.imgs,e.idx)
					break;
				case 'viewVideo':
					this.video = e.url
					break;
				case 'chgStyle':
					this.exec({m:'remove'})
					this.zz.toast(e.e, 3000, 'success')
					setTimeout(()=> {this.setProp()}, 1000)
					break;
				
				default:
					this.$emit('action', e)
					break;
			}
		}
    }
}
</script>

<style lang="scss">

</style>
