<script>
	import Vue from 'vue'
	import comm from '@/comm/comm'
	import AMapLoader from '@amap/amap-jsapi-loader'
	import { amapKey } from '@/comm/bd'
	
	export default {
		onLaunch: function () {
			
			console.log("App Launch")
			
			uni.getSystemInfo({
				success: function (e) {
					Vue.prototype.platform = e.platform
					window.model = e.model
					
					console.log('szsSys ------->', e)
					uni.setStorageSync('szsSys', e)
				}
			})
			
			
			// uni.onNetworkStatusChange(e => {
			// 	// #ifdef H5
			// 	comm.setNet(e.isConnected)
			// 	// #endif
				
			//     if (e.isConnected) {
			// 		if(!uni.getStorageSync('szs_dict')) {
			// 			uni.reLaunch({ url: '/pages/index/index' })
			// 		}
			//     }
			// })
			// uni.clearStorageSync()
			
			// let dict = uni.getStorageSync('szs_dict')||{v:1}
			// this.zz.req({ $url: '/public/zz/dict', v: dict.v }).then(e => {
			// 	console.log('dict ===============', e)
			// 	if(e.v>dict.v) {
			// 		uni.setStorageSync('szs_dict', e)
			// 	}
			// })
			// comm.on([121,30])
			
			AMapLoader.load({
				key: amapKey,
				version: "2.0",
				plugins:['AMap.Geolocation']
			}).then(e=>{
				console.log('AMap.Geolocation.loaded ..................');
				window.amapGeo = new AMap.Geolocation({
					enableHighAccuracy: true, //是否使用高精度定位，默认:true
					noIpLocate: 3,				//3: 所有终端禁止使用IP定位
					noGeoLocation:0,		  //1: 手机设备禁止使用浏览器定位
					// timeout: 10000,           //超过10秒后停止定位，默认：无穷大
					maximumAge: 0,            //定位结果缓存0毫秒，默认：0
					convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
					showButton: false,        //显示定位按钮，默认：true
					// buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
					// buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
					showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
					showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
					panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
					zoomToAccuracy:false      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
				})
			})
		},
		onShow: function () {
			console.log("App Show");
			if (!uni.getStorageSync("token")) {
				if (this.$route.path != "/pages/login/index") {
					uni.navigateTo({
						url: "/pages/login/index"
					});
				}
			}

			// 路由导航
			this.$router.beforeEach((to, from, next) => {
				const item = this.$store.getters.routes.find((e) =>
					e.path.includes("?") ? e.path == to.fullPath : e.path == to.fullPath
				);

				if (item) {
					// 添加路由进程
					this.$store.commit("ADD_PROCESS", {
						label: item.name,
						value: item.path.includes("?") ? to.fullPath : to.path
					});
				}

				next();
			});
		},
		onHide: function () {
			console.log("App Hide");
		}
	};
</script>

<style lang="scss">
@import "@/static/css/index.scss"
</style>
