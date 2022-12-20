import { md5 } from "@/comm/libs/md5"
export default {
	state: {
		token: uni.getStorageSync("8C7D00B_token") || null,
		info: uni.getStorageSync("8C7D00B_user") || {},
	},
	actions: {
		userLogin({ commit }, form) {
			form.password = md5(form.password)
			return this.$service.common.userLogin(form).then((res) => {
				commit("SET_TOKEN", res)
				return res
			})
		},

		userLogout({ dispatch }) {
			return new Promise((resolve) => {
				this.$service.common.userLogout().done(() => {
					dispatch("userRemove").then(() => {
						resolve()
					})
				})
			})
		},

		userInfo({ commit }) {
			return this.$service.common.userInfo().then((res) => {
				commit("SET_USERINFO", res)
				return res
			})
		},

		userRemove({ commit }) {
			commit("CLEAR_USER")
			commit("CLEAR_TOKEN")
			commit("RESET_PROCESS")
			commit("SET_MENU_GROUP", [])
			commit("SET_VIEW_ROUTES", [])
			commit("SET_MENU_LIST", 0)
		},
	},
	mutations: {
		SET_USERINFO(state, val) {
			state.info = val
			uni.setStorageSync("8C7D00B_user", val)
		},

		SET_TOKEN(state, { token }) {
			state.token = token
			uni.setStorageSync("8C7D00B_token", token)
		},

		CLEAR_TOKEN(state) {
			state.token = null
			uni.removeStorageSync("8C7D00B_token")
		},

		CLEAR_USER(state) {
			state.info = {}
			uni.removeStorageSync("8C7D00B_user")
		},
	},
}
