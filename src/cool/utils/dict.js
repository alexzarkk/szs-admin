const dept = {
	330000: "浙江省",
	330100: "杭州市",
	330102: "上城区",
	330103: "下城区",
	330104: "江干区",
	330105: "拱墅区",
	330106: "西湖区",
	330108: "滨江区",
	330109: "萧山区",
	330110: "余杭区",
	330111: "富阳区",
	330112: "临安区",
	330113: "临平区",
	330114: "钱塘区",
	330122: "桐庐县",
	330127: "淳安县",
	330182: "建德市",
	330200: "宁波市",
	330203: "海曙区",
	330205: "江北区",
	330206: "北仑区",
	330211: "镇海区",
	330212: "鄞州区",
	330213: "奉化区",
	330225: "象山县",
	330226: "宁海县",
	330281: "余姚市",
	330282: "慈溪市",
	330300: "温州市",
	330302: "鹿城区",
	330303: "龙湾区",
	330304: "瓯海区",
	330305: "洞头区",
	330324: "永嘉县",
	330326: "平阳县",
	330327: "苍南县",
	330328: "文成县",
	330329: "泰顺县",
	330381: "瑞安市",
	330382: "乐清市",
	330383: "龙港市",
	330400: "嘉兴市",
	330402: "南湖区",
	330411: "秀洲区",
	330421: "嘉善县",
	330424: "海盐县",
	330481: "海宁市",
	330482: "平湖市",
	330483: "桐乡市",
	330500: "湖州市",
	330502: "吴兴区",
	330503: "南浔区",
	330521: "德清县",
	330522: "长兴县",
	330523: "安吉县",
	330600: "绍兴市",
	330602: "越城区",
	330603: "柯桥区",
	330604: "上虞区",
	330624: "新昌县",
	330681: "诸暨市",
	330683: "嵊州市",
	330700: "金华市",
	330702: "婺城区",
	330703: "金东区",
	330723: "武义县",
	330726: "浦江县",
	330727: "磐安县",
	330781: "兰溪市",
	330782: "义乌市",
	330783: "东阳市",
	330784: "永康市",
	330800: "衢州市",
	330802: "柯城区",
	330803: "衢江区",
	330822: "常山县",
	330824: "开化县",
	330825: "龙游县",
	330881: "江山市",
	330900: "舟山市",
	330902: "定海区",
	330903: "普陀区",
	330921: "岱山县",
	330922: "嵊泗县",
	331000: "台州市",
	331002: "椒江区",
	331003: "黄岩区",
	331004: "路桥区",
	331022: "三门县",
	331023: "天台县",
	331024: "仙居县",
	331081: "温岭市",
	331082: "临海市",
	331083: "玉环市",
	331100: "丽水市",
	331102: "莲都区",
	331121: "青田县",
	331122: "缙云县",
	331123: "遂昌县",
	331124: "松阳县",
	331125: "云和县",
	331126: "庆元县",
	331127: "景宁县",
	331181: "龙泉市"
}

const userDept = [
		{
			label: "体育局",
			value: 1
		},
		{
			label: "协会",
			value: 3
		},
		{
			label: "设计单位",
			value: 5
		},
		{
			label: "施工单位",
			value: 7
		},
		{
			label: "标牌供应商",
			value: 9
		},
		{
			label: "其它",
			value: 99
		}
]

const prop = {
	1: {
		name:'默认',
		weight: 5,
		opacity: 0.8,
		color: "#ffffff",
		lineStyle: 'dotted'
	},
	10: {
		name:'默认',
		weight: 5,
		opacity: 0.8,
		color: "#4a9cff",
		lineStyle: 'solid'
	},
	11: {
		name:'一级',
		weight: 4,
		opacity: 0.7,
		color: "#7aff79",
		lineStyle: 'solid'
	},
	12: {
		name:'二级',
		weight: 4,
		opacity: 0.7,
		color: "#ffaa55",
		lineStyle: 'solid'
	},
	13: {
		name:'三级',
		weight: 4,
		opacity: 0.7,
		color: "#ff4649",
		lineStyle: 'solid'
	},
	101: {
		name:"山林道",
		weight: 4,
		opacity: 0.6,
		color: "#00aa00",
		lineStyle: 'dashed'
	},
	102: {
		name:"防火道",
		weight: 4,
		opacity: 0.6,
		color: "#ff5500",
		lineStyle: 'dashed'
	},
	103: {
		name:"古道",
		weight: 4,
		opacity: 0.6,
		color: "#950000",
		lineStyle: 'dashed'
	},
	104: {
		name:"机耕路",
		weight: 4,
		opacity: 0.6,
		color: "#ffaa00",
		lineStyle: 'dashed'
	},
	105: {
		name:"硬化道",
		weight: 4,
		opacity: 0.6,
		color: "#747474",
		lineStyle: 'dashed'
	},
	106: {
		name:"连接道",
		weight: 4,
		opacity: 0.6,
		color: "#00ffff",
		lineStyle: 'dashed'
	},
	110: {
		name:"绿道",
		weight: 4,
		opacity: 0.6,
		color: "#55ff7f",
		lineStyle: 'dashed'
	},
	120: {
		name:"水道",
		weight: 4,
		opacity: 0.8,
		color: "#55aaff",
		lineStyle: 'dashed'
	},
	200: {
		name: '地名',
		icon: {
			iconUrl: 'https://zts.5618.co/static/icon/map/t200.png',
			iconAnchor: [12, 41],
			size: [25, 41]
		}
	},
	20: {
		name: '兴趣点',
		icon: {
			iconUrl: 'https://zts.5618.co/static/icon/map/t20.png',
			iconAnchor: [16, 38],
			size: [32, 38]
		}
	},
	21: {
		name: '入口牌',
		icon: {
			iconUrl: 'https://zts.5618.co/static/icon/map/t21.png',
			iconAnchor: [16, 35],
			size: [32, 30]
		}
	},
	22: {
		name: '主信息牌',
		icon: {
			iconUrl: 'https://zts.5618.co/static/icon/map/t22.png',
			iconAnchor: [16, 30],
			size: [32, 30]
		}
	},
	23: {
		name: '次信息牌',
		icon: {
			iconUrl: 'https://zts.5618.co/static/icon/map/t23.png',
			iconAnchor: [16, 30],
			size: [32, 30]
		}
	},
	25: {
		name: '禁止牌',
		icon: {
			iconUrl: 'https://zts.5618.co/static/icon/map/t25.png',
			iconAnchor: [12, 41],
			size: [25, 41]
		}
	},
	26: {
		name: '警告牌',
		icon: {
			iconUrl: 'https://zts.5618.co/static/icon/map/t26.png',
			iconAnchor: [12, 41],
			size: [25, 41]
		}
	},
	27: {
		name: '提示牌',
		icon: {
			iconUrl: 'https://zts.5618.co/static/icon/map/t27.png',
			iconAnchor: [12, 41],
			size: [25, 41]
		}
	},
	28: {
		name: '标距柱',
		icon: {
			iconUrl: 'https://zts.5618.co/static/icon/map/t28.png',
			iconAnchor: [16, 44],
			size: [32, 43]
		}
	},
	29: {
		name: '指引柱',
		icon: {
			iconUrl: 'https://zts.5618.co/static/icon/map/t28.png',
			iconAnchor: [16, 44],
			size: [32, 43]
		}
	},
	42: {
		name: '驿站',
		icon: {
			iconUrl: 'https://zts.5618.co/static/icon/map/t42.png',
			iconAnchor: [16, 44],
			size: [32, 43]
		}
	},
	44: {
		name: '营地',
		icon: {
			iconUrl: 'https://zts.5618.co/static/icon/map/t44.png',
			iconAnchor: [16, 44],
			size: [32, 43]
		}
	},
	40: {
		name: '服务设施',
		icon: {
			iconUrl: 'https://zts.5618.co/static/icon/map/t40.png',
			iconAnchor: [16, 44],
			size: [32, 43]
		}
	},
	50: {
		name: '照片点',
		icon: {
			iconUrl: 'https://zts.5618.co/static/icon/map/t50.png',
			iconAnchor: [16, 44],
			size: [32, 43]
		}
	},
	60: {
		name: '视频',
		icon: {
			iconUrl: 'https://zts.5618.co/static/icon/map/t60.png',
			iconAnchor: [16, 44],
			size: [32, 43]
		}
	},
	90: {
		name: '检查点',
		icon: {
			iconUrl: 'https://zts.5618.co/static/icon/map/t90.png',
			iconAnchor: [16, 44],
			size: [32, 43]
		}
	}
}


const point = [
	{
		src: '../../../static/map/t200.png',
		text: '地名',
		subText: '村庄、垭口、山峰 …',
		value: 200
	},
	{
		src: '../../../static/map/t20.png',
		text: '兴趣点',
		subText: '自然和人文景观',
		value: 20,
	},
	{
		src: '../../../static/map/t21.png',
		text: '入口牌',
		sign: true,
		subText: '主要交通入口引导',
		value: 21
	},
	{
		src: '../../../static/map/t22.png',
		text: '主信息牌',
		sign: true,
		subText: '步道简介，全景地图',
		value: 22,
	},
	{
		src: '../../../static/map/t23.png',
		text: '次信息牌',
		sign: true,
		subText: '一般信息，局部地图',
		value: 23
	},
	{
		src: '../../../static/map/t25.png',
		text: '禁止牌',
		sign: true,
		subText: '禁止相关活动（通行、用火、扎营…）',
		value: 25
	},
	{
		src: '../../../static/map/t26.png',
		text: '警示牌',
		sign: true,
		subText: '危险告知',
		value: 26
	},
	{
		src: '../../../static/map/t27.png',
		text: '提示牌',
		sign: true,
		subText: '提醒告知',
		value: 27
	},
	{
		src: '../../../static/map/t28.png',
		text: '标距柱',
		sign: true,
		subText: '距离标识',
		value: 28
	},
	{
		src: '../../../static/map/t28.png',
		text: '指引柱',
		sign: true,
		subText: '岔路方向指引',
		value: 29
	},
	{
		src: '../../../static/map/t42.png',
		text: '驿站',
		subText: '驿站',
		value: 42
	},
	{
		src: '../../../static/map/t44.png',
		text: '营地',
		subText: '营地',
		value: 44
	},
	{
		src: '../../../static/map/t27.png',
		text: '服务设施',
		subText: '停车场、公厕、补给站、饭店、农家乐 …',
		value: 40
	},
	{
		src: '../../../static/map/t50.png',
		text: '照片点',
		subText: '沿途照片',
		value: 50
	},
	{
		src: '../../../static/map/t60.png',
		text: '视频',
		subText: '沿途视频',
		value: 60
	},
	{
		src: '../../../static/map/t90.png',
		text: '检查点',
		subText: '随机检查点',
		value: 90
	}
]



const serverPoi = [
	{
		text: '停车场',
		value: 4000
	},
	{
		text: '公厕',
		value: 4002
	},
	{
		text: '驿站休息点',
		value: 4004
	},
	{
		text: '户外营地',
		value: 4006
	},
	{
		text: '农家乐',
		value: 4010
	},
	{
		text: '民宿',
		value: 4012
	},
]
const signLevel = [
	{
		text: '全新',
		subText: '全新标牌',
		value: 10
	},
	{
		text: '9成新',
		subText: '外形完整、无涂划磕碰，字迹清晰，轻微老化现象',
		value: 9
	},
	{
		text: '8成新',
		subText: '外形完整、有涂划痕迹，轻微褪色，字迹清晰',
		value: 8
	},
	{
		text: '7成新',
		subText: '外形完整、多处涂划痕迹，字迹缺损或模糊',
		value: 7
	},
	{
		text: '6成新',
		subText: '有变形、涂划磕碰，明显褪色，字迹模糊',
		value: 6
	},
	{
		text: '5成新',
		subText: '较大变形、严重涂划磕碰、字迹难辨，部件破损或缺失',
		value: 5
	}
]
const placeName = [
	{
		text: '村镇',
		value: 2000
	},
	{
		text: '山峰',
		value: 2002
	},
	{
		text: '垭口',
		value: 2004
	},
	{
		text: '林场',
		value: 2006
	},
	{
		text: '其它',
		value: 2009
	}
]
const conflict = [
	{
		name: "禁区",
		label: "经过自然保护区、军事禁区、私人领地等禁止区域",
		checked: false,
		value: 1
	},
	{
		name: "景观冲突",
		label: "墓地、垃圾填埋场、矿区采石场等景观不协调区域或已被列入上述规划的区域",
		checked: false,
		value: 2
	},
	{
		name: "收费景区",
		label: "经过收费的景区，可能引发票务纠纷的情况",
		checked: false,
		value: 3
	},
	{
		name: "安全隐患",
		label: "悬崖、泥石流隐患、穿越河流水库、高落差等安全隐患的地形地貌或高难度的施工建设路段",
		checked: false,
		value: 4
	},
	{
		name: "长距离公路",
		label: "长距离的穿越公路、机耕路（水泥路>3km,机耕路>5km）",
		checked: false,
		value: 5
	}
]
const viewElement = [
	{
		checked: false,
		text: '古村',
		value: 2010
	},
	{
		checked: false,
		text: '古道',
		value: 2012
	},
	{
		checked: false,
		text: '古桥',
		value: 2014
	},
	{
		checked: false,
		text: '古建筑',
		value: 2016
	},
	{
		checked: false,
		text: '寺庙古刹',
		value: 2020
	},
	{
		checked: false,
		text: '古树',
		value: 2030
	},
	{
		checked: false,
		text: '茶园',
		value: 2032
	},
	{
		checked: false,
		text: '竹林',
		value: 2034
	},
	{
		checked: false,
		text: '植物群落',
		value: 2036
	},
	{
		checked: false,
		text: '瀑布',
		value: 2042
	},
	{
		checked: false,
		text: '地标山峰',
		value: 2050
	},
	{
		checked: false,
		text: '悬崖',
		value: 2052
	},
	{
		checked: false,
		text: '溪谷',
		value: 2054
	},
	{
		checked: false,
		text: '风车',
		value: 2060
	},
	{
		checked: false,
		text: '观景台',
		value: 2062
	},
	{
		checked: false,
		text: '其它',
		value: 2090
	}
]
const impression = [
	{
		name: "自然风光",
		color: "green"
	},
	{
		name: "人文历史",
		color: "brown"
	},
	{
		name: "设施完善",
		color: "blue"
	},
	{
		name: "难度系数",
		color: "red"
	},
	{
		name: "强度等级",
		color: "orange"
	},
	{
		name: "遮蔽度",
		color: "green"
	}
]

const article = [
	// {label:"新闻", value:10},
	// {label:"资讯", value:20},
	// {label:"话题", value:30},
	// {label:"游记", value:40},
	// {label:"文化", value:50},
	// {label:"科普", value:60},
	// {label:"廉政", value:99},
	
	{label:"新闻", value:10 },
	{label:"资讯", value:20 },
	{label:"游记", value:40, pub:true, color:'green'},
	{label:"视频", value:35, pub:true },
	{label:"动态", value:30, pub:true, color:'blue'},
	{label:"文化", value:50 },
	{label:"科普", value:60, pub:true, color:'orange'}

]

const kmlType = [
	{ label: "环浙主线", value: 1 },
	{ label: "绘制草稿", value: 2 },
	{ label: "优化方案", value: 3 },
	{ label: "本区规划", value: 4 },
	{ label: "拟投建", value: 5 },
	{ label: "制图", value: 6 },
	
	{ label: "规划采集", value: 9 },
	
	{ label: "建设采集", value: 20 },
	{ label: "完工采集", value: 40 },
	{ label: "巡线采集", value: 80 },

	{ label: "推荐路线", value: 60 },
	{ label: "组网路线", value: 99 },
	{ label: "我的记录", value: 100 }
]

const kmlStyle = [
	{label:"登山步道", value:2},
	{label:"健走步道", value:4},
	{label:"自行车道", value:6},
	{label:"水道", value:8},
	{label:"连接道", value:9}
]
const inspect = [
		{icon:'z2012', 	value: 302, label:'路面'},
		{icon:'slope', 	value: 304, label:'坡度处理'},
		{icon:'jishui', value: 306, label:'排水系统'},
		{icon:'z210', 	value: 308, label:'河道/溪谷'},
		{icon:'cliff', 	value: 310, label:'岩壁'},
		{icon:'more', 	value: 300, label:'其他'}
	]

const trail = {
	type: [
		{label:"徒步", value:110},
		{label:"健走", value:112},
		{label:"路跑", value:114},
		{label:"定向", value:116},
		{label:"越野跑", value:118},
		{label:"登山", value:120},
		{label:"攀岩", value:122},
		{label:"露营", value:140},
		
		{label:"溯溪", value:210},
		{label:"瀑降", value:212},
		{label:"游泳", value:214},
		{label:"皮划艇", value:216},
		{label:"浆板", value:218},
		{label:"潜水", value:220},
		
		{label:"越野单车", value:310},
		{label:"公路自行车", value:313},
		{label:"山地速降", value:314},
		
		{label:"越野车", value:410},
		{label:"房车", value:412},
		{label:"越野摩托", value:414},
		{label:"全地形车", value:416},
		
		{label:"骑马", value:510},
		{label:"观鸟", value:512},
		{label:"垂钓", value:514},
		
		{label:"滑雪", value:610},
		{label:"滑冰", value:612}
	],
	tag:[
		{ text:'名山系列', value: 902 },
		{ text:'海岛系列', value: 904 },
		{ text:'森林系列', value: 906 },
		{ text:'河湖系列', value: 908 },
		{ text:'滨海系列', value: 910 },
		{ text:'田园系列', value: 912 },
		{ text:'古道系列', value: 914 },
		{ text:'体育系列', value: 916 },
		{ text:'红色系列', value: 918 }
	],
	viewElement,
	serverPoi,
	style: [ {label:"穿越", value:1}, {label:"环线", value:9} ]
}

const serveCfg = [
	{ label: '接待服务', value: 10 },
	{ label: '租赁服务', value: 12 },
	{ label: '补给服务', value: 14 },
	
	{ label: '纸质地图',	value: 30 },
	{ label: '路书', 	value: 32 },
	{ label: '医疗用品',	value: 34 },
	{ label: 'AED', 	value: 36 },
	{ label: '担架', 	value: 38 },
	
	{ label: '休憩设施',	value: 50 },
	{ label: '露营地', 	value: 52 },
	{ label: '停车场', 	value: 54 },
	{ label: '充电桩', 	value: 56 },
	{ label: '公交站', 	value: 58 },
	
	{ label: '公厕', 	value: 70 },
	{ label: '垃圾处理',	value: 72 },
	{ label: '给排水', 	value: 74 },
	{ label: '照明设施',	value: 76 },
	{ label: '通讯系统',	value: 78 },
	{ label: '充电设施',	value: 80 },
	{ label: '电子导览',	value: 82 }
]

const kmlGrade = [
	
	{label:"省级主线", value:1, type:'primary'},
	{label:"市级主线", value:3, type:'success'},
	{label:"市级支线", value:5, type:'info'},
	{label:"区县分支", value:7, type:'danger'}
	
]

const kmlSt = [
	{label: '已作废',value: -1,type:'danger'},
	{label: '待填报',value: 1,type:'info'},
	{label: '待复核',value: 2,type:'info'},
	{label: '待补充',value: 4,type:'warning'},
	{label: '待审核',value: 6,type:'primary'},
	{label: '已审核',value: 10,type:'success'},
	{label: '已存档',value: 12,type:'success'}
]
const pmSt = [
	{label: '规划中',value: 1,type:'danger'},
	{label: '已采集',value: 9,type:'info'},
	{label: '建设中',value: 20,type:'warning'},
	{label: '已完成',value: 30,type:'primary'}
]
// layout status
const laySt = [
	{label: '作废',value: -1,type:'info'},
	{label: '采集',value: 1,type:'primary'},
	{label: '初始',value: 2,type:'sucssce',plain:1},
	{label: '布局',value: 3,type:'warning',plain:1},
	{label: '排版',value: 4,type:'sucssce'},
	{label: '校对',value: 8,type:'primary',plain:1},	
	{label: '确认',value: 10,type:'warning'},
	{label: '下单',value: 12,type:'danger'},
	{label: '上传',value: 14,type:'sucssce',plain:1},
	{label: '接单',value: 16,type:'danger'},
	{label: '出厂',value: 20,type:'warning',plain:1},
	
	{label: '签收',value: 30,type:'primary',plain:1},
	{label: '审核退回',value: 32,type:'danger'},
	{label: '安装',value: 40,type:'warning'},
	{label: '审核',value: 50,type:'sucssce'}
]

//合同订单
const ctSt = [
	{label: '拟稿',value: 1,type:'info'},
	{label: '审核',value: 6,type:'primary'},
	{label: '寄出',value: 8,type:'primary'},
	{label: '签约',value: 10,type:'success'},
	{label: '预收款',value: 20,type:'warning'},
	{label: '已结算',value: 30,type:'danger'}
]
//建设实施
const ctrSt = [
	{ label: '待复核', value: 2, type: 'info' },
	{ label: '待补充', value: 4, type: 'warning' },
	{ label: '待审核', value: 6, type: 'primary' },
	{ label: '已审核', value: 10, type: 'success' },
	{ label: '建设中', value: 20, type: 'warning' },
	{ label: '已完工', value: 40, type: 'primary' },
	{ label: '已审核', value: 50, type: 'primary' },
	{ label: '已验收', value: 60, type: 'success' }
]

const poi = {
	level: [
		{ text:'自然景观', value: 1 },
		{ text:'体育健身', value: 2 },
		{ text:'文化景观', value: 3 },
		{ text:'休闲游憩', value: 4 },
		{ text:'科普教育', value: 5 },
		{ text:'地方特色', value: 6 }
	],
	1: [
		{ text:'国家级风景名胜区', value: 1000 },
		{ text:'省级风景名胜区', value: 1002 },
		{ text:'国家级自然保护区', value: 1010 },
		{ text:'省级自然保护区', value: 1012 },
		{ text:'国家级森林公园', value: 1020 },
		{ text:'省级森林公园', value: 1022 },
		{ text:'国家级湿地公园', value: 1030 },
		{ text:'省级湿地公园', value: 1032 },
		{ text:'十大名山公园', value: 1040 },
		{ text:'十大海岛公园', value: 1042 },
		{ text:'其它', value: 1099 },
	],
	2: [
		{ text:'国家级体育旅游示范基地', value: 2000 },
		{ text:'省级体育旅游示范基地', value: 2002 },
		{ text:'国家级运动休闲小镇', value: 2010 },
		{ text:'省级运动休闲小镇', value: 2012 },
		// { text:'户外营地', value: 2020 },
		{ text:'体育赛事线路', value: 2030 },
		{ text:'体育旅游精品路线', value: 2032 },
		{ text:'其它', value: 2099 }
	],
	3: [
		{ text:'历史文化名城', value: 3010 },
		{ text:'历史文化名镇', value: 3012 },
		{ text:'历史文化名村', value: 3014 },
		{ text:'历史文化街区', value: 3020 },
		{ text:'国家文物保护单位', value: 3030 },
		{ text:'省级文物保护单位', value: 3032 },
		{ text:'区县文物保护单位', value: 3034 },
		{ text:'传统村落', value: 3040 },
		{ text:'省非物质文化遗产旅游景区', value: 3050 },
		{ text:'影视基地', value: 3060 },
		{ text:'其它', value: 3099 }
	],
	4: [
		{ text:'旅游度假区', value: 4042 },
		{ text:'主题公园', value: 4044 },
		{ text:'城市公园', value: 4046 },
		{ text:'农业观光园', value: 4048 },
		{ text:'驿站休息点', value: 4004 },
		{ text:'户外营地', value: 4006 },
		{ text:'农家乐', value: 4010 },
		{ text:'民宿', value: 4012 },
		{ text:'其它', value: 4099 }
	],
	5: [
		{ text:'世界级地质公园', value: 5010 },
		{ text:'国家级地质（矿山）公园', value: 5012 },
		{ text:'省级地质公园', value: 5014 },
		{ text:'爱国主义教育基地', value: 5020 },
		{ text:'动物园', value: 5030 },
		{ text:'植物园', value: 5032 },
		{ text:'博物馆', value: 5040 },
		{ text:'科技馆', value: 5042 },
		{ text:'艺术馆', value: 5044 },
		{ text:'其它', value: 5099 }
	],
	6: [
		{ text:'特色市场', value: 6010 },
		{ text:'特色购物中心', value: 6012 },
		{ text:'各类地方特色项目', value: 6014 },
		{ text:'地方民俗节庆活动及场所', value: 6020 },
		{ text:'其它', value: 6099 }
	],
	
	st: {
		1:{text:'草稿', type:'warning'},
		2:{text:'待审核', type:'info'},
		4:{text:'待补充',type:'warning'},
		10:{text:'已审核', type:'success'},
		12:{text:'已存档', type:'success'}
	},
	
	// level: [
	// 	{ text:'核心资源', value: 1 },
	// 	{ text:'重要资源', value: 2 },
	// 	{ text:'一般资源', value: 3 },
	// 	{ text:'兴趣点', value: 4 },
	// 	{ text:'服务设施', value: 5 }
	// ],
	// 1: [
	// 	{ text:'国家公园', value: 1002 },
	// 	{ text:'国家级自然保护区', value: 1004 },
	// 	{ text:'国家级森林公园', value: 1006 },
	// 	{ text:'国家级公益林', value: 1008 },
	// 	{ text:'江河源头保护区', value: 1010 },
	// 	{ text:'国家级动物保护区', value: 1012 },
	// 	{ text:'国家级海洋保护区', value: 1014 },
	// 	{ text:'重大水源地、重要湿地', value: 1016 },
	// 	{ text:'国家级湿地公园', value: 1018 },
	// 	{ text:'国家级历史文化名城', value: 1020 },
	// 	{ text:'国家级历史文化名镇', value: 1022 },
	// 	{ text:'国家级历史文化名村', value: 1024 },
	// 	{ text:'中国传统村落', value: 1026 },
		
	// 	{ text:'中国历史文化街区', value: 1040 },
	// 	{ text:'国家级田园综合体', value: 1042 },
	// 	{ text:'5A级景区', value: 1044 },
	// 	{ text:'重要4A级景区', value: 1046 },
	// 	{ text:'国家级风景名胜区', value: 1048 },
	// 	{ text:'国家级旅游度假区', value: 1050 },
	// 	{ text:'国家级地质(矿山) 公园', value: 1052 },
	// 	{ text:'国家考古遗址公园', value: 1054 },
	// 	{ text:'全国爱国主义教育基地', value: 1056 },
	// 	{ text:'全国百个红色旅游经典景区', value: 1058 },
	// 	{ text:'国家国防教育示范基地', value: 1060 },
	// 	{ text:'国家体育旅游示范基地', value: 1062 }
	// ],
	// 2: [
	// 	{ text:'省级自然保护区', value: 2202 },
	// 	{ text:'省级海洋保护区', value: 2204 },
	// 	{ text:'省级历史文化名城', value: 2206 },
	// 	{ text:'省级历史文化名镇', value: 2208 },
	// 	{ text:'省级历史文化名村', value: 2210 },
	// 	{ text:'省级历史文化街区', value: 2212 },
	// 	{ text:'一般4A级景区', value: 2214 },
		
	// 	{ text:'省级田园综合体', value: 2220 },
	// 	{ text:'省级风景名胜区', value: 2222 },
	// 	{ text:'省级旅游度假区', value: 2224 },
	// 	{ text:'省级地质(矿山) 公园', value: 2226 },
	// 	{ text:'考古遗址公园', value: 2228 },
	// 	{ text:'体育重点项目', value: 2230 }
		
	// ],
	// 3: [
	// 	{ text:'省级历史文化名村', value: 3002 },
	// 	{ text:'3A级景区', value: 3004 },
	// 	{ text:'省级森林公园', value: 3006 },
	// 	{ text:'省级爱国主义教育基地', value: 3008 },
		
	// 	{ text:'民间文化艺术之乡', value: 3020 },
	// 	{ text:'园林城市', value: 3022 },
	// 	{ text:'生态示范区', value: 3024 },
	// 	{ text:'美丽乡村', value: 3026 },
	// 	{ text:'青少年活动基地', value: 3028 }
	// ],
	// 4: viewElement,
	// 5: serverPoi,
	// st: {
	// 	1:{text:'草稿', type:'warning'},
	// 	2:{text:'待审核', type:'info'},
	// 	4:{text:'待补充',type:'warning'},
	// 	10:{text:'已审核', type:'success'},
	// 	12:{text:'已存档', type:'success'}
	// },
	toObj: ()=>{
		let o = {}
		for (var i = 1; i <=6; i++) {
			for (let s of poi[i]) {
				o[s.value] = s
			}
		}
		return o
	}
}


function getText(n,v){
	let t = {prop,point,serverPoi,signLevel,placeName,conflict,viewElement,impression,kmlType,kmlSt,laySt,ctSt},
		o = t[n]
	for (let s of o) {
		if(s.value==v) return s
	}
}

function setOps(thiz) {
	thiz.conflict = thiz.kml.conflict || []
	thiz.element = thiz.kml.element || []
	thiz.score = thiz.kml.score && thiz.kml.score.length ? thiz.kml.score : [0, 0, 0, 0, 0, 0]
	let ckBox1 = thiz.zz.clone(conflict),
		ckBox2 = thiz.zz.clone(viewElement),
		ckBox3 = thiz.zz.clone(impression)
	for (let s of thiz.conflict) {
		for (let c of ckBox1) {
			if (s == c.value) c.checked = true
		}
	}
	for (let s of thiz.element) {
		for (let c of ckBox2) {
			if (s == c.value) c.checked = true
		}
	}
	for (var i = 0; i < ckBox3.length; i++) {
		ckBox3[i].score = thiz.score[i]
	}
	thiz.ckBox1 = ckBox1
	thiz.ckBox2 = ckBox2
	thiz.ckBox3 = ckBox3
}

function setProp(t) {
	if (t && t.length) {
		for (let parent of t) {
			// console.log('parent -------------------', parent.name)
			let pics = [ [], [] ]
			for (let child of parent.children) {
				// console.log('child -------------------', child.name)
				let pic = []
				for (let pm of child.children) {
					
					pm.imgs = uniArr(pm.imgs, '')
					for (let img of pm.imgs) {
						pic.push(img)
					}
					
					//之前保存数据的bug
					if (pm.t2 == '') pm.t2 = 200
					if (pm.t1 == 2 && pm.t2 == 10) pm.t2 = 200
					pm.prop = prop[pm.t2]
					
					if (!pm.prop) pm.prop = pm.t1 == 2? prop[20]: prop[1]
					
					if (pm.name == '') pm.name = pm.prop.name
					
					// console.log('pm.name -------------------', pm.name)
					// console.log('pm.prop -------------------',pm.t2+' - '+ pm.prop +' - ' + pm._id)
				}
				pics[child.name == '轨迹' ? 0 : 1] = pic
			}
			parent.pics = pics
		}
	}
}

function uniArr(arr, t) {
	if (typeof arr == 'object') {
		let idx = []
		arr.forEach((s, i) => {
			let count = 0
			if (s == t) {
				count++
			}
			if (count > 0) { //内层循环结束，当count>0,说明此索引为对象是重复的
				idx.push(i)
			}
		})
		let flag = -1
		for (var i = 0; i < idx.length; i++) { //删除一次，索引位
			flag++
			if (flag == 0) {
				arr.splice(idx[i], 1)
			} else {
				arr.splice(idx[i] - flag, 1) //每次删除，需要删除的索引位就要减去1
			}
		}
		return arr
	} else {
		return []
	}
}

function clone(Obj, keys) {
	var buf
	if(Obj instanceof Array){
		buf=[]
		var i = Obj.length
		while(i--){
			buf[i] = clone(Obj[i], keys)
		}
		return buf
	}
	else if(Obj instanceof Object){
		buf={}
		for(var k in Obj){
			if(keys){
				for (let kk of keys) {
					if(k==kk) {
						buf[k] = clone(Obj[k], keys)
						break
					}
				}
			}else{
				buf[k] = clone(Obj[k])
			}
		}
		return buf
	}else{
		return Obj
	}
}



const dict = {
	dept,
	userDept,
	kmlType,
	kmlStyle,
	kmlGrade,
	kmlSt,
	inspect,
	laySt,
	pmSt,
	ctSt,
	ctrSt,
	
	article,
	prop,
	point,
	poi,
	trail,
	conflict,
	viewElement,
	impression,
	placeName,
	signLevel,
	serverPoi,
	serveCfg,
	setProp,
	setOps,
	getText,
	clone
}

for (let s of trail.viewElement) {
	delete s.checked
}

// console.log('kmlType:'+ JSON.stringify(dict.kmlType) +'\n');
// console.log('kmlStyle:'+ JSON.stringify(dict.kmlStyle) +'\n');
// console.log('kmlGrade:'+ JSON.stringify(dict.kmlGrade) +'\n');
// console.log('kmlSt:'+ JSON.stringify(dict.kmlSt) +'\n');
// console.log('laySt:'+ JSON.stringify(dict.laySt) +'\n');
// console.log('pmSt:'+ JSON.stringify(dict.pmSt) +'\n');
// console.log('prop:'+ JSON.stringify(dict.prop) +'\n');
// console.log('poi:'+ JSON.stringify(dict.poi) +'\n');
// console.log('trail:'+ JSON.stringify(dict.trail) +'\n');

module.exports = dict
