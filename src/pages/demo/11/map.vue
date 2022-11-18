<script module="_mapbox" lang="renderjs">
	import { mapGetters } from 'vuex';
	import mapboxgl from '!mapbox-gl/dist/mapbox-gl'
	import MapboxDraw from '@/comm/libs/mapbox/draw/mapbox-gl-draw'
	import mbtool from '@/comm/libs/mapbox/mbtool.js'
	import comm from '@/comm/comm'
	import icon from '@/comm/libs/icon'
	import { CompassControl, TerrainControl, FullscreenControl } from '@/comm/libs/mapbox/ctrl/index.js'
	import { trans } from '@/comm/geotools.js'
	import { amapKey } from '@/comm/bd'
	
	
	import '@/comm/libs/mapbox/mapbox.css'
	// import '@/comm/libs/mapbox/draw/mapbox-gl-draw.css'
	
	const geolocation = {
		getCurrentPosition(_onSuccess){
			uni.getLocation({
				isHighAccuracy: true,
				altitude: true,
				success(c){
					_onSuccess({coords:c})
				}
			})
		},
		watchPosition(_onSuccess){
			uni.getLocation({
				isHighAccuracy: true,
				altitude: true,
				success(c){
					_onSuccess({coords:c})
					window.wid = setTimeout(()=> { geolocation.watchPosition(_onSuccess) }, 3999)
					return window.wid
				}
			})
		},
		clearWatch(wid){
			clearTimeout(wid||window.wid)
		}
	}
	
export default {
	data() {
		return {
			map: null,
			self: null,
			
			key: {
				mb: 'pk.eyJ1IjoiYWxleHphcmtrIiwiYSI6ImNrcWdzNXdrcjI3NmEyb3F0cmVzd291amcifQ.tPuMJfthzboYHg3MzbKtKw',
				tdt: '70ede380913047ef13bc4dc92ff4f75b',
				amap: amapKey
			},
			
			settings: {
				style: 'mapbox://styles/alexzarkk/ckqt2gqrc650n17nw67q4glqu',
				container: 'mbContainer',
				center: [121,29],
				zoom: 8,
				minZoom: 3,
				maxZoom: 20,
				pitch: 0,
				maxPitch: 0
			}
		}
	},
	...mapGetters(['lay']),
	watch: {
		lay: {
			deep: true,
			handler(v) {
				this.resize()
			}
		}
	},
	async mounted() {
		mapboxgl.accessToken = this.key.mb
		window.mbAct = this.mbAct
		this.newMb()
	},
	methods: {
		resize(e){
			let ct = document.getElementById('mbContainer')
			ct.style[e==1?'width':'height'] = document.body.clientHeight+'px'
			ct.style[e==1?'height':'width'] = document.body.clientWidth+'px'
			this.map.resize()
		},
		async newMb(){
			let map = new mapboxgl.Map(this.settings)
			
			map.addControl(new CompassControl(), 'bottom-right')
			// map.addControl(new LocationControl(), 'bottom-left')
			this.geolocate = new mapboxgl.GeolocateControl({
				positionOptions: { enableHighAccuracy: true, timeout: 10000, geocode: false },
				trackUserLocation: true,
				showUserHeading: true,
				
				// #ifdef APP-PLUS
				geolocation: plus.geolocation
				// #endif
				 
				// #ifdef H5
				geolocation
				// #endif
			})
			
			map.addControl(this.geolocate, 'bottom-left')
			
			map.sid = 'default'
			map.pm = {}
			map.nav = {r:{}}
			map._2p = []
			this.map = map
		},
		init(self,si,ct,isf,ctrl,t=1) {
			let map = this.map
			if(t==1) {
				this.self = self
				// this.isf = isf
				// map.sysInfo = si
				
				// ctrl = new TerrainControl(isf, map.sid, si.platform)
				// map.addControl(ctrl, 'top-left')
				map.addControl(new mapboxgl.FullscreenControl());
			}
			
			
			// #ifdef H5
			// map.resize()
			if(isf) {
				this.resize()
				window.addEventListener('resize', this.resize)
			}
			// #endif
			
			const evt = (e) =>{
				let _c = (c)=>{return [mbtool.fixNum(c.lng), mbtool.fixNum(c.lat)]},
					center = _c(map.getCenter()),
					zoom = mbtool.fixNum(map.getZoom(), 0),
					bounds = map.getBounds(),
					_ne = _c(bounds.getNorthEast()),
					_sw = _c(bounds.getSouthWest())
					
				return { event: e.type, center, zoom, _ne, _sw }
			}
			if(ct){
				map.setZoom(14)
				map.setCenter(map.sid=='amap'? trans([ct[0],ct[1]]): [ct[0],ct[1]])
			}else{
				map.setZoom(6.5)
			}
			map.on('click', (e) => {
				self.callMethod('mbClick', [mbtool.fixNum(e.lngLat.lng), mbtool.fixNum(e.lngLat.lat)])
			})
			// map.on('rotateend', ()=>{ })
			
			//simple_select direct_select  draw_line_string  draw_polygon  draw_point
			// this.draw = new MapboxDraw({ displayControlsDefault: false,
			// 							// defaultMode: 'draw_polygon',
			// 							})
										
			// map.on('draw.create', e => {
			// 	console.log('draw.create', e);
			// })
			// map.on('draw.delete', e => {
			// 	console.log('draw.delete', e);
			// })
			// map.on('draw.update', e => {
			// 	console.log('draw.update', e);
			// })
			// map.addControl(this.draw)
		
			for (let k in icon) {
				map.loadImage(icon[k], (x,m)=>{ map.addImage(k, m) })
			}
			
			map.on('load', (e) => {
				// ctrl.done()
				map.init = true
				self.callMethod('mapDone', true)
				comm.setStorage('mbStyle', map.getStyle())
				
				// this.geolocate.trigger()
			})
			map.on('moveend', (e) => {
				// mbtool.on(map)
				self.callMethod('mbEvent', evt(e))
			});
			map.on('zoomend', () => {
				// mbtool.on(map)
			})
		},
		
		async updateData({exec=null, sysInfo={}, center=null, pms=null, line=[], point=[], gon=[], isf=false}, ov, self) {
			if(exec) return this[exec.m](exec.e)
			let map = this.map
			if (!map) return
			if (!map.init) return this.init(self, sysInfo, center, isf)
			
			console.log('map.inited...')
			console.log('updateData:=======================', center,point,line);
			// console.log('updateData.old:====',ov);
			
			mbtool.setKml(this.map, pms, line, point, gon, 0)
			
			
			
			setTimeout(async ()=> {
				map.setZoom(9)
				const delay = (n)=>{
					return new Promise(function(resolve){
						setTimeout(resolve,n*100);
					});
				},
				rndInt = (a = 0, z = 4) => { return Math.floor(Math.random() * (z - a + 1)) + a }
				
				for (let pm of pms) {
					await delay(1+rndInt())
					mbtool.setActive(map, pm, {}, 1)
					mbtool.move(map, pm)
				}
				
			}, 3000);
		},
		
		
		onloc(){ mbtool.onLoc(this.map) },
		stopLoc(){ comm.stopWatch() },
		fit(e){ mbtool.setActive(this.map,e) },
		setKml(e) { mbtool.setKml(this.map, null, e.line, e.point, e.gon, 0) },
		runx(e){ mbtool.run(this.map,e) },
		getAround(e){ mbtool.getAround(this.map,null,e) },
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
		<view id="mbContainer" :style="{ height: sysInfo.windowHeight + 'px', width: '100%' }" :prop="mb" :change:prop="_mapbox.updateData"></view>
	</view>
</template>

<script>
import { uniqId, bearing, getDist, trans, getLocation, calData, fixNum } from '@/comm/geotools'

export default {
	data() {
		return {
			sysInfo: uni.getStorageSync('sysInfo'),
			winH: 0,
			stH: 0,
			kml: {},
			center: [121,30],
			
			mapHeight: 0,
			mdone: false,
			mb: {},
			ver: 0
		}
	},
	
	async onLoad({v}) {
		this.stH = this.sysInfo.statusBarHeight + 60
		this.mapHeight = this.winH
		
		if(v) {
			let { kml } = this.zz.getParam(v)
			this.kml = kml
		}
		console.log(this.kml);
	},
	mounted() { this.setProp() },
	methods: {
		setProp() {
			if(this.mdone) {
				this.mb = {
					ver: this.ver++,
				    center: this.center,
					pms: this.kml.t1
				}
			} else {
				this.mb = {
				    sysInfo: this.sysInfo,
				    center: this.center,
					isf: 1
				}
			}
		},
		exec({m,e}){ this.mb = {exec:{m,e}} },
		mapDone(e) {
			this.mdone = e
			this.setProp()
		},
		mapDo(e) {
			// console.log('mapDo ------ >', e)
			switch (e.act){
				case 'loading':
					uni.showLoading({ mask:true })
					break;
				case 'hideloading':
					uni.hideLoading()
					break;
				case 'viewImg':
					this.zz.viewIMG(e.imgs,e.idx)
					break;
				case 'viewVideo':
					this.video = e.url
					break;
				case 'chgStyle':
					this.zz.toast(e.e)
					this.setProp()
					if(this.onRec) {
						setTimeout(()=> {
							this.exec({m:'setPoi', e:{add:this.rec.point} })
						}, 200)
					}
					break
				default:
					this.markertap(e)
					break;
			}
		}
	}
}
</script>
