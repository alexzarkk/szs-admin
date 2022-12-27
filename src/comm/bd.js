//BasicData
const bd = {
	isDev: 0, //是否开发  0:正式环境  1：测试环境
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
		
		desc: "运动浙江 户外天堂",
		code: '330213',
		admin: '宁波之之步道技术有限公司',
		png: 'https://zts.5618.co/static/png/',
		logo: "https://zts.5618.co/repo/logoIcon.png",


		// #ifdef H5-ZLB
		name: "环浙步道服务应用管理端",
		copyright: '浙江省体育局、宁波市奉化区文化和广电旅游体育局',
		tel: '0574-88517465'
		// #endif

		// #ifndef H5-ZLB
		name: "环浙步道数字平台",
		copyright: "© 2021-至今 浙江体育科学研究所（浙江省反兴奋剂中心）",
		tel: '0574-88517758'
		// #endif
	},
	imgs: {
		nodata: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-699d1eb1-ee53-4c66-bddd-06cda80d1231/687b11af-e7e2-4cef-80d8-b3e1744dd101.png',
		// nodata: 		'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-996909cb-e5ca-4be8-8150-b60ae2422186/b680fa73-eff8-4ca4-b9f2-78e568e3be46.png',
		icon_moments: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/87a505b0-a1d0-11ea-b43d-2358b31b6ce6.png',
		icon_sina: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/879e9d10-a1d0-11ea-b94e-47f67ecf8268.png',
		icon_wechat: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/87926810-a1d0-11ea-b997-9918a5dda011.png',
		success: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/9f4e8750-a71f-11ea-8bd0-2998ac5bbf7e.png',
		icon_shop: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/9ff5d590-a969-11ea-a30b-e311646dfaf2.png',
		bg: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-fhsport/3d2a37d0-5fad-11eb-b997-9918a5dda011.png'
	}
}

module.exports = bd
