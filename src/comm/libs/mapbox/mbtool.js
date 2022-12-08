import { async } from 'regenerator-runtime'
import { Marker, Popup } from 'mapbox-gl/dist/mapbox-gl'
var helpers = require('@turf/helpers')
import { along, bbox, bearing, bezierSpline, destination, distance, length } from '@turf/turf'
import { uniqId, isSame, dist, clone, trans, getLocation, geoErr, calData, fixNum, math, reArr } from '@/comm/geotools.js'

import { isDev } from '@/comm/bd'
import comm from '@/comm/comm'
import icon from '@/comm/libs/icon'
import prop from '@/comm/libs/prop'
import grid from '@/comm/libs/grid'

const
turf = {
	along,
	helpers,
	length,
	
	box: (c)=>{return bbox(helpers.lineString(c))},
	coord: (c)=>{return helpers.point(c)},
	line: (c)=>{return helpers.lineString(c)},
	bzLine: (c)=>{return bezierSpline(turf.line(c))},
	bearing: (c1,c2)=>{return bearing(turf.coord(c1), turf.coord(c2))},
	destination: (c1,c2,d)=>{return destination(turf.coord(c1), d/1000, turf.bearing(c1, c2))},
	dist: (c1,c2)=>{return distance(turf.coord(c1), turf.coord(c2))*1000}
},

/**
 * 坐标补全
 * @param {Array} coord 轨迹坐标
 * @param {Number} dist 间隔距离 m
 */
fixAdd = (coord, dist = 12.2) =>{
	let c = []
		
	const add =(c1, c2)=>{
		c.push(c1)
		let to = turf.destination(c1, c2, dist).geometry.coordinates
			to.push(c1[2]||0)
			
		let b1 = turf.bearing(c1, c2),
			b2 = turf.bearing(to, c2)
			
		// console.log(td);
		if (turf.dist(to, c2) > dist/2 && ~~(b1-b2)==0) {
			add(to, c2)
		}
	}
	
	for (let i = 1; i < coord.length; i++) {
		add(coord[i-1], coord[i])
	}
	c.push(coord[coord.length-1])
	return c
},

removeObj = (map, id, _) =>{
	if(map.getLayer(id)){
		map.removeLayer(id)
		if(_) map.removeLayer(id+'_')
	} 
	if(map.getSource(id)) map.removeSource(id)
	if(map.hasImage(id)) map.removeImage(id)
},
toggleLayer = (m,o)=>{
	if(m.getLayer(o._id)){
		m.setLayoutProperty(o._id, 'visibility', o.hide?'none':'visible')
		if(o.t2&&o.t2==2) m.setLayoutProperty(o._id+'_', 'visibility', o.hide?'none':'visible')
		return true
	} else {
		return false
	}
},

polygonToLine = (e)=>{
	let line = []
	for (let x of e.features) {
		for (let s of x.geometry.coordinates) {
			line.push({
				_id: uniqId(),
				t1:1,
				coord:s[0]
			})
		}
	}
	e.line = line
},

createGeo = (e,s)=>{
	let t1 = e.t1||1
	return {
		'type': 'geojson',
		'data': {
			'type': 'Feature',
			'geometry': {
				'type': prop[t1].v,
				'coordinates': s=='amap'? trans(e.coord) : e.coord
			},
			'properties': {
				'title': e.sn || e.name || e.title || ''
			}
		}
	}
},

layerLine = (s)=>{
	let p = s.grade? prop.grade[s.grade] : prop[s.t2||1]
	// let p = prop[s.t2||1]
	return {
		'id': s._id,
		'type': 'line',
		'source': s._id,
		'layout': {
			// 'line-join': p.join || 'miter',
			// 'line-cap': p.cap || 'round',
			// 'symbol-placement': 'line',
			// 'symbol-spacing': 50,
			// 'icon-image': 'arrowIcon',
			// 'icon-size': 0.5
		},
		'paint': {
			'line-color': p.color,
			'line-width': p.width,
			'line-opacity': p.opacity,
			'line-gap-width': p.gap || 0,
			'line-blur': p.blur || 0,
			'line-dasharray': p.dasharray || [1]
		}
	}
},
href = (act,t,k)=>{
	return "<a class=map-href act="+encodeURI(JSON.stringify({act,pm:{...t}}))+" onclick='window.mbAct(JSON.parse(decodeURI(this.getAttribute(\"act\"))))'>"+k+"</a>"
},
htmlLine = (t, add)=>{
	let imgs = ''
	if(t.imgs){
		for (var i = 0; i < t.imgs.length; i++) {
			imgs += "<div><img data="+JSON.stringify({act:'viewImg', imgs:t.imgs,idx:i})+" onclick='window.mbAct(JSON.parse(this.getAttribute(\"data\")))' style='width:220px' src="+t.imgs[i]+"></img></div>"
		}
	}
	let h = `<p><b><font size="3" color="orange">${t.name}</font></b></p>` + (imgs?`<div>照片：</div>${imgs}</div>`:'')
	
	if(!t.info) t.info = calData(t.coord)
	
	if(t.info){
		h +=`<p>长度：<b>${t.info.flatLen + t.info.upLen + t.info.downLen}</b>m</p>` +
			`<p>海拔：最高 <b>${t.info.top}</b>m 最低 <b>${t.info.bottom}</b>m</p>` +
			`<p>累计：↑ <b>${t.info.up}</b>m ↓<b>${t.info.down}</b>m</p>`
	}
	if(t.t2=='2bl1') {
		h += (add?"<p>"+href('add',t,'添加')+"</p>":"") +
			`<p><font size=1 color=gray>路网引用于“两步路”APP（侵权 删）</font></p>`
	}
	return  h
},

setActive = (map, pm, opt={}, loop) => {
	
	console.log(opt,'setActive');
	
	return new Promise((res, rej) => { 
		if(!pm||!pm.coord) return
		
		if(map.zz.running) clearTimeout(map.zz.running)
		
		let cds = map.zz.sid=='amap'? trans(pm.coord) : clone(pm.coord)
		if(pm.t1==2) {
			let t2 = [pm]
			if(pm.direction) {
				for (let t of pm.direction) {
					for (let s of t.target) {
						t2.push({ ...s, _id: uniqId(), t1: 2, t2: 200 })
					}
				}
			}
			setPoint(map, t2)
			return map.flyTo({center:[cds[0],cds[1]], zoom:16, bearing: pm.curDrect||0})
		} 
		
		map.zz.curLine = pm
		if(!loop) {
			map.fitBounds(turf.box(cds), {
				padding: {top:25, bottom:25, left: 15, right: 15}
			})
		}
		
		let id = 'active_running',
			coord = fixAdd(cds,6),
			geo = createGeo({t1:1,t2:10, coord: [pm.coord[0]], _id: id},map.zz.sid),
			paint = {
				'line-color': opt.color||'#ffff00',
				'line-width': opt.width||5,
				'line-opacity':opt.opacity||0.8
			}
		
		removeObj(map, id)
		if(pm.id != 'selected') {
			let color = ['#0000FF','#00aaff','#55ffff','#00FF00','#FFFF00','#FFA500','#FF0000','#8B0000'],
				progress = [],
				info = calData(reArr(coord),true),
				// info = pm.info,
				range = info.top - info.bottom
				
			if(range>50) {
				info.dElv.forEach((e,i)=>{
					progress.push((i+1)/info.dElv.length)
					progress.push(color[math((e[1]-info.bottom)/(range/(color.length-1)),0)])
				})
				paint = {
					'line-color': 'red',
					'line-width': opt.width||5,
					'line-opacity':opt.opacity||0.8,
					'line-gradient': [
						'interpolate',
						['linear'],
						['line-progress'],
							...progress
						]
				}
			}
		}
		
		geo.lineMetrics = true
		map.addSource(id, geo)
		
		map.addLayer({
			id,
			source: id,
			paint,
			type: 'line',
			layout: {
				'line-join': 'round',
				'line-cap': 'round'
			}
		})
		
		const go = (g, idx, count)=>{
			if(g.geometry.coordinates.length >= coord.length) {
				map.zz.running = null
				if(loop) {
					setActive(map, pm, opt, loop)
				}else {
					res(true) 
				}
			}
			for (var i = idx*count; i < (idx*count+count) && i<coord.length; i++) {
				g.geometry.coordinates.push(coord[i])
			}
			idx ++
			map.getSource(id).setData(g)
			
			map.zz.running = setTimeout(()=>{go(g,idx,count)}, 33)
		}
		go(geo.data, 0, Math.ceil(coord.length/opt.t||100))
	})
},

move =(map,pm)=>{
	let idx = 0,
		_id = 'onMark_'+pm._id,
		coord = fixAdd(pm.coord,5),
		point = {
			'type': 'FeatureCollection',
			'features': [
				{
					'type': 'Feature',
					'properties': {},
					'geometry': {
						'type': 'Point',
						'coordinates': coord
					}
				}
			]
		}
		
	map.addSource(_id, {
		'type': 'geojson',
		'data': point
	})
	map.addLayer({
		'id': _id,
		'source': _id,
		'type': 'symbol',
		'layout': {
			'icon-image': 'zts',
			'icon-size': 0.9,
			'icon-anchor': 'bottom',
			
			'icon-rotate': ['get', 'bearing'],
			'icon-rotation-alignment': 'map',
			'icon-allow-overlap': true,
			'icon-ignore-placement': true
		}
	})
	
	
	const draw = ()=>{
		if(idx == coord.length-1) {
			idx = 0
		}
		idx ++ 
		point.features[0].geometry.coordinates = coord[idx]
		map.getSource(_id).setData(point)
		
		setTimeout(()=>{
			draw()
		}, (pm.speed||1) * 100)
	}
	
	draw()
},

run = (map,btn) =>{
	// console.log('run',btn);
	let id = 'trace',
		line = map.zz.curLine
	
	if(map.play) {
		if(btn.x) {
			// btn.around.node.style.display = ''
			btn.self.node.childNodes[0].remove()
			btn.self.setIcon(btn.iconRun)
			
			window.cancelAnimationFrame(map.play)
			map.play = null
			map.runmarker.remove()
			removeObj(map, id)
		}
		return
	}
	
	// btn.around.node.style.display = 'none'
	btn.self.node.childNodes[0].remove()
	btn.self.setIcon(btn.iconStop)
	
	if(map.runmarker) {
		map.runmarker.remove()
		removeObj(map, id)
	}
	map.play = 1
	map.runrotate = 0
	
	let start,
		// cfg = this.runCfg,
		cfg = {
			speed: 1,
			circle: 1,
			animationDuration: 200000
		},
		// info = calData(line.coord),
		info = line.info,
		geojs = createGeo({t1:1,t2:10, coord: line.coord, _id: id}, map.zz.sid),
		pinRoute = geojs.data.geometry.coordinates,
		path = turf.line(pinRoute),
		pathDistance = turf.length(path),
		popup = new Popup({ closeButton: false,closeOnClick:false }),
		marker = new Marker({
			color: 'green',
			scale: 1.2,
			pitchAlignment: 'auto',
			rotationAlignment: 'auto'
		}).setLngLat(pinRoute[0]).setPopup(popup).addTo(map).togglePopup()
		
	cfg.animationDuration = info.len * 10
	
	map.runmarker = marker
	map.addSource(id, {
		type: 'geojson',
		lineMetrics: true,
		data: {
			type: 'FeatureCollection',
			features: [ geojs.data ]
		}
	})
	
	map.addLayer({
		id,
		type: 'line',
		source: id,
		paint: {
			// 'line-color': '#00ff00',
			'line-width': 7,
			'line-opacity': 0.8
		},
		layout: {
			'line-cap': 'round',
			'line-join': 'round'
		}
	});
	
	// console.log('地图start ...pathDistance', pathDistance);
	const frame = (time)=> {
		if (!start) start = time
		const animationPhase = (time - start) / cfg.animationDuration * cfg.speed
		if (animationPhase > 1) {
			btn.done()
			// btn.around.node.style.display = ''
			btn.self.node.childNodes[0].remove()
			btn.self.setIcon(btn.iconRun)
			return map.play = null
		}
		
		const alongPath = turf.along(path, pathDistance * animationPhase).geometry.coordinates
		const lngLat = { lng: alongPath[0], lat: alongPath[1] }
		
		const elevation = Math.floor(map.queryTerrainElevation(lngLat, { exaggerated: false }))
		
		popup.setHTML('<font size="3">海拔: ' + elevation + 'm</font><br/>')
		marker.setLngLat(lngLat)
			
		map.setPaintProperty(id, 'line-gradient', ['step', ['line-progress'], '#fff', animationPhase, 'rgba(255, 0, 0, 0)'])
			
		map.setCenter(lngLat)
		const rotation = animationPhase * 500 * cfg.circle + map.runrotate
		
		map.setBearing(rotation % 360)
		
		map.play = window.requestAnimationFrame(frame)
	}
	window.requestAnimationFrame(frame)
	setActive(map, line, {width:4,opacity:0.6})
},

/**
 * @param {Object} coord 	坐标数组
 * @param {Object} partial	是否局部更新
 */
getElevation = async(coord, partial=false) =>{
	let ele=[],idx=[],point = typeof(coord[0])=="number"
	if(partial) {
		for (var i = 0; i < coord.length; i++) {
			if(!coord[i][2]) {
				ele.push(coord[i])
				idx.push(i)
			}
		}
	} else {
		ele = coord
	}
	return new Promise((resolve, reject) => {
		if(coord.length) {
			comm.req({ $url: '/public/zz/elevation', coord: ele }).then((e) => {
				if(partial) {
					for (var i = 0; i < e.length; i++) {
						coord[idx[i]] = e[i]
					}
				}
				resolve((partial? coord : e))
			}).catch(e=>{
				// 重试1次
				// if(!again) return getElevation(coord, partial, 1)
				if(point){
					coord = [fixNum(coord[0],5),fixNum(coord[1],5), 0]
				} else {
					for (var i = 0; i < e.length; i++) {
						coord[i] = [fixNum(coord[i][0],5), fixNum(coord[i][1],5), 0]
					}
				}
				resolve(coord)
			})
		}else{
			resolve(coord)
		}
	})
},

setLine = (map, line, beforeId=1) => {
	if(beforeId==1) {
		let l = map.getStyle()
		beforeId = l.layers[l.layers.length-1].id
	} else {
		for (let k in map.zz.pm) {
			if(map.zz.pm[k].t1==1) {
				beforeId = k
				break
			}
		}
	}
	
	for (let s of line) {
		
		let id = ''+(s._id||s.id),
			pro = s.grade? prop.grade[s.grade] : prop[s.t2||1]
			
		map.zz.pm[id] = s
		// removeObj(map, id)
		
		map.addSource(id, createGeo(s,map.zz.sid))
		map.addLayer(layerLine(s), beforeId)
		if(s.t2!='bound') {
			map.on('click', id, (e)=> {
				if(!map.zz.pop && !map.zz.drawing) {
					map.zz.pop = true
					
					try{
						let t = map.zz.pm[id],
							html = htmlLine(t, map.zz.editble)
						
						if(t.t2!='2bl1') {
							setActive(map, t)
							if(map.zz.editble && !t.noEdit){
								html +=	"<p>" +
											href('edit',t,'编辑')+"&nbsp;&nbsp;&nbsp;&nbsp;" +
											href('draw',t,'绘制')+"&nbsp;&nbsp;&nbsp;&nbsp;" +
											href('del',t,'删除') +
										"</p>"
							}
						} 
						
						let pop = new Popup({ maxWidth: '500px' }).setLngLat(e.lngLat).setHTML(html).addTo(map)
						map.zz.pp = pop
						pop.on('close', (e)=>{ map.zz.pop = false })
					}catch(e){
						console.error('setLine.err',e)
						map.zz.pop = false
					}
				}
			})
		}
		
		if(pro.on) {
			map.on('mouseenter', id, (e)=>{
				if(map.zz.drawing) return
				map.busy = true
				map.getCanvas().style.cursor = 'pointer'
				map.setPaintProperty(id, 'line-width', pro.width+1)
				map.setPaintProperty(id, 'line-color', pro.on)
			})
			 
			map.on('mouseleave', id, (e)=>{
				if(map.zz.drawing) return
				map.busy = false
				map.getCanvas().style.cursor = ''
				map.setPaintProperty(id, 'line-width', pro.width)
				map.setPaintProperty(id, 'line-color', pro.color)
			})
		}
		
		if(s.t2=='2bl1') {
			map.zz._2p.push(id)
		}
	}
},

setPoint = (map, point, beforeId)=> {
	
	for (var i = 0; i < point.length; i++) {
		
		let s = point[i],
			id = ''+(s._id||s.id)
		
		map.zz.pm[id] = s
		if(s.t2=='2bl2') map.zz._2p.push(id)
		
		removeObj(map, id, '_')
		
		map.addSource(id, createGeo(s,map.zz.sid))
		let lay = {
			id,
			'filter': ['all',['<', ['pitch'], 60]],
			'type': 'symbol',
			'source': id, // reference the data source
			'background-color': "#ff0",
			'layout': {
				// 'background-color': "#ff0",
				'icon-anchor': 'bottom',
				'icon-image': s.t2+'', // reference the image
				'icon-size': 0.8,
				'text-field': ['get', 'title'],
				
				'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
				'text-offset': [0.5,1],
				'text-anchor': 'bottom-left',
			},
			'paint': {
				'text-color': "#ffbe19",
				'text-halo-blur': 0.5,
				'text-halo-color': "hsl(0, 5%, 0%)",
				'text-halo-width': 0.5
			}
		}
		map.addLayer(lay)
		
		let _d = clone(lay)
		_d.id = id+'_'
		_d.layout['icon-image'] = 'leader_line'
		_d.layout['icon-anchor'] = 'bottom'
		_d.layout['text-offset'] = [0, -6.2]
		_d.filter = ['all', ['>=', ['pitch'], 60]]
		map.addLayer(_d, id)
		
		map.on('click', id, (e)=> {
			if(!map.zz.pop && !map.zz.drawing) {
				map.zz.pop = true
				try{
					let t = map.zz.pm[id],
						imgs = '',
						video = ''
					if(t.imgs){
						for (var i = 0; i < t.imgs.length; i++) {
							imgs += "<div><img data="+JSON.stringify({act:'viewImg', imgs:t.imgs,idx:i})+" onclick='window.mbAct(JSON.parse(this.getAttribute(\"data\")))' style='width:220px' src="+t.imgs[i]+"></img></div>"
						}
					}
					if(t.video) {
						video = "<div><video data="+JSON.stringify({act:'viewVideo', url:t.video.url})+" style='width:220px' onclick='window.mbAct(JSON.parse(this.getAttribute(\"data\")))'><source src="+t.video.url+" type='video/mp4'/></video></div>"
					}
					
					let html = (t.name? `<p><b><font size="3" color="orange">${t.name}</font></b></p>`:'') +
								(t.desc? `<p><h3>${t.desc}</h3></p>`:'') +
								(t.sn? `<p>编码：${t.sn}</p>`:'') +
								(t.curTime? `<p>时间：${t.curTime}</p>`:'') +
								`<p>类型：${prop[t.t2].text}</p>` + (imgs?`<div>照片：</div>${imgs}</div>`:'') +
								video +
								`<p>经纬度：<b>${t.coord[0]}, ${t.coord[1]}</b></p>` +
								`<p>海拔： <b>${t.coord[2] || 0 }</b>m</p><p>` +
								`<p>地址：<span id="zddr"></span></p>`
					
					if(t.t2=='2bl2') {
						if(map.zz.editble) {
							html += "<p><"+href('add',t,'添加')+"</p>"
						}
						html += `<p><font size=1 color=gray>照片引用于“两步路”APP（侵权 删）</font></p>`
					}else{
						if(map.zz.editble && !t.noEdit) {
							html +=	href('edit',t,'编辑')+"&nbsp;&nbsp;&nbsp;&nbsp;" +
									href('draw',t,'移动')+"&nbsp;&nbsp;&nbsp;&nbsp;" +
									href('del',t,'删除')
						
							if(t.t2&&(t.t2==29||t.t2==28)){
								html += "&nbsp;&nbsp;&nbsp;&nbsp;" + href('direct',t,'指向')
							}
						}
					}
					
					
					window.uni.request({
						url:'https://api.tianditu.gov.cn/geocoder?postStr='+JSON.stringify({lon:t.coord[0],lat:t.coord[1],ver:1})+'&type=geocode&tk=70ede380913047ef13bc4dc92ff4f75b'
					}).then(tdt=>{
						document.getElementById('zddr').innerText = tdt[1].data.result.formatted_address
					})
					// + `<p>地址：<span id="zddr"></span></p>`
					// window.Geocoder.getAddress(s.coord, (st, e)=>{
					// 	if (st === 'complete' && e.info === 'OK') {
					// 		document.getElementById('zddr').innerText = e.regeocode.formattedAddress
					// 	}
					// })
					
					let pop = new Popup({ maxWidth: '500px'	}).setLngLat(e.lngLat).setHTML(html).addTo(map)
					map.zz.pp = pop
					
					if(t.video) window.mbAct({act:'viewVideo', url:t.video.url})
					pop.on('close', (e)=>{ map.zz.pop = false })
					
				}catch(e){
					console.error(e,s)
					map.zz.pop = false
				}
			}
		})
	}
},

setGon =(map, gon)=> {
	
},

getAround = async(map, loc, btn) =>{
	if(map.aroundmarker) {
		map.aroundmarker.remove()
	}
	for (let x of map.zz._2p) {
		removeObj(map, x, x.startsWith('_')?'_':'')
	}
	btn.self.node.childNodes[0].remove()
	if(btn.x) {
		map.busy = false
		map.onAround = false
		btn.self.setIcon(btn.iAround)
		return
	}
	btn.self.setIcon(btn.iLoading)
	map.onAround = true	
	map.busy = true
	
	//超时取消
	setTimeout(()=>{ if(map.busy){ btn.x=1; getAround(map, null, btn) } },60000)
	
	if(!loc){ loc = map.getCenter() }
	let popup = new Popup({}),
		marker = new Marker().setLngLat(loc).setPopup(popup).addTo(map).togglePopup()
	
	getElevation([loc.lng,loc.lat]).then(e=>{
		popup.setHTML('<font size="3">坐标附近路网</font><font size="2">（可拖动）</font></br>经纬度：'+e[0]+','+e[1]+'</br>海拔：'+e[2]+'m')
	})
	
	//2bl
	let bl2 = await comm.req({ $url: '/public/zz/around2bl', size: 15, ...loc })
	for (let s of bl2) {
		let id = s.id.replace(/%/g, ''),
			e = comm.getStorage('_2bl'+id)
		if(!e) {
			e = await comm.req({ $url: '/public/zz/pm2bl', _id: s.id })
			for (let x of e.line) { x.name = s.name }
			comm.setStorage('_2bl'+id, e)
		}
		s.line = e.line
		s.point = e.point
		s.time = e.time
		setLine(map, s.line, 1)
	}
	for (let s of bl2) {
		setPoint(map, s.point)
	}
	
	//6ft
	// let bounds = map.getBounds()
	// const o2s = (o)=>{ return fixNum(o.lng)+','+fixNum(o.lat) }
	// let ft6 = await comm.req({data:{ $url: '/public/zz/around6ft', ne: o2s(bounds.getNorthEast()), sw: o2s(bounds.getSouthWest()), zoom: ~~map.getZoom() }})
	// console.log(ft6)
	
	map.busy = false
	btn.self.node.childNodes[0].remove()
	btn.self.setIcon(btn.iHide)
	
	marker.setDraggable(true)
	marker.on('dragend', () =>{
		marker.setDraggable(false)
		getAround(map, marker.getLngLat(), btn)
	})
	marker.getPopup().remove()
	
	map.aroundmarker = marker
},

setKml = (m,pms,line,point,gon,act=0)=>{
	
	if(pms) {
		line = line.concat(pms.filter(e=>e.t1==1))
		point = point.concat(pms.filter(e=>e.t1==2))
		gon = gon.concat(pms.filter(e=>e.t1==3))
	}
	
	setLine(m, line)
	setGon(m, gon)
	setTimeout(()=> {
		if(m.getSource('x_dem')) {
			m.setPitch(60, {duration: 4000})
		} else {
			m.setPitch(0, {duration: 2000})
		}
		
		if(act&&line.length) setActive(m, line[0])
		
		setPoint(m, point)
		
	}, 1200)
},


setBound= async (map, code=330000)=>{
	// const province = require('https://zts.5618.co/static/geo/chart/330000.json')
	
	let area = await comm.req({ $url: '/public/zz/geoGon', code })
	setLine(map, area.children)
	
	// return console.log(area,'gongongongongon');s
	
	let newPolygon = [],
		center = [119.476498,29.898918],
		mask = null, //	遮罩的geojson数据
		polygon = null, // 高亮区域的geojosn
		masked = null, // 遮罩生成以后的geojson数据
		maskSource = [
			[73, 53],
			[134, 53],
			[134, 18],
			[73, 18],
		] // 遮罩数据
		
	let isCity = false // 是否城市
	let features = province.features; // 用作polygon的geojson数据
	if (deptNum === 330000) { // 当前是浙江省的地理数据
		// console.log("当前获取到的浙江省的地理信息", province)
		let areaPolygon = []
		// province.features
		for (let i = 0; i < province.features.length; i++) {
			province.features[i].geometry.coordinates.forEach((item, index) => {
				areaPolygon.push(province.features[i].geometry.coordinates[index][0]);
			})
		}
		// console.log("当前浙江省的数据", areaPolygon)
		newPolygon = areaPolygon  // 浙江省的polygon 数组数据
		// return;
	}else if(deptNum % 100 === 0) { // 判断当前是否是城市一级
		isCity = true
	}
	
	// try {
	// 	if (isCity) { // 获取城市一级的数据,从全省的数据中获取
	// 		// console.log("城市地理数据",province)
	// 		const city = province.features.find(item => {
	// 			return item.properties.adcode === deptNum // 返回当前的城市一级
	// 		})
	// 		features = city
	// 	} else { // 区县一级数据
	// 		const deptData = require(`@/static/geo/chart/${deptNum}.json`)
	// 		features = deptData.features[0]
	// 	}
	// } catch (err) {
	// 	console.log("获取到部门信息失败了", err)
	// }
	
	
	
	// center = features.properties.center
	/**
	 * 计算出高亮的数据
	 */
	// if (deptNum === 330000) {  // 浙江省获取高亮数据
		
	// } else {  // 非浙江省获取高亮数据
		// const areaPolygon = features.geometry.coordinates // 地区边界的多边形数据
		// areaPolygon.forEach((item, index) => { // 从本地json 文件读取到polygon数据
		// 	newPolygon.push(deptNum === 330000?areaPolygon[index]:areaPolygon[index][0]); // 提取到可以用于遮罩的数据
		// });
	// }
	polygon = { // 高亮数据
		geometry: {
			coordinates: newPolygon,
			type: "Polygon"
		},
		properties: {},
		type: "Feature"
	}
	newPolygon.unshift(maskSource) // 加入遮罩的数据
	masked = {
		geometry: {
			coordinates: newPolygon,
			type: "Polygon"
		},
		properties: {},
		type: "Feature"
	}
	console.log(map.getStyle());
	
	
	if (map.getLayer('my-mask-layer')) {
		map.removeLayer('my-mask-layer')
	}
	if (map.getSource('my-mask-source')) { // 清空当前的图层
		map.removeSource('my-mask-source')
	}
	
	let mapStyle = map.getStyle().name
	
	console.log(mapStyle,mapStyle);
	setTimeout(()=>{
		map.addSource('my-mask-source', {
			type: 'geojson',
			data: masked
		});
		map.addLayer({
			id: 'my-mask-layer',
			type: 'fill',
			source: 'my-mask-source',
			paint: {
				'fill-color': mapStyle=='Outdoors'? '#000':'#fff',
				'fill-opacity': mapStyle=='Outdoors'? 0.2:0.3
			}
		})
	}, 333)
	
	return center
},

on = async(map,f=0) => {
	if(map.ztsGrid) {
		let center = map.getCenter(),
			k = comm.nearst([center.lng,center.lat]),
			zoom = math(map.getZoom(),0),
			nav = map.zz.nav,
			bounds = map.getBounds(),
			ne = bounds.getNorthEast(),
			sw = bounds.getSouthWest(),
			xy = ~~(math(~~(dist([ne.lng, ne.lat], [sw.lng, sw.lat])+(zoom>=15?8000:0))/10000,0) * 10000/0.5)||10000
		
		if (!nav[k]) nav[k] = {}
		if(!f) {
			if (!k||isSame(nav.x,[k,zoom,xy])||nav.busy) return
		}
		
		nav.x = [k,zoom,xy]
		nav.busy = true
		if(zoom>19) zoom = 19
		if(zoom<8) zoom = 8
		
		
		let kml = await comm.gridNet(k,xy,zoom)
		
		for (let k in nav.r) {
			map.setLayoutProperty(k, 'visibility', 'none')
		}
		// console.log(k, zoom, xy,'req ----------', kml[k])
		for (let s of kml.line) {
			let id = s._id
			nav.r[id] = 0
			if(!map.getLayer(id)) {
				setLine(map,[s],1)
			} else {
				map.setLayoutProperty(id, 'visibility', 'visible')
			}
		}
		for (let s of kml.point) {
			let id = s._id
			nav.r[id] = 1
			if(!map.getLayer(id)){
				setPoint(map,[s])
			} else {
				map.setLayoutProperty(id, 'visibility', 'visible')
			}
		}
		nav.busy = false
	} else {
		let nav = map.zz.nav
		for (let k in nav.r) {
			map.setLayoutProperty(k, 'visibility', 'none')
		}
	}
}

module.exports = {
	fixNum,
	
	prop,
	turf,
	
	removeObj,
	
	createGeo,
	layerLine,
	htmlLine,
	polygonToLine,
	
	run,
	setKml,
	setLine,
	setPoint,
	setGon,
	setActive,
	move,
	
	getElevation,
	getAround,
	setBound,
	on
}