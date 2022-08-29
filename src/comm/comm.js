import { async } from 'regenerator-runtime'

import grid from '@/comm/libs/grid'
import { dist, getLocation } from '@/comm/geotools'

const comm = {
	key(k){return k? JSON.stringify(k).replace(/[`~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g, '') : ''},
	isSame(a,b){ return (a&&b)&&(JSON.stringify(a)==JSON.stringify(b)) },
	compare(k, n=1, t=0){
		return function (a, b) {
			if (typeof a == 'object') {
				if (n) {
					return t ? b[k] - a[k] : a[k] - b[k]
				} else {
					return t ? b[k].localeCompare(a[k], 'zh') : a[k].localeCompare(b[k], 'zh')
				}
			} else {
				return a.localeCompare(b, 'zh')
			}
		}
	},
	stopWatch(){ clearTimeout(window.wid) },
	setStorage:(k,v)=> { window.uni.setStorageSync(k, v) },
	getStorage:(k)=>{ return window.uni.getStorageSync(k) },
	
	async Ajax({u = 'app', data = {}, t = 9999 }) {
		let cloud = 'https://699d1eb1-ee53-4c66-bddd-06cda80d1231.bspapp.com/',
			api = { app: cloud + 'app', zz: cloud + 'http/zz' }
			
		console.log('ajax ------------',JSON.stringify(data))
		return new Promise((resolve, reject) => {
			let m,x
			// #ifdef APP-PLUS
			x = new plus.net.XMLHttpRequest()
			// #endif
			// #ifndef APP-PLUS
			x = window.XMLHttpRequest? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")
			// #endif
				
			x.open('POST',api[u],true)
			x.setRequestHeader("Content-type","application/x-www-form-urlencoded")
			x.setRequestHeader("appid", '__UNI__210B33A')
			x.send(JSON.stringify(data))
			x.onreadystatechange = ()=>{
				clearInterval(m)
				if (x.readyState === 4) {
					let e = JSON.parse(x.responseText)
					if (x.status >= 200 && x.status < 300 || x.status == 304) {
						if(e.code==1000) {
							// console.log('success ------------',e.data);
							if(e.data) comm.setStorage(comm.key(u+JSON.stringify(data)), e.data)
							resolve(e.data)
						} else{
							console.log('错误：', e.message);
							reject(e.message)
						}
					}else{
						console.log('request error',e.error);
						reject(e.error.message)
					}
				}
			}
			//超时
			if(t){
				m = setInterval(()=>{
					console.log('timedout!')
					x.abort()
					clearInterval(m)
				},t)
			}
		})
	},
	
	
	//最近网格 coord
	nearst(c,d=Number.MAX_SAFE_INTEGER){
		let _
		for (let c2 of grid[33]) {
			let _d = dist(c, c2)
			if (_d < d) {
				if(d<4444) return c2
				d=_d
				_=c2
			}
		}
		return _
	},
	
	//路网 {time,line,point}
	async gridNet(k,xy,zoom){
		let nav = comm.getStorage('szs_nav')
		if (!nav[k][xy+zoom] || !nav[k][xy+zoom].time || (Date.now() - nav[k][xy+zoom].time) > (1000*60*60*24 * 5)) {
			nav[k][xy+zoom] = await comm.Ajax({ u:'zz', data:{ url: 'on', center: k, zoom, xy }}) || {line:[],point:[]}
			comm.setStorage('szs_nav', nav)
		}
		return nav[k][xy+zoom]
	},
	
	//附近柱子 arr
	async around(c,d=12000) {
		if(!c) {
			let { coord } = await getLocation()
			c = coord
		}
		let arr = [],
			cps = comm.getStorage('szs_nav_cps')
		for (let k in cps) {
			let s = dist(c, cps[k].coord)
			if(s < d) {
				arr.push({
					_id: k,
					t1: 2,
					t2: cps[k].t2,
					coord: cps[k].coord,
					dist: s
				})
			}
		}
		return arr.sort(comm.compare('dist'))
	},
	
	// 初始化网格信息
	async on(c){
		let k = comm.nearst(c),
			z = comm.getStorage('cur_loc_poi'),
			cps = comm.getStorage('szs_nav_cps')||{}
		
		if(!comm.isSame(k,z)) {
			comm.setStorage('cur_loc_poi',k)
			let nav = comm.getStorage('szs_nav')
			if(!nav) {
				nav = {}
				for (let s of grid[33]) nav[s] = {}
				comm.setStorage('szs_nav', nav)
			}
			console.log(nav);
			
			if (!nav[k].cp || (Date.now() - nav[k].cp) > (1000*60*60*24 * 7)) {
				let {time, list} = await comm.Ajax({ u:'zz', data:{ url: 'cps', coord: k, d: 12000 }})

				nav[k].cp = time
				for (let s of list) {
					cps[s[0]] = { t2: s[1], coord: s[2] }
				}
				comm.setStorage('szs_nav', nav)
				comm.setStorage('szs_nav_cps', cps)
			}
		}
		return {k}
	}
}

export default comm