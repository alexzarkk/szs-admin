const prop = {
	1: 	{text: '轨迹', v:'LineString', width: 2,opacity: 0.7,color: "#880000"},
	2: 	{text: '坐标', v:'Point'},
	3: 	{text: '区域', v:'Polygon'},
	
	9:  {text: '采集路线', width: 10, opacity: 0.3, color: '#00005f', dottedLine:true},
	10: {text: '默认', width: 4,opacity: 0.8,color: "#ff5500"},
	11: {text: '一级', width: 4,opacity: 0.7,color: "#aaaaff"},
	12: {text: '二级', width: 4,opacity: 0.7,color: "#ffaaff"},
	13: {text: '三级', width: 4,opacity: 0.7,color: "#ff00ff"},
	101: {text: '山林道', width: 4,opacity: 0.7,color: "#aaff7f"},
	102: {text: '防火道', width: 4,opacity: 0.7,color: "#ffaa00"},
	103: {text: '古道', width: 4,opacity: 0.7,color: "#950000"},
	104: {text: '机耕路', width: 3,opacity: 0.5,color: "#aa5500"},
	105: {text: '硬化道', width: 4,opacity: 0.7,color: "#000000"},
	106: {text: '连接道', width: 4,opacity: 0.7,color: "#00ffff"},
	110: {text: '绿道', width: 4,opacity: 0.7,color: "#55ff7f"},
	120: {text: '水道', width: 4,opacity: 0.8,color: "#55aaff"},
	
	20: {text: '兴趣点'},
	21: {text: '入口牌'},
	22: {text: '主信息牌'},
	23: {text: '次信息牌'},
	25: {text: '禁止牌'},
	26: {text: '警示牌'},
	27: {text: '提示牌'},
	28: {text: '标距柱'},
	29: {text: '指引柱'},
	40: {text: '服务设施'},
	42: {text: '驿站'},
	44: {text: '营地'},
	50: {text: '照片点'},
	60: {text: '视频'},
	90: {text: '检查点'},
	200:{text: '地名'},
	grade: {
		1: {
			text:"省级",
			width: 2,
			opacity: 0.7,
			color: "#dc4900"
		},
		3: {
			text:'市级',
			width: 1.6,
			opacity: 0.7,
			color: "#ffaa00"
		},
		5: {
			text:'区县',
			width: 1.4,
			opacity: 0.7,
			color: "#00aaff"
		},
		7: {
			text:'支线',
			width: 1.4,
			opacity: 0.7,
			color: "#dde5ff"
		}
	},
	
	'2bl1': {text: '路网轨迹', width: 1,opacity: 0.8,blur:0.5, color: "#3FB1CE", on:'#00ffff'},
	'2bl2': {text: '路网照片'}
}

module.exports = prop