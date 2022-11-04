const { async } = require("regenerator-runtime");

async function loadData() {
	
	let { deptId, region } = this.zz.getDept()
	if(!region) return setTimeout( async()=> { await loadData.call(this) }, 100) //尚未初始化
	
	let t,
		hots = [
				{ _id: '609805434c73e7000189c405', name: '奉城屋基' },
				{ _id: '6097e85c9efd500001a7766a', name: '栖霞坑环线' },
				{ _id: '60312048fac28b0001bd5a3a', name: '金峨登山步道' },
				{ _id: '602fe5e55dc5370001e716b0', name: '九峰山环线' },
				{ _id: '60312b1fedb62e0001beeeac', name: '笔架山环线' },
				{ _id: '5ebbd5f04c6c4b004c1e9af5', name: '五百岙-王家山-大岭头-山下' },
				{ _id: '5eba7e994c6c4b004c1e99b3', name: '石头岭古道' }
			],
		tStyle = [
			{label:'当季热门', value:20},
			{label:'古道探幽', value:40},
			{label:'红色教育', value:60},
			{label:'户外挑战', value:80}
		],
		regionData = [],
		hotList = [],
		tabIndex = 0
	
	await this.zz.req({$url:'public/trail/list', deptId: [deptId], status:10, type:60}).then(list=>{
		for (let s of tStyle) { s.list = [] }
		
		for (let k in region) {
			regionData.push({ tabIndex, code: region[k]._id, name: region[k].name, list:[] })
			tabIndex++
		}
		
		for (var i = 0; i < list.length; i++) {
			let s = list[i]
			for (let r of s.region) {
				regionData.find(e=>e.code==r).list.push(s)
			}
			for (let h of hots) {
				if(h._id == s._id) hotList.push(s)
			}
			for (let t of tStyle) {
				if(s.tStyle&&s.tStyle.includes(t.value)) t.list.push(s)
			}
		}
		
		t = {trailData: list, regionData, hotList, tStyle}
		uni.setStorageSync('trailData', t)
	})
	this.trailData = t
	return t
}


module.exports = {
	loadData
}
