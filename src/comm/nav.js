import { async } from 'regenerator-runtime'
import zz from '@/comm/zz'

import { isSame, uniqId, eqCoord, bearing, getDist, dist, trans, calData, fixNum, math } from '@/comm/geotools'

import comm from '@/comm/comm'
import icon from '@/comm/libs/icon'
import prop from '@/comm/libs/prop'

const
pngSize = (png)=>{
	if (png.substring(0,22) == 'data:image/png;base64,') {
		let d = png.substring(22 + 20, 22 + 32),
			s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
			n = [],
			b = []
			
		for (let c of d) {
			n.push(s.indexOf(c))
		}
		for(let i = 0; i < n.length; i += 4) {
			b.push((n[i] << 2) + (n[i+1] >> 4))
			b.push(((n[i+1] & 15) << 4) + (n[i+2] >> 2))
			b.push(((n[i+2] & 3) << 6) + n[i+3])
		}
		return { width: (b[1] << 24) + (b[2] << 16) + (b[3] << 8) + b[4], height: (b[5] << 24) + (b[6] << 16) + (b[7] << 8) + b[8] }
	}
	throw Error('unsupported image type')
},
createEle = (s,t,ip)=>{
	if(s.t1==1) {
		let points = s.coord.map(e => {
			if(t) e = trans(e)
			return { latitude: e[1], longitude: e[0] }
		}),
		pp = s.grade? prop.grade[s.grade] : prop[s.t2||1]
		
		return {
			points,
			_id: s._id,
			color: pp.color,
			width: pp.width,
			dottedLine: s.grade!=undefined
		}
	}
	if(s.t1==2) {
		let iconPath = ip||icon[s.t2||200],
			wh = pngSize(iconPath),
			coord = t?trans(s.coord):s.coord,
			title = s.sn||s.name||s._id
			
		return {
			s,
			id: s._id,
			title,
			latitude: coord[1],
			longitude: coord[0],
			iconPath,
			...wh,
			callout: {
				display: ip?'ALWAYS':'BYCLICK',
				fontSize: 14,
				padding: 2,
				content: title + (s.desc? '\n'+s.desc:'')
			}
		}
	}
},
nearstC = (c, cds, d = 10000) => {
	let nearst = null
	
	for (var i = 0; i <cds.length; i++) {
		let t = cds[i],
			_d = dist(c, t)
			
		if (_d < d) {
			d = _d
			nearst = [t,i,d]
		}
		if(d<=6) return nearst
	}
	return nearst
},
toDist = (cs, poi, cds) => {
	if(!cds) {
		for (let s of poi) {
			s.dist = dist(s.coord, cs)
		}
	}else{
		let cc = nearstC(cs, cds, Number.MAX_SAFE_INTEGER)
		
		for (let s of poi) {
			let eLen = 0
			if(s.i==undefined) {
				let n = nearstC(s.coord, cds, 500)
				if(n) {
					s.i = n[1]
					eLen = n[2]
				}
			}
			if(s.i!=undefined) {
				let c1
				for (let i = (cc[1]<s.i? cc[1]:s.i); i < (cc[1]<s.i? s.i:cc[1]); i++) {
					let c2 = cds[i]
					if(c1) eLen += dist(c1, c2)
					c1 = c2
				}
				s.dist = cc[2] + eLen
			}
		}
	}
	// poi.sort(comm.compare('dist'))
}


async function scan(coord){
	
	let e = await zz.scan()
	if(e) {
		if(e.result.startsWith('https://z.szs.run')) {
			if(!coord) {
				const [_,c] = await uni.getLocation({type:'wgs84'})
				coord = [fixNum(c.longitude), fixNum(c.latitude), ~~c.altitude]
			}
			
			let sn = zz.getQueryParam(e.result, 'o'),
				code = { sn, coord, tim: zz.time2Date() },
				log = uni.getStorageSync('user_scan_log')||{temp:[]},
				cps = comm.getStorage('sys_nav_cps')||{}
				
			if(!cps[sn]) {
				let x = await zz.req({ $fn:'zz', $url: 'scan', sn })
				if(!x) return zz.modal('无效二维码！')
				if(x.status<40) return zz.modal('此柱尚未开启打卡功能！')
				cps[sn] = {_id: sn, t2: x.t2, coord: x.coord}
			}
			if(dist(cps[sn].coord, coord)>160) {
				return zz.modal('错误：超出距离范围！（请确认手机定位功能已开启，并在【'+sn+'】柱子附近）')
			}
			
			if (!log[sn]) {
				log[sn] = []
			} else {
				if((zz.now() - log[sn][log[sn].length-1]) < 1000*60*60*24) {
					return zz.modal('您已于 ' + zz.timeFrom(log[sn][log[sn].length-1]) + ' 打卡此码！\n（1天内只能进行一次足迹打卡）')
				}
			}
			
			if(await comm.hadNet() != 'none') {
				await zz.req({ $url: 'user/scan/add', ...code }, true).then(x=>{
					zz.toast('足迹打卡成功！')
				})
			}else{
				log.temp.push(code)
			}
			
			log[sn].push(zz.date2Time(code.tim))
			uni.setStorageSync('user_scan_log', log)
			return {
				...code,
				_id: uniqId(),
				t1: 2,
				t2: 92
			}
		}else{
			zz.toast('非环浙步道二维码！')
		}
	}
}

async function on(){
	const getZoom = async()=>{
		return new Promise((res) => {
			this.amap.getScale({
				success(x){ res(~~x.scale) }
			})
		})
	},
	center = async()=>{
		return new Promise((res) => {
			this.amap.getCenterLocation({
				success(x){ res(x) }
			})
		})
	},
	getXY = async()=>{
		return new Promise((res) => {
			this.amap.getRegion({
				success(x){ res(x) }
			})
		})
	}
	
	let nav = this.nav,
		ct = await center(),
		k = comm.nearst(trans([ct.longitude, ct.latitude], 'gcj02towgs84')),
		zoom = await getZoom(),
		x = await getXY(),
		sw = x.southwest,
		ne = x.northeast,
		xy = ~~(math(~~(getDist(ne.longitude, ne.latitude, sw.longitude, sw.latitude)+(zoom>=15?8000:0))/10000,0) * 10000/0.5)||10000
	
	if (!k||isSame(nav.k,[k,zoom,xy])||nav.busy) return
	
	// console.log('setnav ...............',k,zoom,xy);
	
	nav.busy = true
	nav.k = [k,zoom,xy]
	if(zoom>19) zoom = 19
	if(zoom<9) zoom = 9
	
	let kml = await comm.gridNet(k,xy,zoom),
		line = [],
		point = []
		
	for (let s of kml.line) {
		line.push(createEle(s,1))
	}
	for (let s of kml.point) {
		point.push(createEle(s,1,icon[202]))
	}
	nav.line = line
	nav.point = point
	
	nav.busy = false
}

// async function around(c) {
	
// 	await comm.on(c)
// 	return new Promise((res) => {
// 		comm.on(c)
// 	})
	
// 	let kml = comm.getStorage('sys_nav'),
// 		k = comm.nearst(c)
		
// 	if (k&&!isSame(k,this.near)) {
// 		this.near = k
// 		if (!kml[k].tr) {
// 			kml[k].tr = []
// 			let nav50 = comm.getStorage('sys_nav50')||{}
// 			for (let x in nav50) {
// 				if(dist(c, nav50[x].coord) < 12000) {
// 					kml[k].tr.push(x)
// 				}
// 			}
// 			comm.setStorage('sys_nav', kml)
// 		}
// 		return kml[k].tr
// 	}
// 	return []
// }

module.exports = {
	createEle,
	toDist,
	scan,
	on
}