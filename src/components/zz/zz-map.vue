<script module="_mapbox" lang="renderjs">
	import mapboxgl from '!mapbox-gl/dist/mapbox-gl'
	import MapboxDraw from '@/comm/libs/mapbox/draw/mapbox-gl-draw'
	import mbtool from '@/comm/libs/mapbox/mbtool.js'
	import comm from '@/comm/comm'
	import icon from '@/comm/libs/icon'
	// import AMapLoader from '@amap/amap-jsapi-loader'
	import { CompassControl, LocationControl, TerrainControl, FullscreenControl } from '@/comm/libs/mapbox/ctrl/index.js'
	import { trans } from '@/comm/geotools.js'
	
	import '@/comm/libs/mapbox/mapbox.css'
	// import '@/comm/libs/mapbox/draw/mapbox-gl-draw.css'
	
export default {
	data() {
		return {
			map: null,
			self: null,
			
			key: {
				mb: 'pk.eyJ1IjoiYWxleHphcmtrIiwiYSI6ImNrcWdzNXdrcjI3NmEyb3F0cmVzd291amcifQ.tPuMJfthzboYHg3MzbKtKw',
				tdt: '70ede380913047ef13bc4dc92ff4f75b',
				amap: 'daffb83c14428939221e09ebc785c89c'
			},
			
			settings: {
				style: 'mapbox://styles/alexzarkk/ckqt2gqrc650n17nw67q4glqu',
				container: 'mbContainer',
				center: [121,29],
				zoom: 15,
				minZoom: 5,
				maxZoom: 20,
				pitch: 0,
				maxPitch: 0
			}
		}
	},
	async mounted() {
		mapboxgl.accessToken = this.key.mb
		window.mbAct = this.mbAct
		this.newMb()
		
		// window.addEventListener("popstate", (e)=> {
		// 	console.log('popstate.back <<<<<<<<<<<')
		// 	window.removeEventListener('resize', this.resize)
		// 	this.stopLoc()
		// }, false)
	},
	methods: {
		
		newMb(){
			let map = new mapboxgl.Map(this.settings)
			
			map.addControl(new CompassControl(), 'bottom-right')
			map.addControl(new LocationControl(), 'bottom-left')
			
			map.sid = 'default'
			map.pm = {}
			map.nav = {r:{}}
			map._2p = []
			this.map = map
			
			// window.map = map
			this.initAmap()
		},
		async initAmap(){
			// if(!window.Geocoder) {
			// 	await AMapLoader.load({
			// 	    key: this.key.amap,
			// 	    version: "2.0",
			// 		plugins:['AMap.Geocoder']
			// 	}).then((AMap)=>{
			// 		window.Geocoder = new AMap.Geocoder({})
			// 	}).catch((e)=>{
			// 		console.error(e)
			// 	})
			// }
		},
		init(self,si,ct,isf,ctrl,t=1) {
			
			let map = this.map
			
			if(t==1) {
				this.self = self
				// this.isf = isf
				// map.sysInfo = si
				
				ctrl = new TerrainControl(isf, map.sid, si.platform)
				map.addControl(ctrl, 'top-left')
				// map.addControl(new FullscreenControl(isf), 'top-right')
				map.addControl(new mapboxgl.FullscreenControl());
			}
			
			
			
			
			// const evt = (e) =>{
			// 	let _c = (c)=>{return [mbtool.fixNum(c.lng), mbtool.fixNum(c.lat)]},
			// 		center = _c(map.getCenter()),
			// 		zoom = mbtool.fixNum(map.getZoom(), 0),
			// 		bounds = map.getBounds(),
			// 		_ne = _c(bounds.getNorthEast()),
			// 		_sw = _c(bounds.getSouthWest())
					
			// 	return { event: e.type, center, zoom, _ne, _sw }
			// }
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
				ctrl.done()
				map.init = true
				self.callMethod('mapDone', true)
				comm.setStorage('mbStyle', map.getStyle())
				// this.onloc()
			})
			map.on('moveend', (e) => {
				mbtool.on(map)
				self.callMethod('mbEvent')
			});
			map.on('zoomend', () => {
				mbtool.on(map)
			});
		},
		
		async updateData({exec=null, sysInfo={}, center=null, pms=null, line=[], point=[], gon=[], isf=false}, ov, self) {
			if(exec) return this[exec.m](exec.e)
			let map = this.map
			if (!map) return
			if (!map.init) return this.init(self, sysInfo, center, isf)
			
			// console.log('map.inited...')
			// console.log('updateData:=======================', center,point,line);
			// console.log('updateData.old:====',ov);
			
			mbtool.setKml(this.map, pms, line, point, gon)
		},
		
		onloc(){ mbtool.onLoc(this.map) },
		stopLoc(){ comm.stopWatch() },
		fit(e){ mbtool.setActive(this.map,e) },
		setKml(e) { mbtool.setKml(this.map, null, e.line, e.point, e.gon, 0) },
		runx(e){ mbtool.run(this.map,e) },
		around(e){ mbtool.getAround(this.map,null,e) },
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
        <view :style="{ height: (lay.height-220) + 'px', width: (lay.width-50) + 'px' }" :prop="mb" :change:prop="_mapbox.updateData">
			<div id="mbContainer"></div>
		</view>
    </view>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'zzMap',
    data() {
        return {
			mdone: false,
			mb: {},
			ver: 0,
			sysInfo: {},
			isFullscreen: true
        };
    },
    props: {
		pms: {
            type: Array,
            default: () => {
                return null
            }
        },
        line: {
            type: Array,
            default: () => {
                return []
            }
        },
        point: {
            type: Array,
            default: () => {
                return []
            }
        },
        gon: {
        	type: Array,
        	default: () => {
        	    return []
        	}
        },
		center: {
		    type: Array,
		    default: () => {
		        return []
		    }
		},
		cur: {
		    type: Object,
		    default: () => {
		        return {}
		    }
		},
		refKml: {
		    type: Object,
		    default: () => {
		        return {}
		    }
		},
        winH: {
            type: Number,
            default: 400
        }
    },
	computed: { ...mapGetters(['lay']) },
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
        cur(e, o) {
            if(o&&JSON.stringify(o)!=JSON.stringify(e)) this.mb = { exec: {m:'fit', e} }
        },
        refKml(e, o) {
            if(o&&JSON.stringify(o)!=JSON.stringify(e)) this.mb = { exec: {m:'setKml', e} }
        },
        winH(e, o) { this.setProp() }
    },
	
    mounted() {
		this.sysInfo = uni.getStorageSync('szsSys')
		// this.isFullscreen = this.winH == this.sysInfo.windowHeight
		if(!this.center.length) {
			if(this.pms) {
				let t=this.pms[0]
				this._center = t.t1==1? t.coord[0]:t.coord
			} else if(this.line.length) {
				this._center = this.line[0].coord[0]
			} else if(this.point.length) {
				this._center = this.point[0].coord
			}
		}else {
			this._center = this.center
		}
        this.setProp()
    },
    methods: {
        setProp() {
			if(this.mdone) {
				this.mb = {
					ver: this.ver++,
				    center: this._center,
					pms: this.pms,
				    line: this.line,
				    point: this.point,
				    gon: this.gon
				}
				if(this.refKml.line) {
					setTimeout(()=> {this.exec({m:'setKml', e:this.refKml})}, 3500)
				}
			} else {
				this.mb = {
				    sysInfo: this.sysInfo,
					isf: this.isFullscreen,
				    center: this._center,
				}
			}
        },
		exec({m,e}){
			this.mb = {exec:{m,e}}
		},
        mapDone(e) {
			this.mdone = e
			this.setProp()
            this.$emit('mapDone', e)
        },
		mbClick(e) {
			// console.log('mapbox.mbClick: ',e);
			this.$emit('mbClick', e);
		},
		mbEvent(e){
			// console.log('mapbox.mbEvent: ',e);
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
					this.zz.viewIMG(e.imgs,e.idx)
					break;
				case 'chgStyle':
					this.zz.toast(e.e)
					this.setProp()
					break;
				case 'fullscreen':
					if(e.e) {
					// if(this.isFullscreen) {
						// #ifdef APP-PLUS
						plus.screen.lockOrientation('portrait-primary')
						// #endif
						
						uni.navigateBack()
					} else {
						this.zz.href('/pages/comm/mapboxFullscreen', {pms: this.pms, line:this.line, point:this.point, gon:this.gon, refKml:this.refKml},0,'slide-in-bottom')
					}
					break;
				default:
					this.$emit(e.act, e)
					break;
			}
		}
    }
}
</script>

<style lang="scss">
	
</style>
