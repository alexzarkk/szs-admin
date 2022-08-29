<script>
	import Vue from 'vue'
	import comm from '@/comm/comm'
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
			
			// uni.clearStorageSync()
			
			let dict = uni.getStorageSync('szs_dict')||{}
			this.zz.req({ $url: 'public/zz/dict', obj: true, v: dict.v, tar: null }).then(e => {
				Object.assign(dict,e)
				uni.setStorageSync('szs_dict', dict)
				console.log('dict ===============', dict)
			})
			comm.on([121,30])
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
