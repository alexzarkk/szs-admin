export default {
	state: {
		info: uni.getStorageSync("sys_param") || null
	},
	actions: {
		sysParam({ commit }) {
			return this.$service.common.sysParam().then((res) => {
				console.log('SET_SYS_PARAM ================>',res)
				commit("SET_SYS_PARAM", res)
				return res
			})
		}
	},
	mutations: {
		SET_SYS_PARAM(state, val) {
			state.info = val
			uni.setStorageSync("sys_param", val)
		},

		CLEAR_SYS_PARAM(state) {
			state.info = null
			uni.removeStorageSync("sys_param")
		}
	}
}
