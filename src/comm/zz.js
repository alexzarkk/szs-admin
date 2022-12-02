// #ifdef H5-ZLB
import { mgop } from '@aligov/jssdk-mgop'
import { pathToBase64 } from '@/js_sdk/mmmm-image-tools'
// #endif

import { api, isDev, appKey, amapKey, appid } from '@/comm/bd'
import { isSame, clone, math, isArray } from '@/comm/geotools'


const
	rndInt = (a = 0, z = 4) => { return Math.floor(Math.random() * (z - a + 1)) + a },
	toArr = (o) => {
		let a = []
		for (let k in o) {
			a.push(o[k])
		}
		return a
	},

	scan = async (onlyFromCamera = true, scanType = ['qrCode']) => {
		authCemera()
		return new Promise((resolve, reject) => {
			// #ifndef APP-PLUS
			ZWJSBridge.scan({ type: "qrCode" }).then(e => { resolve(e) }).catch(e => { reject(e) })
			// #endif

			// #ifdef APP-PLUS
			uni.scanCode({
				onlyFromCamera,
				scanType,
				success(e) {
					resolve(e)
				},
				fail(e) {
					reject(e)
				}
			})
			// #endif
		})
	},
	authCemera = () => {
		// #ifdef APP-PLUS
		if (uni.getAppAuthorizeSetting().cameraAuthorized == 'denied') zz.modal("请开启手机相机权限！")
		// #endif
	},
	saveFile = async (u) => {
		// if(u.startsWith('http')) { uni.getImageInfo({ src:u, success(e){ u = e.path } }) }
		return new Promise((res, rej) => {
			uni.saveFile({
				tempFilePath: u,
				complete(v) { res(v.savedFilePath) },
				fail(d) { rej(d) }
			})
		})
	},
	removeFile = async (filePath) => {
		return new Promise((resolve, reject) => {
			if (filePath.startsWith('http')) {
				req({ $url: '/admin/app/space/info/delete', url: filePath }, true).then(e => {
					resolve(e)
				}).catch(e => {
					// reject(e)
				})
			} else {
				// #ifdef APP-PLUS
				uni.removeSavedFile({
					filePath,
					success(e) {
						resolve(e)
					},
					fail(e) {
						// reject(e)
					}
				})
				// #endif

				// #ifndef APP-PLUS
				resolve(true)
				// #endif
			}
		})
	},
	/**
	 * 上传文件
	 */
	upload = async (blob, remove) => {
		let filePath = blob.blobUri()
		// #ifdef H5-ZLB
		/* 用 http 请求上传 */
		let base64 = [],
			f = await pathToBase64(filePath)

		const put = (s, n = 900000) => {
			if (s.length > n) {
				base64.push(s.substring(0, n))
				put(s.substring(n, s.length))
			} else {
				base64.push(s)
			}
		}
		put(f.split(',')[1])

		let file = {
			id: Date.now() + '',
			sn: 1,
			size: base64.length,
			cloudPath: uni.getStorageSync(filePath)
		}
		for (let s of base64) {
			let e = await zz.req({ $fn: 'sync' + rndInt(), $url: '/admin/comm/upload', dataUrl: s, ...file })
			if (e) {
				file.url = e.fileID
				if (remove) uni.removeStorageSync(filePath)
			}
			file.sn++
		}

		return new Promise((resolve, reject) => {
			file.url ? resolve(file.url) : reject(false)
		})
		// #endif

		// #ifndef H5-ZLB
		return new Promise((resolve, reject) => {
			uniCloud.uploadFile({
				filePath,
				cloudPath: filePath.startsWith('blob') ? fileName : 'szs_' + filePath.replace('_doc/uniapp_save/', ''),
				onUploadProgress(progressEvent) {
					// let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
				},
				success(e) {
					if (remove) removeFile(filePath)
					if (filePath.startsWith('blob')) uni.removeStorageSync(filePath)
					resolve(e.fileID)
				},
				fail(err) {
					console.error(filePath, "文件上传失败===", err)
					reject(false)
				}
			})
		})
		// #endif
	},
	chooseImage = async ({ sourceType = ['album', 'camera'], sizeType = ['compressed'], count = 1 }, save = false) => {

		const [_, e] = await uni.chooseImage({ sourceType, sizeType, count })
		if (e) {
			uni.showLoading({ mask: true })
			for (let i = 0; i < e.tempFilePaths.length; i++) {
				// #ifdef APP-PLUS
				e.tempFilePaths[i] = await saveFile(e.tempFilePaths[i])
				// #endif

				// #ifndef APP-PLUS
				uni.setStorageSync(e.tempFilePaths[i], e.tempFiles[i].name)
				// #endif

				if (save) e.tempFilePaths[i] = await upload(e.tempFilePaths[i])
			}
			uni.hideLoading()

			return e.tempFilePaths
		} else {
			authCemera()
		}
	},
	chooseVideo = async ({ sourceType = ['camera'], compressed = false, camera = 'back', maxDuration = 10 }, save = false) => {
		compressed = uni.getSystemInfoSync().platform == 'ios'

		// #ifndef APP-PLUS
		// save = true
		// #endif

		const [_, e] = await uni.chooseVideo({ sourceType, compressed, camera, maxDuration })
		if (e) {
			uni.showLoading({ mask: true })
			e.tempFilePath = await saveFile(e.tempFilePath)
			if (save) e.tempFilePath = await upload(e.tempFilePath)

			delete e.errMsg
			uni.hideLoading()
			return e
		} else {
			authCemera()
		}
	},
	/**
	 * time:
	 * fmt:格式化以后
	 * utc:
	 */
	time2Date = (time, fmt, utc = 0) => {
		if (!time) time = Date.now() + 1000 * 60 * 60 * utc
		if (typeof time == 'string') time = date2Time(time)
		let n = new Date()
		n.setTime(time)

		let y = n.getFullYear(),
			m = n.getMonth() + 1,
			d = n.getDate(),
			hh = n.getHours(),
			mm = n.getMinutes(),
			ss = n.getSeconds();

		m = m < 10 ? '0' + m : m;
		d = d < 10 ? '0' + d : d;
		hh = hh < 10 ? '0' + hh : hh;
		mm = mm < 10 ? '0' + mm : mm;
		ss = ss < 10 ? '0' + ss : ss;

		if (!fmt) return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
		if (fmt == 'Y-M-D h:m') return y + '-' + m + '-' + d + ' ' + hh + ':' + mm;
		if (fmt == 'Y-M-D h:m:s') return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
		if (fmt == 'M-D h:m') return m + '-' + d + ' ' + hh + ':' + mm;
		if (fmt == 'Y-M-D') return y + '-' + m + '-' + d;
		if (fmt == 'YMD') return y + '' + m + '' + d;
		if (fmt == 'YM') return y + '' + m;
		if (fmt == 'Y') return y;
		if (fmt == 'M') return m;
		if (fmt == 'D') return d;
		if (fmt == 'h:m') return hh + ':' + mm;
		if (fmt == 'h') return hh;
		if (fmt == 'm') return mm
		if (fmt === 'obj') {
			return {
				year: y,
				month: m,
				day: d,
				time: `${hh}:${mm}:${ss}`
			}
		}
		if (fmt == 'CN-ymd') {
			return y + '年' + m + '月' + d + '日'
		}
		if (fmt == 'CN-ymd h:m') {
			return y + '年' + m + '月' + d + '日' + hh + ':' + mm
		}

		if (fmt == 'CN') return y + '年' + m + '月' + d + '日' + ' ' + hh + ':' + mm + ':' + ss + ' ' +
			'星期' + ['日', '一', '二', '三', '四', '五', '六'][n.getDay()];

		return n.getTime()
	},

	date2Time = (d, g = 0) => {
		if (d.length == 10) d += ' 00:00';
		if (d.length == 16) d += ':00';
		let e = d.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/),
			x = () => {
				console.error('时间格式错误=============', d)
				return false
			},
			y, m, n, h, i, s;

		if (!e) {
			return x()
		} else {
			y = Number(e[1])
			m = Number(e[2])
			n = Number(e[3])
			h = Number(e[4])
			i = Number(e[5])
			s = Number(e[6])
		}
		if (y < 1000 || h < 0 || h > 24 || i < 0 || i > 60 || s < 0 || s > 60) return x()
		return Date.parse(new Date(y, m - 1, n, h, i, s)) + 1000 * 60 * 60 * g
	},
	timeFrom = (time = null, format = 'yyyy-mm-dd') => {
		if (typeof time == 'string') time = date2Time(time)
		// 如果为null,则格式化当前时间
		if (!time) time = Number(new Date());
		// 如果time长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
		if (time.toString().length == 10) time *= 1000;
		let timestamp = + new Date(Number(time));

		let timer = (Number(new Date()) - timestamp) / 1000;
		// 如果小于5分钟,则返回"刚刚",其他以此类推
		let tips = '';
		switch (true) {
			case timer < 300:
				tips = '刚刚';
				break;
			case timer >= 300 && timer < 3600:
				tips = parseInt(timer / 60) + '分钟前';
				break;
			case timer >= 3600 && timer < 86400:
				tips = parseInt(timer / 3600) + '小时前';
				break;
			case timer >= 86400 && timer < 2592000:
				tips = parseInt(timer / 86400) + '天前';
				break;
			default:
				// 如果format为false，则无论什么时间戳，都显示xx之前
				if (format === false) {
					if (timer >= 2592000 && timer < 365 * 86400) {
						tips = parseInt(timer / (86400 * 30)) + '个月前';
					} else {
						tips = parseInt(timer / (86400 * 365)) + '年前';
					}
				} else {
					// console.log("默认显示,年月日的方式")
					tips = time2Date(timestamp, 'Y-M-D h:m:s')
				}
		}
		return tips;
	},
	formatDuring = (ms, cn) => {
		let D = parseInt(ms / (1000 * 60 * 60 * 24)),
			H = parseInt((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
			M = parseInt((ms % (1000 * 60 * 60)) / (1000 * 60)),
			S = parseInt((ms % (1000 * 60)) / 1000)

		return cn ? (D > 0 ? '天' : '') + (H > 9 ? H : '0' + H) + '小时' + (M > 9 ? M : '0' + M) + '分' + (S > 9 ? S : '0' + S) + '秒' : (H > 9 ? H : '0' + H) + ':' + (M > 9 ? M : '0' + M) + ':' + (S > 9 ? S : '0' + S)
	},
	deepTree = (list) => {
		let newList = [],
			map = {}

		list.forEach(e => {
			map[e._id] = e
		})
		list.forEach(e => {
			let parent = map[e.pid]
			if (parent) {
				(parent.children || (parent.children = [])).push(e)
			} else {
				if (!e.pid) {
					newList.push(e)
				}
			}
		})
		const fn = (list) => {
			list.map(e => {
				if (e.children instanceof Array) {
					e.children.sort(zz.compare('createTime'))
					fn(e.children)
				}
			});
		};
		fn(newList)
		return newList.sort(zz.compare('createTime'))
	},
	revDeepTree = (list = []) => {
		let d = []
		const deep = (list) => {
			list.forEach(e => {
				d.push(e)
				if (e.children && isArray(e.children)) {
					deep(e.children)
				}
			})
		}
		deep(list || [])
		return d
	},

	/**
	 * @param {Object} k 键值
	 * @param {Object} n 是否数字
	 * @param {Object} t 是否倒序
	 */
	compare = (k, n = 1, t = 0) => {
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

	/**
	 * @param {Object} url 带参链接
	 * @param {Object} key 取特定字段值 
	 * @return Object || Object[key]
	 */
	getQueryParam = (url, k) => {
		let u = url.split('?')
		if (u.length == 1) return ''
		let arr = u[1].split('&'),
			o = { url: u[0] }

		for (let v of arr) {
			let s = v.split('=')
			o[s[0]] = s[1]
		}

		if (k) return o[k]
		return o
	},

	reGeo = async (loc) => {
		return new Promise((resolve, reject) => {
			uni.request({
				url: 'https://restapi.amap.com/v3/geocode/regeo?key=' + amapKey + '&s=rsv3&language=zh_cn&location=' + loc,
				success(e) {
					resolve(e.data.regeocode)
				},
				fail(e) {
					reject(e)
				}
			})
		})
	},
	weatherInfo = async (code, ex = 'all') => {
		return new Promise((resolve, reject) => {
			uni.request({
				url: 'https://restapi.amap.com/v3/weather/weatherInfo?s=rsv3&city=' + code + '&extensions=' + ex + '&key=' + amapKey,
				success(e) {
					resolve(e.data)
				},
				fail(e) {
					reject(e)
				}
			})
		})
	}


/**
 * 请求数据处理
 * @param {url,fn,veri, *} args 请求地址,请求参数
 * @param boolean loading 是否显示loading
 * @param boolean veri 是否验证登录
 * return data
 */
async function req(params = {}, loading = false, t = 9999) {
	let tim,
		fn = params.$fn || 'admin',
		veri = params.$veri || false,
		url = params.$url,
		token = zz.getToken(),
		// net = zz.hadNet(),
		toLogin = () => {
			uni.redirectTo({url: "/pages/index/index"})
		}

	delete params.$fn
	delete params.$veri

	if (veri && !token) {
		zz.modal('您尚未登录，请授权登录！', (e) => {
			toLogin()
		}, true)
	}
	console.info("requestPrams ===========", params, api[isDev] + fn)

	// if (net) {
		if (loading) uni.showLoading({ mask: true })
		return new Promise((resolve, reject) => {
			tim = setTimeout(() => { reject('timedout') }, 9999)
			const success = (e) => {
				if (loading) uni.hideLoading()
				clearTimeout(tim)
				const { code, data, message } = e.data || e.result
				switch (code) {
					// 成功
					case 1000:
						if (data) uni.setStorage(zz.key(fn + url + JSON.stringify(params)), data)
						resolve(data)
						break
					// 登录失效
					case 1002:
						zz.logOut()
						zz.toast(message)
						// reject()
						return toLogin()
						break
					// 失败
					default:
						zz.toast(message)
						reject(e.data || e.result)
				}
			},
				fail = (e) => {
					if (loading) uni.hideLoading()
					// zz.toast(e.message || e.data.message)
					params.$fn = fn
					params.$url = url
					reject(e.message || e.data.message || '服务器错误！')
				},
				complete = (e) => {
					params.$fn = fn
					params.$url = url
					// clearTimeout(tim)
					// console.log(e);
				}

			// #ifdef H5-ZLB

			// console.log("请求的内容",)
			// console.log("当前isDev------------", isDev)
			let header = {
				// isTestUrl: isDev + '',
				authorization: token,
				clientinfo: JSON.stringify(uni.getStorageSync('clientInfo'))
			}

			if (isDev) {
				header.isTestUrl = 1
			}
			// console.log('header================================', header);
			mgop({
				api: 'mgop.zz.zts.' + fn, // 必填
				host: 'https://mapi.zjzwfw.gov.cn/',
				dataType: 'JSON',
				type: 'POST',
				appKey,
				header,
				data: params,
				onSuccess: success,
				onFail: fail
			});
			// #endif

			// #ifndef H5-ZLB
			// uni.request({
			// 	url: api[isDev] + fn,
			// 	timeout: 10000,
			// 	header: {
			// 		'content-type': 'application/json',
			// 		authorization: token,
			// 		clientinfo: JSON.stringify(uni.getStorageSync('clientInfo'))
			// 	},
			// 	data: params,
			// 	method: 'POST',
			// 	success,
			// 	fail,
			// 	complete
			// })
			delete params.$url
			uniCloud.callFunction({
				name: fn,
				data: { url, params, token },
				success,
				fail,
				complete
			})
			// #endif
		})
	// } else {
	// 	let data = uni.getStorageSync(zz.key(fn + url + JSON.stringify(params)))
	// 	if (!data) zz.toast("请求失败，没有网络！")
	// 	return data
	// }
}

/*
   {
	   uid: 		用户id
	   ctime: 		生成时间
	   t:	(eventType)		事件类型		10.登录		20.游览|阅读		30.点赞	  40.收藏	50.分享(海报)	
	   tt	(targetType)	目标类型		2.评论(blog)	10.文章(article) 20.兴趣点()poi	30.商品(goods)	40.路线(trail) 42.记录的轨迹(rec)	50.赛事活动(event)  
		60.用户（user） 70.动态/帖子moment 100.kml	... 
	   tid:(targetId)		目标id			tt的 _id
	   o:{  对象
		_id || id,
		...
	   }
   }
   t: 事件类型
   20, 30, {...}
*/


// 未登录提示去登录


const zz = {
	rndInt,
	math,
	isSame,
	clone,
	toArr,
	isDev,
	isArray,

	deepTree,
	revDeepTree,

	getQueryParam,
	compare,

	time2Date,
	date2Time,
	timeFrom,
	formatDuring,


	req,
	reGeo,
	weatherInfo,

	scan,
	saveFile,
	removeFile,
	upload,
	chooseImage,
	chooseVideo,

	key(k) { return k ? JSON.stringify(k).replace(/[`~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g, '') : '' },
	// #ifdef APP-PLUS
	hadNet() { return plus.networkinfo.getCurrentType() > 1 },
	// #endif

	// #ifndef APP-PLUS
	hadNet() { return window.hadNet || true },
	// #endif

	now() { return Date.now() },
	setAcc(u) {
		uni.setStorageSync('userInfo', u)
	},
	getAcc() { return uni.getStorageSync('userInfo') },
	setToken(tk) {
		uni.setStorageSync('token', tk)
	},
	getToken() { return uni.getStorageSync('token') },
	logOut() {
		uni.removeStorageSync('userInfo')
		uni.removeStorageSync('token')
	},
	async setDept() {
		let { deptId, dept } = this.getDept()
		if (!dept[deptId]) {
			dept[deptId] = await req({ $url: 'public/zz/depts', pid: deptId })
			uni.setStorageSync('sys_dept', dept)
		}
	},
	getDept(arr) {
		let id = uni.getStorageSync('cur_deptId'),
			dept = uni.getStorageSync('sys_dept') || {}
		return { deptId: id, dept, region: arr ? toArr(dept[id]) : dept[id] }
	},

	viewIMG(urls, i = 0) {
		uni.previewImage({
			current: urls[i],
			urls
		})
	},
	toast(title = '出错啦~', duration = 3000, icon = 'none') {
		uni.showToast({
			title,
			icon,
			duration
		})
	},
	modal(content, fn, showCancel = false, title = '提示', confirmColor = '#5677fc', confirmText = '确定') {
		uni.showModal({
			title,
			content,
			showCancel,
			cancelColor: '#555',
			confirmColor,
			confirmText,
			success(res) {
				if (res.confirm) {
					fn && fn(true)
				} else {
					fn && fn(false)
				}
			}
		})
	},
	// #ifdef H5-ZLB
	// 浙里办PV 埋点  跳转页面埋点
	sendZlbPV() {
		const sdk = window.ZWJSBridge
		const getLocation = sdk.getLocation()
		const getUserType = sdk.getUserType()

		Promise.all([getUserType, getLocation]).then(([userTypeData, locationData]) => {
			// console.log("定位和用户类型-------", userTypeData, locationData)
			const { userType } = userTypeData
			const { longitude, latitude } = locationData
			const params = {
				action: 'aplus.sendPV',
				arguments: [
					{
						is_auto: false
					},
					{
						miniAppId: appid,
						miniAppName: '环浙步道',
						long: longitude,
						lati: latitude,
						userType
					}
				]
			}
			// console.log("浙里办PV埋点-------", params)
			window.aplus_queue.push(params)
		})
	},
	// #endif

	/**
	 * 
	 * @param {*} url 跳转页面 路径
	 * @param {*} veri   是否需要登录校验
	 * @param {*} animationType  跳转使用的动画
	 * @returns 
	 */
	href(url, v, veri, animationType, t = 'navigateTo') {
		if (url.startsWith('/pages/index')) return uni.switchTab({ url })

		if (v) {
			url += '?v=' + encodeURI(JSON.stringify(v))
		}

		if (veri && !zz.getAcc()) {
			zz.modal(
				'尚未登录，点击确定去登录',
				(e) => {
					if (e) zz.href('/pages/comm/account/login', { back: 1 })
				},
				true
			)
		} else {
			uni[t]({
				url,
				animationType,
				success: (res) => {
					// #ifdef H5-ZLB
					// console.log("页面跳转完成---------------------------", res)
					// 添加pv埋点
					zz.sendZlbPV()
					// #endif
				},
				fail: (err) => {
					console.error('路由跳转失败===', err)
				}
			})
		}
	},
	openWin({url,id,w=1400,h=1000}) {
		let _,dPR=window.devicePixelRatio;if(!dPR)dPR=1
		window.open(url+(id?'?id='+id:''),"_blank","left="+((screen.width-w)/2)+",height="+h*dPR+",width="+w*dPR+",top=1,center=1,resizable=1,toolbar=no, location=no, directories=no, status=no, menubar=no,channelmode=no");
	},
	profile(id) {
		let d = uni.getStorageSync('sys_dict')
		this.href(`/pages/my/profile/${d.sysUser[id] ? 'sysProfile' : 'profile'}?id=${id}`)
	},
	getParam(v) { return JSON.parse(decodeURI(v)) },
	toObj(a){
		let o = {}
		for (let s of a) { o[s.value] = s }
		return o
	}
}

module.exports = zz