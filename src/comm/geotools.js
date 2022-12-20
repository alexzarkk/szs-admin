const
	isSame = (a,b)=>{ return (a&&b)&&(JSON.stringify(a)==JSON.stringify(b)) },
	cd2Str = (c) => { return c[0] + '_' + c[1] },
	eqCoord = (c1, c2) => { return cd2Str(c1) == cd2Str(c2) },
	math = (v, t) => { return Math.round(v * Math.pow(10, t)) / Math.pow(10, t) },
	fixNum = (n, l = 6) => { return Number(n.toFixed(l)) },
	uniqId = (s = '') => { return s + Math.random().toString(36).substr(4) },
	reArr = (a, x = 10) => {
		let _x = []
		for (var i = 0; i < a.length; i++) {
			if (i == 0 || i % x == 0 || i == a.length - 1) _x.push(a[i])
		}
		return _x
	},
	bearing = (c1, c2) => {
		const d2r = (d) => {
		    return ((d % 360) * Math.PI) / 180
		}
		const r2d = (r) => {
		    return ((r % (2 * Math.PI)) * 180) / Math.PI
		}
		let lon1 = d2r(c1[0]),
			lon2 = d2r(c2[0]),
			lat1 = d2r(c1[1]),
			lat2 = d2r(c2[1]),
			a = Math.sin(lon2 - lon1) * Math.cos(lat2),
			b = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)
		return r2d(Math.atan2(a, b))
	},
	getDist = (lng1, lat1, lng2, lat2, alt1 = 0, alt2 = 0) => {
		const getRad = deg => deg * (Math.PI / 180)
		let f = getRad((lat1 + lat2) / 2),
			g = getRad((lat1 - lat2) / 2),
			l = getRad((lng1 - lng2) / 2),
			sg = Math.sin(g),
			sl = Math.sin(l),
			sf = Math.sin(f),
			a = 6378137.0,
			fl = 1 / 298.257,
			s, c, w, r, d, h1, h2;

		sg = sg * sg;
		sl = sl * sl;
		sf = sf * sf;
		s = sg * (1 - sl) + (1 - sf) * sl;
		c = (1 - sg) * (1 - sl) + sf * sl;
		w = Math.atan(Math.sqrt(s / c));
		r = Math.sqrt(s * c) / w;
		d = 2 * w * a;
		h1 = (3 * r - 1) / 2 / c;
		h2 = (3 * r + 1) / 2 / s;
		s = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
		if (isNaN(s)) s = 0;
		if (alt1!=undefined && alt2!=undefined) {
			s = ~~Math.sqrt(Math.pow(s, 2) + Math.pow(Math.abs(alt1 - alt2), 2));
		}
		return s
	},

	dist = (c1, c2) => {
		return getDist(c1[0], c1[1], c2[0], c2[1], c1[2], c2[2])
	},
	clone = (o, x) => {
		let b
		if (o instanceof Array) {
			b = []
			let i = o.length
			while (i--) {
				b[i] = clone(o[i], x)
			}
			return b
		} else if (o instanceof Object) {
			b = {}
			for (let k in o) {
				if (x) {
					for (let kk of x) {
						if (k == kk) {
							b[k] = clone(o[k], x)
							break
						}
					}
				} else {
					b[k] = clone(o[k])
				}
			}
			return b
		} else {
			return o
		}
	},

	isArray = (v) => {
		if (typeof Array.isArray === "function") {
			return Array.isArray(v)
		} else {
			return Object.prototype.toString.call(v) === "[object Array]"
		}
	},
	purge=(v, d)=>{
		let coord = [],
			top, bottom
			
		if (v.length) {
			let c1 = v[0]
			top = c1[2]
			bottom = c1[2]
			coord.push([fixNum(c1[0], 5), fixNum(c1[1], 5), ~~c1[2]])
			for (let i = 1; i < v.length - 1; i++) {
				let c2 = v[i]
				//取最高|最低
				if (c2[2] > top) top = c2[2]
				if (c2[2] < bottom) bottom = c2[2]
				if (d) {
					//直线距离
					let _d = getDist(c1[0], c1[1], c2[0], c2[1], c1[2], c2[2])
	
					if (_d > d) {
						c1 = v[i]
						coord.push([fixNum(c1[0], 5), fixNum(c1[1], 5), ~~c1[2]])
					}
				} else {
					c1 = v[i]
					coord.push([fixNum(c1[0], 5), fixNum(c1[1], 5), ~~c1[2]])
				}
			}
			c1 = v[v.length - 1]
			coord.push([fixNum(c1[0], 5), fixNum(c1[1], 5), ~~c1[2]])
		}
		return {
			coord: d ? coord : v,
			top: math(top, 0),
			bottom: math(bottom, 0)
		}
	},
	calData = (v, chart) => {
		let dElv = [],
			top = 0, //最高
			bottom = 999, //最低
			len = 0, //长度
			flatLen = 0, //平路长度
			up = 0, //累计上升
			down = 0, //累计下降
			upLen = 0, //上升长度
			downLen = 0, //下降长度
			upSlop = 0, //上升坡度
			upAngle = 0, //上升角度
			downSlop = 0, //下降坡度
			downAngle = 0; //下降角度

		if (v && v.length) {
			let c1 = v[0],
				upDist = 0,
				downDist = 0
			
			if(!c1[2]) c1[2] = 0
			
			//取最高|最低
			if (c1[2] > top) top = c1[2]
			if (c1[2] < bottom) bottom = c1[2]

			dElv.push([0, c1[2]])
			for (let i = 1; i < v.length; i++) {
				let c2 = v[i]
				
				if(!c2[2]) c2[2] = c1[2]
				
				//取最高|最低
				if (c2[2] > top) top = c2[2]
				if (c2[2] < bottom) bottom = c2[2]

				//水平距离
				let dst = getDist(c1[0], c1[1], c2[0], c2[1])

				//斜边距离
				let _dist = dst
				if (c2[2]) _dist = Math.sqrt(Math.pow(dst, 2) + Math.pow(Math.abs(c1[2] - c2[2]), 2))

				if (c2[2] > c1[2]) {
					upDist += dst
					up += c2[2] - c1[2]
					upLen += _dist
				} else if (c2[2] < c1[2]) {
					downDist += dst
					down += c1[2] - c2[2]
					downLen += _dist
				}

				len += _dist
				dElv.push([math(len, 0), c2[2] || 0])
				c1 = v[i]
			}
			len = math(len, 0)
			top = math(top, 0)
			bottom = math(bottom, 0)
			up = math(up, 0)
			down = math(down, 0)
			upLen = math(upLen, 0)
			downLen = math(downLen, 0)

			flatLen = math(len - upLen - downLen, 0)

			upSlop = math(up / upDist * 100, 2) || 0
			downSlop = math(down / downDist * 100, 2) || 0

			upAngle = math(180 * Math.atan2(up, upLen) / Math.PI, 2) || 0
			downAngle = math(180 * Math.atan2(down, downLen) / Math.PI, 2) || 0
		}

		let info = {
			size: v.length,
			dElv,
			top,
			bottom,
			len,
			flatLen,
			up,
			down,
			upLen,
			downLen,
			upSlop,
			downSlop,
			upAngle,
			downAngle
		}
		console.log('calData ------------', info);
		//里程海拔图表
		if (!chart) delete info.dElv
		return info
	},
	geoErr = (e) => {
		// 1.PERMISSION_DENIED - 用户拒绝授权
		// 2.POSITION_UNAVAILABLE - 位置服务不可用，如系统定位服务关闭
		// 3.TIMEOUT - 定位超时，定位时超过PositionOptions.timeout设置的时间触发，此时通常可以重试
		// console.log(e);

		let m = '位置获取失败：'
		switch (e.code) {
			case 1:
				m += '请开启定位授权'
				break;
			case 2:
				m += '位置服务不可用'
				break;
			case 3:
				m += '定位超时'
				break;
			case -1505:
				m += '定位服务已关闭'
				break;
			default:
				'无网络或GPS信号'
				break;
		}
		console.error(m);
		uni.showToast({
			icon:"error",
			title:m
		})
	},

	getLocation = async (type = 'wgs84') => {
		let loc = {}
		return new Promise((res, rej) => {
			
			// e = {
			// 	"status":0,
			// 	"code":0,
			// 	"info":"SUCCESS",
			// 	"position":[121.426994,29.675487],
			// 	"location_type":"html5",
			// 	"message":"Get geolocation success .Convert Success.",
			// 	"accuracy":38.09866002522623,
			// 	"isConverted":false,
			// 	"altitude":6.052378177642822,
			// 	"altitudeAccuracy":5.624858856201172,
			// 	"heading":null,
			// 	"speed":null
			// }
			window.amapGeo.getCurrentPosition((_,e)=>{
				if(e.status==0) {
					loc.p = e
					loc.coord = trans([e.position.getLng(), e.position.getLat(), ~~(e.altitude || 0)],'gcj02towgs84')
					res(loc)
				}else{
					rej(e.message)
				}
			})
			
			// uni.getLocation({
			// 	type,
			// 	success: (e) => {
			// 		loc.p = e
			// 		loc.coord = [fixNum(e.longitude), fixNum(e.latitude), ~~(e.altitude || 0)]
			// 		res(loc)
			// 	},
			// 	fail: (e) => {
			// 		console.error('位置获取失败.fail', e)
			// 		geoErr(e)
			// 		rej(e)
			// 	}
			// })
		})
	},
	
	trans = (cds, type = 'wgs84togcj02') => {
		if (!cds || !cds.length) return null
		let cc = [],
			_pi = 3.14159265358979324 * 3000.0 / 180.0,
			pi = 3.1415926535897932384626,
			a = 6378245.0,
			ee = 0.00669342162296594323,
			tr = {
				tranLat: (lng, lat) => {
					let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(
						Math.abs(lng));
					ret += (20.0 * Math.sin(6.0 * lng * pi) + 20.0 * Math.sin(2.0 * lng * pi)) * 2.0 / 3.0;
					ret += (20.0 * Math.sin(lat * pi) + 40.0 * Math.sin(lat / 3.0 * pi)) * 2.0 / 3.0;
					ret += (160.0 * Math.sin(lat / 12.0 * pi) + 320 * Math.sin(lat * pi / 30.0)) * 2.0 / 3.0;
					return ret
				},
				tranLng: (lng, lat) => {
					let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math
						.abs(lng));
					ret += (20.0 * Math.sin(6.0 * lng * pi) + 20.0 * Math.sin(2.0 * lng * pi)) * 2.0 / 3.0;
					ret += (20.0 * Math.sin(lng * pi) + 40.0 * Math.sin(lng / 3.0 * pi)) * 2.0 / 3.0;
					ret += (150.0 * Math.sin(lng / 12.0 * pi) + 300.0 * Math.sin(lng / 30.0 * pi)) * 2.0 / 3.0;
					return ret
				},
				out_of_china: (lng, lat) => {
					// 纬度3.86~53.55,经度73.66~135.05 
					return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
				},
				bd09togcj02: (bd_lon, bd_lat) => {
					let x = bd_lon - 0.0065,
						y = bd_lat - 0.006,
						z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * _pi),
						theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * _pi),
						gg_lng = z * Math.cos(theta),
						gg_lat = z * Math.sin(theta);
	
					return [gg_lng, gg_lat]
				},
				gcj02tobd09: (lng, lat) => {
					let z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * _pi),
						theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * _pi),
						bd_lng = z * Math.cos(theta) + 0.0065,
						bd_lat = z * Math.sin(theta) + 0.006;
	
					return [bd_lng, bd_lat]
				},
				wgs84togcj02: (lng, lat) => {
					if (tr.out_of_china(lng, lat)) {
						return [lng, lat]
					} else {
						let dlat = tr.tranLat(lng - 105.0, lat - 35.0),
							dlng = tr.tranLng(lng - 105.0, lat - 35.0),
							radlat = lat / 180.0 * pi,
							magic = Math.sin(radlat);
	
						magic = 1 - ee * magic * magic;
						let sqrtmagic = Math.sqrt(magic);
						dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * pi);
						dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * pi);
	
						let mglat = lat + dlat,
							mglng = lng + dlng;
						return [mglng, mglat]
					}
				},
				gcj02towgs84: (lng, lat) => {
					if (tr.out_of_china(lng, lat)) {
						return [lng, lat]
					} else {
						let dlat = tr.tranLat(lng - 105.0, lat - 35.0),
							dlng = tr.tranLng(lng - 105.0, lat - 35.0),
							radlat = lat / 180.0 * pi,
							magic = Math.sin(radlat);
	
						magic = 1 - ee * magic * magic;
						let sqrtmagic = Math.sqrt(magic);
						dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * pi);
						dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * pi);
						let mglat = lat + dlat,
							mglng = lng + dlng;
						return [lng * 2 - mglng, lat * 2 - mglat]
					}
				}
			}
	
		//一维数组 or 二维数组
		if (isArray(cds[0])) {
			for (let i = 0; i < cds.length; i++) {
				let td = tr[type](cds[i][0], cds[i][1]),
					c = [fixNum(td[0]), fixNum(td[1]), ~~cds[i][2]]
	
				if (cds[i][3]) c.push(cds[i][3])
	
				cc.push(c)
			}
		} else {
			let td = tr[type](cds[0], cds[1])
			cc = [fixNum(td[0]), fixNum(td[1]), ~~cds[2]]
		}
		return cc
	}
	

const geotools = {
	isSame,
	cd2Str,
	eqCoord,
	math,
	fixNum,
	isArray,
	clone,
	uniqId,
	reArr,

	bearing,
	getLocation,
	geoErr,
	getDist,
	dist,

	trans,
	purge,
	calData
}

module.exports = geotools
