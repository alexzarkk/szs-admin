import { md5 } from "@/comm/libs/md5"
import { checkPerm } from "@/cool/permission"
import { Message } from 'element-ui'

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

		hasPerm({ state }, e) {
			let user = state.info
			console.log('thiz.hasPerm ------------------',user,e)
			
			//admin
			if(user.admin) return true
			
			if(e.obj && e.obj.status>=10) {
				Message.error("数据已经审核存档，如需修改请联系管理员！")
				return false
			}
			
			if(e.obj && user._id != e.obj.userId) {
				Message.error("没有权限（数据修改仅限于本人操作）！")
				return false
			}
			
			//指定权限
			if(e.perms) {
				for (let s of e.perms) {
					if(checkPerm(s)) return true
				}
			}
			
			
			if(e.obj && obj.status==-1) {
				Message.error("此数据已作废，如需修改请联系管理员！")
				return false
			}
			
			return true
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
