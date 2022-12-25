export default {
	state: {
		dict: uni.getStorageSync("8C7D00B_dict") || {v:0},
		dictObj: uni.getStorageSync("8C7D00B_dictObj") || {}
	},
	actions: {
		async sysDict({ commit, state }) {
			await this.$service.common.sysDict({v:state.dict.v}).then((e) => {
				console.log('SET_SYS_DICT ================>',e)
				if(state.dict.v < e.v) commit("SET_SYS_DICT", e)
			})
		}
	},
	getters: {
		deptLabel: state => {
			let arr = []
			for (let s of state.dict.deps) {
				arr.push({
					value: s.id,
					label: s.name,
					type: s.pid == 0 ? 'primary' : s.pid == 330000 ? 'success' : 'info'
				})
			}
			return arr
		}
	},
	mutations: {
		SET_SYS_DICT(state, val) {
			let o = {}
			const toObj = (k, e) => {
				if(!o[k]) o[k] = {}
				if((e instanceof Array)) {
					for (let s of e) {
						o[k][s.value||s.id] = s
					}
				} else {
					for (let k2 in e) {
						if(e[k2] instanceof Array) {
							toObj(k+'_'+k2, e[k2])
						} else {
							o[k][k2] = e[k2]
						}
					}
				}
			}
			for (let k in val) {
				toObj(k, val[k])
			}
			
			state.dict = val
			state.dictObj = o
			
			uni.setStorageSync("8C7D00B_dict", val)
			uni.setStorageSync("8C7D00B_dictObj", o)
		},
		CLEAR_SYS_DICT(state) {
			state.dict = val
			uni.removeStorageSync("8C7D00B_dict")
		}
	}
}
