import { async } from 'regenerator-runtime'
import { dist, isSame, getLocation } from '@/comm/geotools'
import grid from '@/comm/libs/grid'

// #ifndef APP-PLUS
import { req } from '@/comm/zz'
// #endif

// #ifdef APP-PLUS
import { api, isDev } from '@/comm/bd'
// #endif

const comm = {
	// #ifndef APP-PLUS
	req,
	// #endif
	
	// #ifdef APP-PLUS
	async req(q, cache=true) {
		let key=(k)=>{return k? JSON.stringify(k).replace(/[`~!@#$%^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g,''):''},
			fn = q.$fn,
			param = JSON.stringify(q)
		
		if(!comm.hadNet()&&cache) return comm.getStorage(key(fn+param))
		return new Promise((resolve, reject) => {
			let t, x = new plus.net.XMLHttpRequest()
			
			x.open('POST', api[isDev]+(fn||'app'), true)
			x.setRequestHeader("Content-type","application/json")
			x.setRequestHeader("authorization", comm.getStorage('210B33A_token'))
			x.setRequestHeader("clientInfo", JSON.stringify(comm.getStorage('clientInfo')))
			x.send(param)
			
			console.log('Ajax ------------------->', q)
			
			x.onreadystatechange = ()=>{
				if (x.readyState === 4) {
					let e = JSON.parse(x.responseText)
					if (x.status >= 200 && x.status < 300 || x.status == 304) {
						if(e.code==1000) {
							clearTimeout(t)
							if(e.data&&cache) {comm.setStorage(key(fn+param), e.data)}
							resolve(e.data)
						} else{
							reject(e.message)
						}
					}else{
						reject(e.error.message)
					}
				}
			}
			//超时
			t = setTimeout(()=>{
				x.abort()
				reject('timedout')
			},9999)
		})
	},
	// #endif
	
	compare(k, n=1, t=0) {
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
	// #ifdef APP-PLUS
	setStorage:(k,v)=> {
		plus.storage.setItem(k, typeof v=='object'? JSON.stringify(v):v)
	},
	getStorage:(k)=>{
		let v = plus.storage.getItem(k)
		try{ v = JSON.parse(v) }catch(e){}
		return v
	},
	hadNet(){ return plus.networkinfo.getCurrentType()>1 },
	// #endif
	
	// #ifndef APP-PLUS
	setStorage:(k,v)=> { uni.setStorageSync(k,v) },
	getStorage:(k)=>{ return uni.getStorageSync(k) },
	setNet:(e)=>{ window.hadNet = e },
	hadNet(){ return window.hadNet },
	// #endif
	
	getGrid(){
		let nav = comm.getStorage('sys_nav')
		if(!nav) {
			nav = {}
			for (let s of grid[33]) nav[s] = {}
			comm.setStorage('sys_nav', nav)
		}
		return nav
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
		let nav = comm.getGrid(),
			p = xy+zoom
		
		if (!nav[k][p] || !nav[k][p].time || (Date.now() - nav[k][p].time) > (1000*60*60*24 * 7)) {
			nav[k][p] = await comm.req({$url: 'on', $fn: 'zz', center: k, zoom, xy }) || {line:[],point:[]}
			comm.setStorage('sys_nav', nav)
		}
		return nav[k][p]
	},
	
	
	/*
	 附近柱子 根据坐标距离排序后 arr
	 c coord
	 d 距离范围
	*/
	async around(c,d=12000) {
		if(!c) {
			let { coord } = await getLocation()
			c = coord
		}
		let arr = [],
			cps = comm.getStorage('sys_nav_cps')
			
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
		// console.log('comm.around ..............', c)
		return arr.sort(comm.compare('dist'))
	},
	
	/*
	 初始化网格附近柱子
	 sys_nav_cps  = {
		 W0000:{ t2: s[1], coord: s[2] }
		 ...
	 }
	 */
	async on(c){
		if(!c) {
			let { coord } = await getLocation()
			c = coord
		}
		let k = comm.nearst(c,Number.MAX_SAFE_INTEGER),
			z = comm.getStorage('cur_loc_poi'),
			cps = comm.getStorage('sys_nav_cps')||{}
		
		if(comm.hadNet() && !isSame(k,z)) {
			comm.setStorage('cur_loc_poi',k)
			let nav = comm.getGrid()
			
			if (!nav[k].cp || (Date.now() - nav[k].cp) > (1000*60*60*24 * 7)) {
				let {time, list} = await comm.req({ $url:'cps', $fn:'zz', coord: k, d: 12000 })
				if(time) {
					nav[k].cp = time
					for (let s of list) {
						cps[s[0]] = { t2: s[1], coord: s[2] }
					}
					comm.setStorage('sys_nav', nav)
					comm.setStorage('sys_nav_cps', cps)
				}
			}
		}
		return {k,c}
	}
}

module.exports = comm
// export default comm