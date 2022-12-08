const tj = require('@tmcw/togeojson')
const DOMParser = require('xmldom').DOMParser
import { purge, fixNum } from "@/comm/geotools"
import { time2Date } from "@/comm/zz"

/**
 * KML文件上传时处理
 * @param {Object} file
 * return geojosn
 */
async function kml2Geo(file){
	// 读取文件名
	const name = file.name
	// 读取文件大小
	const size = file.size
	// FileReader对象，h5提供的异步api，可以读取文件中的数据。
	const reader = new FileReader()
	// readAsText是个异步操作，只有等到onload时才能显示数据。
	reader.readAsText(file, 'utf8')
	let placemark
	return new Promise((resolve, reject) => {
		reader.onload = function () {
			const kml = new DOMParser().parseFromString(this.result, 'utf8')
			let geojson = tj.kml(kml, { styles: true })
			handleGeojson(geojson)
			placemark = geo2Placemark(geojson)
			resolve({placemark, geojson})
		}
	})
}


function handleGeojson(gj, tns) {
	
	const getImgs = (desc) => {
		let str = desc.split('<a href="')
		let imgs = []
		for (var i = 1; i < str.length; i++) {
			let s = str[i]
			imgs.push(s.split('.jpg"')[0]+'.jpg')
		}
		return imgs
	}
	const getTime = desc => {
		let str = desc.split('时间: ')
		return str.length>1? str[1].replace(/\<\/div\>/,'') : time2Date()
	}
	
	let point = 0, line = 0
	for (let s of gj.features) {
		if(s.geometry){
			
			if(s.geometry.geometries) {
				for (let x of s.geometry.geometries) {
					if(x.type === "Point") {
						 point ++
						 let e = x.coordinates
						 x.coordinates = [fixNum(e[0]), fixNum(e[1]), ~~e[2]]
					}
					if(x.type === "LineString") {
						line ++
						let {coord} = purge(x.coordinates, 6)
						x.coordinates = coord
					}
				}
			}
			
			if(s.geometry.type === "Point") {
				 point ++
				 let e = s.geometry.coordinates
				 s.geometry.coordinates = [fixNum(e[0]), fixNum(e[1]), ~~e[2]]
			}
			if(s.geometry.type === "LineString") {
				line ++
				let {coord} = purge(s.geometry.coordinates, 12)
				s.geometry.coordinates = coord
				// s.geometry.coordinates.map(e => [fixNum(e[0]), fixNum(e[1]), ~~e[2]])
			}
			s.properties = {
				name: s.properties.name || '未命名' ,
				imgs: [],
				time: getTime(s.properties.description || ''),
				// icon: s.properties.icon || ''
			}
			if(line>=100||point>=800){
				alert('单个kml文件最多允许100条轨迹或800个坐标！（超出请分段导入）')
				break
			}
		}
	}
	gj.point = point
	gj.line = line
}

function geo2Placemark(geo){
	let pm = []
	for (let e of geo.features) {
		if(e.geometry) {
			if(e.geometry.geometries) {
				for (let x of e.geometry.geometries) {
					pm.push({
						t1: x.type == 'Point'?2:1,
						t2: x.type == 'Point'?200:10,
						coord: x.coordinates,
						name: e.properties.name,
						imgs: e.properties.imgs,
						curTime: e.properties.time
					})
				}
			} else {
				pm.push({
					t1: e.geometry.type == 'Point'?2:1,
					t2: e.geometry.type == 'Point'?200:10,
					coord: e.geometry.coordinates,
					name: e.properties.name,
					imgs: e.properties.imgs,
					curTime: e.properties.time
				})
			}
		}
	}
	return pm
}


module.exports = {kml2Geo}
