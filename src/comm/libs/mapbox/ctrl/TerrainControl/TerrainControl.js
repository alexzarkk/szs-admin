import Base from '../Base/Base';
import Button from '../Button/Button';

import iLayer from '../icons/layer';
import icon3d from '../icons/map3d';
import icon2d from '../icons/map2d';
import iconRun from '../icons/run';
import iconStop from '../icons/stop';
import iconPlus from '../icons/plus';
import iconMinus from '../icons/minus';
import iconUp from '../icons/up';
import iconDown from '../icons/down';
import iShow from '../icons/eleshow';
import iHide from '../icons/elehide';
import iAround from '../icons/around';
import iRotate from '../icons/rotate';
import iLoading from '../icons/loading';
import { async } from 'regenerator-runtime';

export default class TerrainControl extends Base {
	
    constructor(full,sid,platform, play = true) {
        super()
		this.setCtrl = (v='')=>{
			this.rotate.node.style.display = v
			this.zoomIn.node.style.display = v
			this.zoomOut.node.style.display = v
			this.up.node.style.display = v
			this.down.node.style.display = v
		}
		this.st = 0
		this.sid = sid
		this.full = full
		this.platform = platform
		this.play = play
		this.tdtKey = '70ede380913047ef13bc4dc92ff4f75b'
		
		this.layer = new Button()
        this.terrain = new Button()
		
		this.ele = new Button()
		this.around = new Button()
		this.run = new Button()
		this.rotate = new Button()
		this.zoomIn = new Button()
		this.zoomOut = new Button()
		this.up = new Button()
		this.down = new Button()
		
		this.done = ()=>{
			this.layer.node.childNodes[0].remove()
			this.layer.setIcon(iLayer())
			
			if(this.full) {
				this.around.node.style.display = ''
			}
			
			if(this.map.zz.sid=='amap') {
				this.terrain.node.style.display = 'none'
				this.ele.node.style.display = 'none'
			} else {
				this.terrain.node.style.display = ''
				this.ele.node.style.display = ''
			}
			if(this.map.zz.sid=='outdoor') {
				this.ele.node.style.display = 'none'
			}
		}
		this.load = () =>{
			this.layer.node.childNodes[0].remove()
			this.layer.setIcon(iLoading())
			
			this.around.node.style.display = 'none'
			this.ele.node.style.display = 'none'
			this.terrain.node.style.display = 'none'
		}
		
		this.xDem = ()=>{
			let map = this.map,
				dem = 'x_dem'
				
			if(map.getSource(dem)) {
				this.terrain.node.childNodes[0].remove()
				this.terrain.setIcon(icon3d())
				
				if(map.play) {
					window.mbAct({act:'runx',e:{self: this.run, iconRun: iconRun(),x:1}})
				}
				if(this.full) {
					this.run.node.style.display = 'none'
					this.setCtrl('none')
				}
				
				//add ele
				this.ele.node.style.display = ''
				
				map.setMaxPitch(0)
				map.setTerrain()
				map.removeSource(dem)
				map.removeLayer('sky')
				map.setPitch(0, {duration: 2000})
			}
		}
		this.xEle = ()=>{
			let map = this.map,
				id = 'terrain-data'
			
			if(map.getSource(id)) {
				this.ele.node.childNodes[0].remove()
				this.ele.setIcon(iShow())
				map.removeLayer(id)
				map.removeSource(id)
			}
		}
    }
    insert() {
		// this.terrain.addClassName('square-btn')
		for (let k in this) {
			if(this[k] && this[k].node) {
				this[k].addClassName('rectangle-btn')
			}
		}
		this.layer.node.title = '切换图层'
		
		this.around.node.style.display = 'none'
		this.around.node.title = '显示/取消路网'
		
		this.ele.node.style.display = 'none'
		this.ele.node.title = '显示/隐藏等高线'
		
		this.terrain.node.style.display = 'none'
		this.terrain.node.title = '切换平面/3D地图'
		
		this.run.node.style.display = 'none'
		this.run.node.title = '轨迹播放'
		
		this.setCtrl('none')
		
		this.layer.setIcon(iLoading())
		this.terrain.setIcon(icon3d())
		this.run.setIcon(iconRun())
		this.rotate.setIcon(iRotate())
		this.zoomIn.setIcon(iconPlus())
		this.zoomOut.setIcon(iconMinus())
		this.up.setIcon(iconUp())
		this.down.setIcon(iconDown())
		this.ele.setIcon(iShow())
		this.around.setIcon(iAround())
		
		this.zoomIn.onClick(() => this.map.setZoom(this.map.getZoom()+0.5))
		this.zoomOut.onClick(() => this.map.setZoom(this.map.getZoom()-0.5))
		this.up.onClick(() => this.map.setPitch(this.map.getPitch()+2))
		this.down.onClick(() => this.map.setPitch(this.map.getPitch()-2))
		
		this.terrain.addClassName('square-btn')
        
        this.terrain.onClick(async (e) => {
			
			this.run.node.childNodes[0].remove()
			this.run.setIcon(iconRun())
			this.ele.node.childNodes[0].remove()
			this.ele.setIcon(iShow())
			
			let map = this.map,
				dem = 'x_dem'
				
			if(map.getSource(dem)) {
				this.xDem()
			}else{
				this.terrain.node.childNodes[0].remove()
				this.terrain.setIcon(iLoading())
				// window.mbAct({act:'loading'})
				
				this.ele.node.style.display = 'none'
				let id = 'terrain-data'
				if(map.getSource(id)) {
					map.removeLayer(id)
					map.removeSource(id)
				}
				
				map.setMaxPitch(80)
				map.addSource(dem, {
					'type': 'raster-dem',
					'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
					'tileSize': 512,
					'maxzoom': 14
				});
				map.setTerrain({ 'source': dem, 'exaggeration': 1.5 })
				map.addLayer({
					'id': 'sky',
					'type': 'sky',
					'paint': {
						'sky-type': 'atmosphere',
						'sky-atmosphere-sun': [0.0, 30.0],
						'sky-atmosphere-sun-intensity': 20
					}
				})
				await map.once('idle')
				this.terrain.node.childNodes[0].remove()
				this.terrain.setIcon(icon2d())
				
				map.setPitch(59, {duration: 4000})
				if(this.full && this.play) {
					this.run.node.style.display = ''
				}
				// window.mbAct({act:'hideloading'})
			}
		})
		this.run.onClick(() => {
			let e = {self: this.run, around: this.around, iconRun: iconRun(), iconStop: iconStop(), done:()=>{ this.setCtrl('none')}}
			if(this.map.play) {
				e.x = 1
				this.setCtrl('none')
				window.mbAct({act:'runx',e})
			} else{
				this.setCtrl('')
				this.map.setZoom(15.5)
				window.mbAct({act:'runx',e})
			}
		})
		this.rotate.onClick(() => { this.map.runrotate += 45 })
		this.ele.onClick((e) => {
			
			let map = this.map,
				id = 'terrain-data'
			
			if(map.getSource(id)) {
				this.xEle()
			}else {
				this.ele.node.childNodes[0].remove()
				this.ele.setIcon(iHide())
				
				map.addSource(id, {
					type: 'vector',
					url: 'mapbox://mapbox.mapbox-terrain-v2'
				});
				map.addLayer({
					id,
					type: 'line',
					source: id,
					'source-layer': 'contour',
					layout: {
						'line-join': 'round',
						'line-cap': 'round'
					},
					paint: {
						'line-color': '#f5f5f5',
						'line-width': 0.5,
						'line-opacity': 0.4
					}
				})
			}
		})
		this.around.onClick(async () => {
			if(this.map.busy) return
			let e = {self: this.around, iAround:iAround(), iHide: iHide(), iLoading:iLoading()}
			if(this.map.onAround) {
				e.x = 1
				window.mbAct({act:'getAround', e})
			} else{
				await window.mbAct({act:'getAround', e})
			}
		})
		
		this.layer.onClick(async() => {
			const lt = [
					{
						id: 'default',
						name: '卫星',
						uri: 'mapbox://styles/alexzarkk/ckqt2gqrc650n17nw67q4glqu',
					}, {
						id: 'amap',
						name: '高德',
						uri: {
								"version": 8,
								"maxZoom": 16,
								"sprite": "mapbox://sprites/alexzarkk/ckqt2gqrc650n17nw67q4glqu/21or8nowiiy9363ixyjtyrqc3",
								"glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
								"sources": {
									"raster-tiles": {
										"type": "raster",
										"tiles": ["https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"],
										"tileSize": 256
									},
									"raster-tiles2": {
										"type": "raster",
										"tiles": ['https://webst03.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'],
										"tileSize": 256
									}
								},
								"layers": [{
									"id": "simple-tiles",
									"type": "raster",
									"source": "raster-tiles",
									"minzoom": 1,
									"maxzoom": 20
								},{
									"id": "simple-tiles2",
									"type": "raster",
									"source": "raster-tiles2",
									"minzoom": 1,
									"maxzoom": 20
								}]
						}
					}, {
						id: 'tdt',
						name: '天地图',
						uri: {
								"version": 8,
								"sprite": "mapbox://sprites/alexzarkk/ckqt2gqrc650n17nw67q4glqu/21or8nowiiy9363ixyjtyrqc3",
								"glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
								"sources": {
									"raster-tiles": {
										"type": "raster",
										"tiles": ["https://t7.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk="+this.tdtKey],
										"tileSize": 256
									},
									"raster-tiles2": {
										"type": "raster",
										"tiles": ['https://t7.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk='+this.tdtKey],
										"tileSize": 256
									}
								},
								"layers": [{
									"id": "simple-tiles",
									"type": "raster",
									"source": "raster-tiles",
									"minzoom": 0,
									"maxzoom": 20
								},{
									"id": "simple-tiles2",
									"type": "raster",
									"source": "raster-tiles2",
									"minzoom": 0,
									"maxzoom": 20
								}]
						}
					}, {
						id: 'outdoor',
						name: '等高线',
						uri: 'mapbox://styles/alexzarkk/ckqt2v6eo1qa517rre0cz6fby'
					}
				]
			
			
			let map = this.map
			this.st ++
			if(this.st>3) this.st = 0
			map.zz.sid = lt[this.st].id
			map.zz.nav = {r:{}}
			this.xDem()
			this.xEle()
			this.load()
			
			map.setStyle(lt[this.st].uri)
			await map.once('idle')
			// window.mbAct({act:'onLoc'})
			
			this.done()
			window.mbAct({act:'chgStyle',e:'已切换至：'+lt[this.st].name+' 地图'})
		})
		
		for (let k in this) {
			if(this[k] && this[k].node) {
				this.addButton(this[k])
			}
		}
    }
    onAddControl() {
        this.insert();
    }
}