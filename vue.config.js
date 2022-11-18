const TransformPages = require('uni-read-pages')
const {webpack} = new TransformPages()
module.exports = {
	outputDir: './build',
	configureWebpack: {
		plugins: [
			new webpack.DefinePlugin({
				ROUTES: webpack.DefinePlugin.runtimeValue(() => {
					const tfPages = new TransformPages({
						includes: ['path', 'name', 'aliasPath']
					});
					return JSON.stringify(tfPages.routes)
				}, true )
			})
		]
	},
	devServer: {
		port: 8080,
		open: false,
		compress: false,
		overlay: {
			warnings: false,
			errors: true
		},
		proxy: {
			"/dev": {
				target: "https://699d1eb1-ee53-4c66-bddd-06cda80d1231.bspapp.com",
				changeOrigin: true,
				pathRewrite: {
					"^/dev": ""
				}
			},
			"/pro": {
				target: "https://699d1eb1-ee53-4c66-bddd-06cda80d1231.bspapp.com",
				changeOrigin: true,
				pathRewrite: {
					"^/pro": "/api"
				}
			},
			"/nw": {
				target: "http://dev.cool-js.com",
				changeOrigin: true,
				pathRewrite: {
					"^/nw": ""
				}
			},
			'/zjtdt': {
				target: 'https://ditu.zjzwfw.gov.cn',
				changeOrigin: true,
				pathRewrite: {
				  '^/zjtdt': ''
				}
			},
			'/racemap': {
				target: 'https://ibcdsg.zj.gov.cn:8443', // 你请求的第三方接口
				changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
				pathRewrite: {  // 路径重写，
				  '^/racemap': ''  // 替换target中的请求地址，也就是说以后你在请求http://api.douban.com/v2/XXXXX这个地址的时候直接写成/api即可。
				}
			}
		}
	}
}