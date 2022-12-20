const dept = {
	list: [{ "id": 330000, "pid": 0, "name": "浙江省" }, { "id": 330100, "pid": 330000, "name": "杭州市" }, { "id": 330200, "pid": 330000, "name": "宁波市" }, { "id": 330300, "pid": 330000, "name": "温州市" }, { "id": 330400, "pid": 330000, "name": "嘉兴市" }, { "id": 330500, "pid": 330000, "name": "湖州市" }, { "id": 330600, "pid": 330000, "name": "绍兴市" }, { "id": 330700, "pid": 330000, "name": "金华市" }, { "id": 330800, "pid": 330000, "name": "衢州市" }, { "id": 330900, "pid": 330000, "name": "舟山市" }, { "id": 331000, "pid": 330000, "name": "台州市" }, { "id": 331100, "pid": 330000, "name": "丽水市" }, { "id": 330102, "pid": 330100, "name": "上城区" }, { "id": 330103, "pid": 330100, "name": "下城区" }, { "id": 330104, "pid": 330100, "name": "江干区" }, { "id": 330105, "pid": 330100, "name": "拱墅区" }, { "id": 330106, "pid": 330100, "name": "西湖区" }, { "id": 330108, "pid": 330100, "name": "滨江区" }, { "id": 330109, "pid": 330100, "name": "萧山区" }, { "id": 330110, "pid": 330100, "name": "余杭区" }, { "id": 330113, "pid": 330100, "name": "临平区" }, { "id": 330114, "pid": 330100, "name": "钱塘区" }, { "id": 330111, "pid": 330100, "name": "富阳区" }, { "id": 330112, "pid": 330100, "name": "临安区" }, { "id": 330122, "pid": 330100, "name": "桐庐县" }, { "id": 330127, "pid": 330100, "name": "淳安县" }, { "id": 330182, "pid": 330100, "name": "建德市" }, { "id": 330203, "pid": 330200, "name": "海曙区" }, { "id": 330205, "pid": 330200, "name": "江北区" }, { "id": 330206, "pid": 330200, "name": "北仑区" }, { "id": 330211, "pid": 330200, "name": "镇海区" }, { "id": 330212, "pid": 330200, "name": "鄞州区" }, { "id": 330213, "pid": 330200, "name": "奉化区" }, { "id": 330225, "pid": 330200, "name": "象山县" }, { "id": 330226, "pid": 330200, "name": "宁海县" }, { "id": 330281, "pid": 330200, "name": "余姚市" }, { "id": 330282, "pid": 330200, "name": "慈溪市" }, { "id": 330302, "pid": 330300, "name": "鹿城区" }, { "id": 330303, "pid": 330300, "name": "龙湾区" }, { "id": 330304, "pid": 330300, "name": "瓯海区" }, { "id": 330305, "pid": 330300, "name": "洞头区" }, { "id": 330324, "pid": 330300, "name": "永嘉县" }, { "id": 330326, "pid": 330300, "name": "平阳县" }, { "id": 330327, "pid": 330300, "name": "苍南县" }, { "id": 330328, "pid": 330300, "name": "文成县" }, { "id": 330329, "pid": 330300, "name": "泰顺县" }, { "id": 330381, "pid": 330300, "name": "瑞安市" }, { "id": 330382, "pid": 330300, "name": "乐清市" }, { "id": 330383, "pid": 330300, "name": "龙港市" }, { "id": 330402, "pid": 330400, "name": "南湖区" }, { "id": 330411, "pid": 330400, "name": "秀洲区" }, { "id": 330421, "pid": 330400, "name": "嘉善县" }, { "id": 330424, "pid": 330400, "name": "海盐县" }, { "id": 330481, "pid": 330400, "name": "海宁市" }, { "id": 330482, "pid": 330400, "name": "平湖市" }, { "id": 330483, "pid": 330400, "name": "桐乡市" }, { "id": 330502, "pid": 330500, "name": "吴兴区" }, { "id": 330503, "pid": 330500, "name": "南浔区" }, { "id": 330521, "pid": 330500, "name": "德清县" }, { "id": 330522, "pid": 330500, "name": "长兴县" }, { "id": 330523, "pid": 330500, "name": "安吉县" }, { "id": 330602, "pid": 330600, "name": "越城区" }, { "id": 330603, "pid": 330600, "name": "柯桥区" }, { "id": 330604, "pid": 330600, "name": "上虞区" }, { "id": 330624, "pid": 330600, "name": "新昌县" }, { "id": 330681, "pid": 330600, "name": "诸暨市" }, { "id": 330683, "pid": 330600, "name": "嵊州市" }, { "id": 330702, "pid": 330700, "name": "婺城区" }, { "id": 330703, "pid": 330700, "name": "金东区" }, { "id": 330723, "pid": 330700, "name": "武义县" }, { "id": 330726, "pid": 330700, "name": "浦江县" }, { "id": 330727, "pid": 330700, "name": "磐安县" }, { "id": 330781, "pid": 330700, "name": "兰溪市" }, { "id": 330782, "pid": 330700, "name": "义乌市" }, { "id": 330783, "pid": 330700, "name": "东阳市" }, { "id": 330784, "pid": 330700, "name": "永康市" }, { "id": 330802, "pid": 330800, "name": "柯城区" }, { "id": 330803, "pid": 330800, "name": "衢江区" }, { "id": 330822, "pid": 330800, "name": "常山县" }, { "id": 330824, "pid": 330800, "name": "开化县" }, { "id": 330825, "pid": 330800, "name": "龙游县" }, { "id": 330881, "pid": 330800, "name": "江山市" }, { "id": 330902, "pid": 330900, "name": "定海区" }, { "id": 330903, "pid": 330900, "name": "普陀区" }, { "id": 330921, "pid": 330900, "name": "岱山县" }, { "id": 330922, "pid": 330900, "name": "嵊泗县" }, { "id": 331002, "pid": 331000, "name": "椒江区" }, { "id": 331003, "pid": 331000, "name": "黄岩区" }, { "id": 331004, "pid": 331000, "name": "路桥区" }, { "id": 331022, "pid": 331000, "name": "三门县" }, { "id": 331023, "pid": 331000, "name": "天台县" }, { "id": 331024, "pid": 331000, "name": "仙居县" }, { "id": 331081, "pid": 331000, "name": "温岭市" }, { "id": 331082, "pid": 331000, "name": "临海市" }, { "id": 331083, "pid": 331000, "name": "玉环市" }, { "id": 331102, "pid": 331100, "name": "莲都区" }, { "id": 331121, "pid": 331100, "name": "青田县" }, { "id": 331122, "pid": 331100, "name": "缙云县" }, { "id": 331123, "pid": 331100, "name": "遂昌县" }, { "id": 331124, "pid": 331100, "name": "松阳县" }, { "id": 331125, "pid": 331100, "name": "云和县" }, { "id": 331126, "pid": 331100, "name": "庆元县" }, { "id": 331127, "pid": 331100, "name": "景宁畲族自治县" }, { "id": 331181, "pid": 331100, "name": "龙泉市" }],
	getLabel(id) {
		let arr = []
		for (let s of dept.list) {
			if (id && s.id == id) return s.name
			arr.push({
				value: s.id,
				label: s.name,
				type: s.pid == 0 ? 'primary' : s.pid == 330000 ? 'success' : 'info'
			})
		}
		return arr
	},
	getCids(id) {
		let arr = [id * 1]
		for (let s of dept.list) {
			if (s.pid == id) {
				arr.push(s.id)
			}
		}
		return arr
	},
	getParent(pid) {
		for (let s of dept.list) {
			if (s.id == pid) {
				return s
			}
		}
		return null
	},
	deptObj() {
		let d = {}
		for (let s of dept.list) {
			d[s.id] = s
		}
		return d
	},
	getDept(o) {
		for (let s of dept.list) {
			if (s.id == o || s.name == o) return s
		}
		return {}
	}
},
sysUser = { '1': 1, 'dc48549b80784e66b2ede934271329ca': 1, '6279b34ff19c120001991f60': 1 },
prop = {
	1: { text: '轨迹', v: 'LineString', weight: 5, opacity: 0.8, color: "#ffffff", lineStyle: 'solid' },
	2: { text: '坐标', v: 'Point' },
	3: { text: '区域', v: 'Polygon' },

	9: { text: '采集路线', width: 8, opacity: 0.3, color: '#00005f' },
	10: { text: '默认', weight: 4, opacity: 0.8, color: "#ff5500", lineStyle: 'solid' },
	11: { text: '一级', weight: 4, opacity: 0.7, color: "#aaaaff", lineStyle: 'solid' },
	12: { text: '二级', weight: 4, opacity: 0.7, color: "#ffaaff", lineStyle: 'solid' },
	13: { text: '三级', weight: 4, opacity: 0.7, color: "#ff00ff", lineStyle: 'solid' },
	101: { text: '山林道', weight: 4, opacity: 0.7, color: "#aaff7f", lineStyle: 'dashed' },
	102: { text: '防火道', weight: 4, opacity: 0.7, color: "#ffaa00", lineStyle: 'dashed' },
	103: { text: '古道', weight: 4, opacity: 0.7, color: "#ab975a", lineStyle: 'dashed' },
	104: { text: '机耕路', weight: 3, opacity: 0.5, color: "#aa5500", lineStyle: 'dashed' },
	105: { text: '硬化道', weight: 4, opacity: 0.7, color: "#bfbfbf", lineStyle: 'dashed' },
	106: { text: '连接道', weight: 4, opacity: 0.7, color: "#00ffff", lineStyle: 'dashed' },
	110: { text: '绿道', weight: 4, opacity: 0.7, color: "#55ff7f", lineStyle: 'dashed' },
	120: { text: '水道', weight: 4, opacity: 0.8, color: "#55aaff", lineStyle: 'dashed' },

	'2bl1': { text: '路网轨迹', width: 1, opacity: 0.8, blur: 0.5, color: "#3FB1CE" },
	'2bl2': { text: '路网照片' },

	20: { text: '兴趣点', icon: { iconUrl: './static/icon/map/t20.png', iconAnchor: [16, 38] } },
	21: { text: '入口牌', icon: { iconUrl: './static/icon/map/t21.png', iconAnchor: [16, 35] } },
	22: { text: '主信息牌', icon: { iconUrl: './static/icon/map/t22.png', iconAnchor: [16, 30] } },
	23: { text: '次信息牌', icon: { iconUrl: './static/icon/map/t23.png', iconAnchor: [16, 30] } },
	25: { text: '禁止牌', icon: { iconUrl: './static/icon/map/t25.png', iconAnchor: [12, 41] } },
	26: { text: '警示牌', icon: { iconUrl: './static/icon/map/t26.png', iconAnchor: [12, 41] } },
	27: { text: '提示牌', icon: { iconUrl: './static/icon/map/t27.png', iconAnchor: [12, 41] } },
	28: { text: '标距柱', icon: { iconUrl: './static/icon/map/t28.png', iconAnchor: [16, 44] } },
	29: { text: '指引柱', icon: { iconUrl: './static/icon/map/t29.png', iconAnchor: [16, 44] } },

	42: { text: '驿站', icon: { iconUrl: './static/icon/map/t42.png', iconAnchor: [16, 38] } },
	44: { text: '营地', icon: { iconUrl: './static/icon/map/t44.png', iconAnchor: [16, 38] } },
	40: { text: '服务设施', icon: { iconUrl: './static/icon/map/t40.png', iconAnchor: [16, 38] } },
	50: { text: '照片点', icon: { iconUrl: './static/icon/map/t50.png', iconAnchor: [16, 38] } },
	60: { text: '视频', icon: { iconUrl: './static/icon/map/t60.png', iconAnchor: [16, 38] } },
	90: { text: '检查点', icon: { iconUrl: './static/icon/map/t90.png', iconAnchor: [16, 38] } },
	200: { text: '地名', icon: { iconUrl: './static/icon/map/t200.png', iconAnchor: [12, 41] } }
},
point = [
	{ value: 200, src: './static/map/t200.png', text: '地名', subText: '村庄、垭口、山峰 …' },
	{ value: 20, src: './static/map/t20.png', text: '兴趣点', subText: '自然和人文景观' },
	{ value: 21, src: './static/map/t21.png', text: '入口牌', subText: '主要交通入口引导' },
	{ value: 22, src: './static/map/t22.png', text: '主信息牌', subText: '步道简介，全景地图' },
	{ value: 23, src: './static/map/t23.png', text: '次信息牌', subText: '一般信息，局部地图' },
	{ value: 25, src: './static/map/t25.png', text: '禁止牌', subText: '禁止相关活动（通行、用火、扎营…）' },
	{ value: 26, src: './static/map/t26.png', text: '警示牌', subText: '危险告知' },
	{ value: 27, src: './static/map/t27.png', text: '提示牌', subText: '提醒告知' },
	{ value: 28, src: './static/map/t28.png', text: '标距柱', subText: '距离标识' },
	{ value: 29, src: './static/map/t29.png', text: '指引柱', subText: '岔路方向指引' },
	{ value: 42, src: './static/map/t42.png', text: '驿站', subText: '驿站' },
	{ value: 44, src: './static/map/t44.png', text: '营地', subText: '营地' },
	{ value: 40, src: './static/map/t40.png', text: '服务设施', subText: '停车场、公厕、补给站、饭店、农家乐 …' },
	{ value: 50, src: './static/map/t50.png', text: '照片点', subText: '沿途照片' },
	{ value: 60, src: './static/map/t60.png', text: '视频', subText: '短视频' },
	{ value: 90, src: './static/map/t90.png', text: '检查点', subText: '随机检查点' }
],
signLevel = [
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
],
conflict = [
	{
		name: "禁区",
		label: "经过自然保护区、军事禁区、私人领地等禁止区域",
		value: 1
	},
	{
		name: "景观冲突",
		label: "墓地、垃圾填埋场、矿区采石场等景观不协调区域或已被列入上述规划的区域",
		value: 2
	},
	{
		name: "收费景区",
		label: "经过收费的景区，可能引发票务纠纷的情况",
		value: 3
	},
	{
		name: "安全隐患",
		label: "悬崖、泥石流隐患、穿越河流水库、高落差等安全隐患的地形地貌或高难度的施工建设路段",
		value: 4
	},
	{
		name: "长距离公路",
		label: "长距离的穿越公路、机耕路（水泥路>3km,机耕路>5km）",
		value: 5
	}
],
article = [  // pub :是否是app端可发布   tab:是否展示在app的 滑动tab栏当中
	{ label: "资讯", value: 10, pub: false, tab: true, color: "blue" },
	{ label: "新闻", value: 20, pub: false, tab: false, color: "cyan" },
	{ label: "游记", value: 40, pub: true, tab: true, color: 'green' },
	{ label: "视频", value: 35, pub: false, tab: true, color: "ztsblue" },   // 选择视频发布 后默认带上这个tag
	{ label: "动态", value: 30, pub: true, tab: true, color: 'yellow' },
	{ label: "文化", value: 50, pub: false, tab: true, color: "ztsgreen" },
	{ label: "科普", value: 60, pub: true, tab: true, color: 'orange' },
	// {label:"廉政", value:99},
],
kmlNet = [
	{ label: "西线", value: 1, sn: 'W' },
	{ label: "南线", value: 2, sn: 'S' },
	{ label: "东线", value: 3, sn: 'E' },
	{ label: "北线", value: 4, sn: 'N' },
	{ label: "其它", value: 9, sn: '_' }
],
kmlType = [
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
	{ label: "赛事活动", value: 62 },
	{ label: "登顶打卡", value: 64 },
	{ label: "组网路线", value: 99 },
	{ label: "我的记录", value: 100 }
],
ctrSt = [
	{ label: '待填报', value: 2, type: 'info' },
	{ label: '待补充', value: 4, type: 'warning' },
	{ label: '待审核', value: 6, type: 'primary' },
	{ label: '已审核', value: 10, type: 'success' },
	{ label: '建设中', value: 20, type: 'warning' },
	{ label: '已完工', value: 40, type: 'primary' },
	{ label: '已审核', value: 50, type: 'primary' },
	{ label: '已验收', value: 60, type: 'success' }
],
kmlGrade = [
	{ label: "省级主线", value: 1 },
	{ label: "市级主线", value: 3 },
	{ label: "市级支线", value: 5 },
	{ label: "区县分支", value: 7 }
],
kmlSt = [
	{ label: '已作废', value: -1, type: 'danger' },
	{ label: '待复核', value: 2, type: 'info' },
	{ label: '待补充', value: 4, type: 'warning' },
	{ label: '待审核', value: 6, type: 'primary' },
	{ label: '已审核', value: 10, type: 'success' },
	{ label: '已存档', value: 12, type: 'success' }
],
laySt = [
	{ label: '作废', value: -1, type: 'info' },
	{ label: '采集', value: 1, type: 'primary' },
	{ label: '初始', value: 2, type: 'sucssce', plain: 1 },
	{ label: '布局', value: 3, type: 'warning', plain: 1 },
	{ label: '排版', value: 4, type: 'sucssce' },
	{ label: '校对', value: 8, type: 'primary', plain: 1 },
	{ label: '确认', value: 10, type: 'warning' },
	{ label: '下单', value: 12, type: 'danger' },
	{ label: '上传', value: 14, type: 'sucssce', plain: 1 },
	{ label: '接单', value: 16, type: 'danger' },
	{ label: '出厂', value: 20, type: 'warning', plain: 1 },

	{ label: '签收', value: 30, type: 'primary', plain: 1 },
	{ label: '审核退回', value: 32, type: 'danger' },
	{ label: '安装', value: 40, type: 'warning' },
	{ label: '审核', value: 50, type: 'sucssce' }
],
ctSt = [
	{ label: '拟稿', value: 1, type: 'info' },
	{ label: '审核', value: 6, type: 'primary' },
	{ label: '寄出', value: 8, type: 'primary' },
	{ label: '签约', value: 10, type: 'success' },
	{ label: '预收款', value: 20, type: 'warning' },
	{ label: '已结算', value: 30, type: 'danger' }
],
commSt = [
	{ label: '已作废', value: -1, type: 'danger' },
	{ label: '草稿', value: 1, type: 'info' },
	{ label: '待复核', value: 2, type: 'info' },
	{ label: '待补充', value: 4, type: 'warning' },
	{ label: '待审核', value: 6, type: 'primary' },
	{ label: '已审核', value: 10, type: 'success' },
	{ label: '已存档', value: 12, type: 'success' },
	{ label: '精华', value: 80, type: 'success' },
	{ label: '置顶', value: 92, type: 'success' }
],
poi = {
	level: [
		{ text: '自然景观', value: 1 },
		{ text: '体育健身', value: 2 },
		{ text: '文化景观', value: 3 },
		{ text: '休闲游憩', value: 4 },
		{ text: '科普教育', value: 5 },
		{ text: '地方特色', value: 6 }
	],
	1: [
		{ text: '国家级风景名胜区', value: 1000 },
		{ text: '省级风景名胜区', value: 1002 },
		{ text: '国家级自然保护区', value: 1010 },
		{ text: '省级自然保护区', value: 1012 },
		{ text: '国家级森林公园', value: 1020 },
		{ text: '省级森林公园', value: 1022 },
		{ text: '国家级湿地公园', value: 1030 },
		{ text: '省级湿地公园', value: 1032 },
		{ text: '十大名山公园', value: 1040 },
		{ text: '十大海岛公园', value: 1042 },
		{ text: '其它', value: 1099 },
	],
	2: [
		{ text: '国家级体育旅游示范基地', value: 2000 },
		{ text: '省级体育旅游示范基地', value: 2002 },
		{ text: '国家级运动休闲小镇', value: 2010 },
		{ text: '省级运动休闲小镇', value: 2012 },
		// { text:'户外营地', value: 2020 },
		{ text: '体育赛事线路', value: 2030 },
		{ text: '体育旅游精品路线', value: 2032 },
		{ text: '其它', value: 2099 }
	],
	3: [
		{ text: '历史文化名城', value: 3010 },
		{ text: '历史文化名镇', value: 3012 },
		{ text: '历史文化名村', value: 3014 },
		{ text: '历史文化街区', value: 3020 },
		{ text: '国家文物保护单位', value: 3030 },
		{ text: '省级文物保护单位', value: 3032 },
		{ text: '区县文物保护单位', value: 3034 },
		{ text: '传统村落', value: 3040 },
		{ text: '省非物质文化遗产旅游景区', value: 3050 },
		{ text: '影视基地', value: 3060 },
		{ text: '其它', value: 3099 }
	],
	4: [
		{ text: '旅游度假区', value: 4042 },
		{ text: '主题公园', value: 4044 },
		{ text: '城市公园', value: 4046 },
		{ text: '农业观光园', value: 4048 },
		{ text: '驿站休息点', value: 4004 },
		{ text: '户外营地', value: 4006 },
		{ text: '农家乐', value: 4010 },
		{ text: '民宿', value: 4012 },
		{ text: '其它', value: 4099 }
	],
	5: [
		{ text: '世界级地质公园', value: 5010 },
		{ text: '国家级地质（矿山）公园', value: 5012 },
		{ text: '省级地质公园', value: 5014 },
		{ text: '爱国主义教育基地', value: 5020 },
		{ text: '动物园', value: 5030 },
		{ text: '植物园', value: 5032 },
		{ text: '博物馆', value: 5040 },
		{ text: '科技馆', value: 5042 },
		{ text: '艺术馆', value: 5044 },
		{ text: '其它', value: 5099 }
	],
	6: [
		{ text: '特色市场', value: 6010 },
		{ text: '特色购物中心', value: 6012 },
		{ text: '各类地方特色项目', value: 6014 },
		{ text: '地方民俗节庆活动及场所', value: 6020 },
		{ text: '其它', value: 6099 }
	]
},
serveCfg = [
	{ label: '接待服务', value: 10 },
	{ label: '租赁服务', value: 12 },
	{ label: '补给服务', value: 14 },

	{ label: '纸质地图', value: 30 },
	{ label: '路书', value: 32 },
	{ label: '医疗用品', value: 34 },
	{ label: 'AED', value: 36 },
	{ label: '担架', value: 38 },

	{ label: '休憩设施', value: 50 },
	{ label: '露营地', value: 52 },
	{ label: '停车场', value: 54 },
	{ label: '充电桩', value: 56 },
	{ label: '公交站', value: 58 },

	{ label: '公厕', value: 70 },
	{ label: '垃圾处理', value: 72 },
	{ label: '给排水', value: 74 },
	{ label: '照明设施', value: 76 },
	{ label: '通讯系统', value: 78 },
	{ label: '充电设施', value: 80 },
	{ label: '电子导览', value: 82 }
],
trail = {
	type: [
		{ label: "徒步", value: 110 },
		{ label: "健走", value: 112 },
		{ label: "路跑", value: 114 },
		{ label: "定向", value: 116 },
		{ label: "越野跑", value: 118 },
		{ label: "登山", value: 120 },
		{ label: "攀岩", value: 122 },
		{ label: "露营", value: 140 },

		{ label: "溯溪", value: 210 },
		{ label: "瀑降", value: 212 },
		{ label: "游泳", value: 214 },
		{ label: "铁人三项", value: 215 },
		{ label: "皮划艇", value: 216 },
		{ label: "浆板", value: 218 },
		{ label: "潜水", value: 220 },

		{ label: "越野单车", value: 310 },
		{ label: "公路自行车", value: 313 },
		{ label: "山地速降", value: 314 },

		{ label: "摩托车", value: 410 },
		{ label: "自驾", value: 412 },
		{ label: "越野摩托", value: 414 },
		{ label: "全地形车", value: 416 },

		{ label: "骑马", value: 510 },
		{ label: "观鸟", value: 512 },
		{ label: "垂钓", value: 514 },

		{ label: "滑雪", value: 610 },
		{ label: "滑冰", value: 612 },
		{ label: "轮滑", value: 614 }
	],
	tag: [
		{ text: '名山系列', value: 902 },
		{ text: '海岛系列', value: 904 },
		{ text: '森林系列', value: 906 },
		{ text: '河湖系列', value: 908 },
		{ text: '滨海系列', value: 910 },
		{ text: '田园系列', value: 912 },
		{ text: '古道系列', value: 914 },
		{ text: '体育系列', value: 916 },
		{ text: '红色系列', value: 918 }
	],
	element: [

		{ label: '山峰', value: 2050 },
		{ label: '垭口', value: 2051 },
		{ label: '湖泊', value: 2055 },

		{ label: '溪谷', value: 2054 },
		{ label: '瀑布', value: 2042 },
		{ label: '悬崖', value: 2052 },

		{ label: '水库', value: 2056 },
		{ label: '海岸', value: 2058 },
		{ label: '风车', value: 2060 },

		{ label: '古树', value: 2030 },
		{ label: '竹林', value: 2034 },
		{ label: '茶园', value: 2032 },

		{ label: '植物群落', value: 2036 },
		{ label: '野生动物', value: 2038 },
		{ label: '观景台', value: 2062 },

		{ label: '古村', value: 2010 },
		{ label: '古道', value: 2012 },
		{ label: '古桥', value: 2014 },
		{ label: '古建筑', value: 2016 },
		{ label: '寺庙', value: 2020 },
		{ label: '道观', value: 2022 }
	],
	serverPoi: [

		{ label: '驿站', value: 4004 },
		{ label: '停车场', value: 4000 },
		{ label: '公厕', value: 4002 },

		{ label: '营地', value: 4006 },
		{ label: '农家乐', value: 4010 },
		{ label: '民宿', value: 4012 },

		{ label: '烧烤点', value: 4014 },
		{ label: '租赁点', value: 4016 },
		{ label: '售卖部', value: 4018 },

		{ label: '庇护所', value: 4020 },
		{ label: '休息点', value: 4022 },
		{ label: '取水点', value: 4024 },

		{ label: '步道柱', value: 4040 },
		{ label: '标识牌', value: 4042 }
	],
	otherPoi: [
		{ label: '路口', value: 902 },
		{ label: '兴趣点', value: 904 },
		{ label: '危险点', value: 906 }
	],
	condition: [
		{ label: '古道石阶', color: 'brown', value: 1 },
		{ label: '原土步道', color: 'olive', value: 2 },
		{ label: '机耕路', color: 'orange', value: 3 },
		{ label: '硬化路', color: 'grey', value: 4 }
	],
	ip: [
		{ label: "自然风光", color: "green", value: 1 },
		{ label: "人文历史", color: "brown", value: 2 },
		{ label: "设施完善", color: "blue", value: 3 },
		{ label: "难度系数", color: "red", value: 4 },
		{ label: "强度等级", color: "orange", value: 5 },
		{ label: "遮蔽度", color: "green", value: 6 }
	],
	style: [{ label: "穿越", value: 1 }, { label: "环线", value: 9 }]
}

const dict = {
	dept,
	sysUser,
	prop,
	article,
	point,
	conflict,
	signLevel,
	kmlNet,
	kmlType,
	kmlGrade,
	kmlSt,


	trail,
	serveCfg,
	laySt,
	ctSt,
	ctrSt,
	poi
}
module.exports = dict