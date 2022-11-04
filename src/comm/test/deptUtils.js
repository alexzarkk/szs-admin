//  kmlDetails-引用
const dc_dept = [
    { id: 330000, pid: 0, name: '浙江省' },
    { id: 330100, pid: 330000, name: '杭州市' },
    { id: 330200, pid: 330000, name: '宁波市' },
    { id: 330300, pid: 330000, name: '温州市' },
    { id: 330400, pid: 330000, name: '嘉兴市' },
    { id: 330500, pid: 330000, name: '湖州市' },
    { id: 330600, pid: 330000, name: '绍兴市' },
    { id: 330700, pid: 330000, name: '金华市' },
    { id: 330800, pid: 330000, name: '衢州市' },
    { id: 330900, pid: 330000, name: '舟山市' },
    { id: 331000, pid: 330000, name: '台州市' },
    { id: 331100, pid: 330000, name: '丽水市' },
    { id: 330102, pid: 330100, name: '上城区' },
    { id: 330103, pid: 330100, name: '下城区' },
    { id: 330104, pid: 330100, name: '江干区' },
    { id: 330105, pid: 330100, name: '拱墅区' },
    { id: 330106, pid: 330100, name: '西湖区' },
    { id: 330108, pid: 330100, name: '滨江区' },
    { id: 330109, pid: 330100, name: '萧山区' },
    { id: 330110, pid: 330100, name: '余杭区' },
    { id: 330113, pid: 330100, name: '临平区' },
    { id: 330114, pid: 330100, name: '钱塘区' },
    { id: 330111, pid: 330100, name: '富阳区' },
    { id: 330112, pid: 330100, name: '临安区' },
    { id: 330122, pid: 330100, name: '桐庐县' },
    { id: 330127, pid: 330100, name: '淳安县' },
    { id: 330182, pid: 330100, name: '建德市' },
    { id: 330203, pid: 330200, name: '海曙区' },
    { id: 330205, pid: 330200, name: '江北区' },
    { id: 330206, pid: 330200, name: '北仑区' },
    { id: 330211, pid: 330200, name: '镇海区' },
    { id: 330212, pid: 330200, name: '鄞州区' },
    { id: 330213, pid: 330200, name: '奉化区' },
    { id: 330225, pid: 330200, name: '象山县' },
    { id: 330226, pid: 330200, name: '宁海县' },
    { id: 330281, pid: 330200, name: '余姚市' },
    { id: 330282, pid: 330200, name: '慈溪市' },
    { id: 330302, pid: 330300, name: '鹿城区' },
    { id: 330303, pid: 330300, name: '龙湾区' },
    { id: 330304, pid: 330300, name: '瓯海区' },
    { id: 330305, pid: 330300, name: '洞头区' },
    { id: 330324, pid: 330300, name: '永嘉县' },
    { id: 330326, pid: 330300, name: '平阳县' },
    { id: 330327, pid: 330300, name: '苍南县' },
    { id: 330328, pid: 330300, name: '文成县' },
    { id: 330329, pid: 330300, name: '泰顺县' },
    { id: 330381, pid: 330300, name: '瑞安市' },
    { id: 330382, pid: 330300, name: '乐清市' },
    { id: 330383, pid: 330300, name: '龙港市' },
    { id: 330402, pid: 330400, name: '南湖区' },
    { id: 330411, pid: 330400, name: '秀洲区' },
    { id: 330421, pid: 330400, name: '嘉善县' },
    { id: 330424, pid: 330400, name: '海盐县' },
    { id: 330481, pid: 330400, name: '海宁市' },
    { id: 330482, pid: 330400, name: '平湖市' },
    { id: 330483, pid: 330400, name: '桐乡市' },
    { id: 330502, pid: 330500, name: '吴兴区' },
    { id: 330503, pid: 330500, name: '南浔区' },
    { id: 330521, pid: 330500, name: '德清县' },
    { id: 330522, pid: 330500, name: '长兴县' },
    { id: 330523, pid: 330500, name: '安吉县' },
    { id: 330602, pid: 330600, name: '越城区' },
    { id: 330603, pid: 330600, name: '柯桥区' },
    { id: 330604, pid: 330600, name: '上虞区' },
    { id: 330624, pid: 330600, name: '新昌县' },
    { id: 330681, pid: 330600, name: '诸暨市' },
    { id: 330683, pid: 330600, name: '嵊州市' },
    { id: 330702, pid: 330700, name: '婺城区' },
    { id: 330703, pid: 330700, name: '金东区' },
    { id: 330723, pid: 330700, name: '武义县' },
    { id: 330726, pid: 330700, name: '浦江县' },
    { id: 330727, pid: 330700, name: '磐安县' },
    { id: 330781, pid: 330700, name: '兰溪市' },
    { id: 330782, pid: 330700, name: '义乌市' },
    { id: 330783, pid: 330700, name: '东阳市' },
    { id: 330784, pid: 330700, name: '永康市' },
    { id: 330802, pid: 330800, name: '柯城区' },
    { id: 330803, pid: 330800, name: '衢江区' },
    { id: 330822, pid: 330800, name: '常山县' },
    { id: 330824, pid: 330800, name: '开化县' },
    { id: 330825, pid: 330800, name: '龙游县' },
    { id: 330881, pid: 330800, name: '江山市' },
    { id: 330902, pid: 330900, name: '定海区' },
    { id: 330903, pid: 330900, name: '普陀区' },
    { id: 330921, pid: 330900, name: '岱山县' },
    { id: 330922, pid: 330900, name: '嵊泗县' },
    { id: 331002, pid: 331000, name: '椒江区' },
    { id: 331003, pid: 331000, name: '黄岩区' },
    { id: 331004, pid: 331000, name: '路桥区' },
    { id: 331022, pid: 331000, name: '三门县' },
    { id: 331023, pid: 331000, name: '天台县' },
    { id: 331024, pid: 331000, name: '仙居县' },
    { id: 331081, pid: 331000, name: '温岭市' },
    { id: 331082, pid: 331000, name: '临海市' },
    { id: 331083, pid: 331000, name: '玉环市' },
    { id: 331102, pid: 331100, name: '莲都区' },
    { id: 331121, pid: 331100, name: '青田县' },
    { id: 331122, pid: 331100, name: '缙云县' },
    { id: 331123, pid: 331100, name: '遂昌县' },
    { id: 331124, pid: 331100, name: '松阳县' },
    { id: 331125, pid: 331100, name: '云和县' },
    { id: 331126, pid: 331100, name: '庆元县' },
    { id: 331127, pid: 331100, name: '景宁畲族自治县' },
    { id: 331181, pid: 331100, name: '龙泉市' }
];
const dc_pm = {
    //轨迹类型
    kml: {
        规划路线: 1,
        推荐路线: 2,
        采集: 9
    },
    //坐标类型(
    placemark: {
        //t1
        轨迹: 1,
        坐标: 2,
        //t2
        采集轨迹: 9,
        '0级': 10,
        '1级': 11,
        '2级': 12,
        '3级': 13,
        山林道: 101,
        防火道: 102,
        古道: 103,
        机耕路: 104,
        硬化道: 105,
        连接道: 106,
        绿道: 110,
        水道: 120,
        //t2

        地名: 200,
        照片点: 20,
        入口牌: 21,
        主信息牌: 22,
        次信息牌: 23,
        禁止牌: 25,
        警告牌: 26,
        提示牌: 27,
        标距柱: 28,
        指引柱: 29
    },
    prop: {
        10: {
            weight: 5,
            opacity: 0.8,
            color: '#ffffff',
            lineStyle: 'solid'
        },
        11: {
            weight: 4,
            opacity: 0.7,
            color: '#00ff00',
            lineStyle: 'solid'
        },
        12: {
            weight: 4,
            opacity: 0.7,
            color: '#ffaa00',
            lineStyle: 'solid'
        },
        13: {
            weight: 4,
            opacity: 0.7,
            color: '#ff4800',
            lineStyle: 'solid'
        },
        101: {
            weight: 4,
            opacity: 0.6,
            color: '#00aa00',
            lineStyle: 'dashed'
        },
        102: {
            weight: 4,
            opacity: 0.6,
            color: '#ff5500',
            lineStyle: 'dashed'
        },
        103: {
            weight: 4,
            opacity: 0.6,
            color: '#950000',
            lineStyle: 'dashed'
        },
        104: {
            weight: 4,
            opacity: 0.6,
            color: '#ffaa00',
            lineStyle: 'dashed'
        },
        105: {
            weight: 4,
            opacity: 0.6,
            color: '#747474',
            lineStyle: 'dashed'
        },
        106: {
            weight: 4,
            opacity: 0.6,
            color: '#55ffff',
            lineStyle: 'dashed'
        },
        110: {
            weight: 4,
            opacity: 0.6,
            color: '#55ff7f',
            lineStyle: 'dashed'
        },
        120: {
            weight: 4,
            opacity: 0.8,
            color: '#55aaff',
            lineStyle: 'dashed'
        },

        200: { icon: { iconUrl: 'https://zts.5618.co/static/icon/map/t200.png', iconAnchor: [14, 18] } },
        20: { icon: { iconUrl: 'https://zts.5618.co/static/icon/map/t20.png', iconAnchor: [16, 38] } },
        21: { icon: { iconUrl: 'https://zts.5618.co/static/icon/map/t21.png', iconAnchor: [16, 35] } },
        22: { icon: { iconUrl: 'https://zts.5618.co/static/icon/map/t22.png', iconAnchor: [16, 30] } },
        23: { icon: { iconUrl: 'https://zts.5618.co/static/icon/map/t23.png', iconAnchor: [16, 30] } },
        25: { icon: { iconUrl: 'https://zts.5618.co/static/icon/map/t25.png', iconAnchor: [12, 41] } },
        26: { icon: { iconUrl: 'https://zts.5618.co/static/icon/map/t26.png', iconAnchor: [12, 41] } },
        27: { icon: { iconUrl: 'https://zts.5618.co/static/icon/map/t27.png', iconAnchor: [12, 41] } },
        28: { icon: { iconUrl: 'https://zts.5618.co/static/icon/map/t28.png', iconAnchor: [16, 44] } },
        29: { icon: { iconUrl: 'https://zts.5618.co/static/icon/map/t28.png', iconAnchor: [16, 44] } }
    }
};

// 通过部门id 获取
function getLable(id) {
    let arr = [];
    for (let s of dc_dept) {
        if (id && s.id == id) return s.name;
        arr.push({
            value: s.id,
            label: s.name,
            type: s.pid == 0 ? 'primary' : s.pid == 330000 ? 'success' : 'info'
        });
    }
    return arr;
}
function getCids(id) {
    let arr = [id * 1];
    for (let s of dc_dept) {
        if (s.pid == id) {
            arr.push(s.id);
        }
    }
    return arr;
}
function getDept(id) {
    for (let s of dc_dept) {
        if (s.id == id) {
            return s;
        }
    }
}
function getParent(pid) {
    for (let s of dc_dept) {
        if (s.id == pid) {
            return s;
        }
    }
}
const dict = {
    dc_dept,
    dc_pm,
    getDept,
    getParent,
    getLable,
    getCids
};

module.exports = dict;
