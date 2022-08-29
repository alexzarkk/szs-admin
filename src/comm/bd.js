const bd = {
	sys: {
		name: "环浙步道",
		desc: "运动浙江 户外天堂",
		code: '330213',
		admin: '宁波之之步道技术有限公司',
		png: 'https://zts.5618.co/static/png/',
		// logo:"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-fb41164a-2f7b-434d-a985-757ed85d35c5/fa5b6a73-10e5-4c8c-8264-3ded2d454f14.png",
		logo:"https://zts.5618.co/repo/logoIcon.png",
		
		footer: {
			
			// #ifdef APP-PLUS
			content: "© 2022 ZTS 浙江省体育科学研究所",
			// #endif
			
			// #ifndef APP-PLUS
			content: "© 2022 浙江省体育局 宁波市奉化区文化和广电旅游体育局",
			// #endif
			
			navigate: [{
				url: "/pages/comm/about",
				type: "navigate",
				text: "环浙步道"
			}]
		}
	},
	msgTemplate: {
		reply: 'qHeFuOgNEMR6zRqZUldReE83a7jpMVlwBvS975ej-EU',		//留言回复通知
		errreport: ''
	},
	imgs: {
		nodata: 		'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-699d1eb1-ee53-4c66-bddd-06cda80d1231/687b11af-e7e2-4cef-80d8-b3e1744dd101.png',
		// nodata: 		'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-996909cb-e5ca-4be8-8150-b60ae2422186/b680fa73-eff8-4ca4-b9f2-78e568e3be46.png',
		icon_moments:	'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/87a505b0-a1d0-11ea-b43d-2358b31b6ce6.png',
		icon_qq:		'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/879e27e0-a1d0-11ea-b997-9918a5dda011.png',
		icon_sina:		'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/879e9d10-a1d0-11ea-b94e-47f67ecf8268.png',
		icon_wechat:	'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/87926810-a1d0-11ea-b997-9918a5dda011.png',
		success:		'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/9f4e8750-a71f-11ea-8bd0-2998ac5bbf7e.png',
		icon_shop:		'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/9ff5d590-a969-11ea-a30b-e311646dfaf2.png',
		bg: 			'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-fhsport/3d2a37d0-5fad-11eb-b997-9918a5dda011.png'
	}
}

module.exports = bd
