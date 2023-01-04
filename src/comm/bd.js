//BasicData
const bd = {
	isDev: 1, //是否开发  0:正式环境  1：测试环境
	api: ['https://ztsapi.5618.co/', 'https://dev.5618.co/'],
	ZLB_ADDR: [
		'https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2002281722/lastTest/index.html',  // 正式地址
		// 'https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2002281722/1.0.1/index.html?debug=true', //irs线上调试
		'https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2002281722/1.0.1/index.html?debug=true', //irs线上调试
		// 'https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2002281722/lastTest/index.html',  // 正式地址
		// 'http://localhost:8080/h5/', //政务中台调试
	],
	/* 浙里办资料 */
	/**
	 * 
	 * servicecode等同于AccessKey（简称AK），servicepwd等同于SecretKey（简称SK）
	 */
	appid: '2002281722',
	appKey: '4kzz5t3t+2002281722+mzaaot', // 浙里办
	SecretKey: 'BCDSGS_0f05ec12aa9be2b107edb2a07e66ae45',	//servicepwd
	AccessKey: 'BCDSGA_7d4388d47d989fef0eb063d9e63c0c53',	//servicecode

	/* 高德 */
	amapKey: 'daffb83c14428939221e09ebc785c89c',

	sys: {
		
		// #ifdef H5-ZLB
		name: "环浙步道服务应用管理端",
		copyright: '浙江省体育局、宁波市奉化区文化和广电旅游体育局',
		tel: '0574-88517465',
		// #endif
		
		// #ifndef H5-ZLB
		name: "环浙步道数字平台",
		copyright: "© 2021-至今 浙江体育科学研究所（浙江省反兴奋剂中心）",
		tel: '0574-88517758',
		// #endif
		
		desc: "运动浙江 户外天堂",
		code: '330213',
		admin: '宁波之之步道技术有限公司',
		png: 'https://zts.5618.co/static/png/',
		logo: "https://zts.5618.co/repo/logoIcon.png"
	},
	imgs: {
		nodata: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-699d1eb1-ee53-4c66-bddd-06cda80d1231/687b11af-e7e2-4cef-80d8-b3e1744dd101.png',
		success: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/9f4e8750-a71f-11ea-8bd0-2998ac5bbf7e.png',
		bg: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-fhsport/3d2a37d0-5fad-11eb-b997-9918a5dda011.png'
	}
}

module.exports = bd
