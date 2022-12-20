export default {
	state: {
		dict: uni.getStorageSync("8C7D00B_dict") || {v:0}
	},
	actions: {
		async sysDict({ commit, state }) {
			await this.$service.common.sysDict({v:state.dict.v}).then((e) => {
				console.log('SET_SYS_DICT ================>',e)
				if(state.dict.v < e.v) commit("SET_SYS_DICT", e)
			})
		},
		
		getCids({ state },id) {
			let arr = [id * 1]
			for (let s of state.dict.deps) {
				if (s.pid == id) {
					arr.push(s.id)
				}
			}
			return arr
		},
		getParent({ state },pid) {
			for (let s of state.dict.deps) {
				if (s.id == pid) {
					return s
				}
			}
			return null
		},
		deptObj({ state }) {
			let d = {}
			for (let s of state.dict.deps) {
				d[s.id] = s
			}
			return d
		},
		getDept({ state },o) {
			for (let s of state.dict.deps) {
				if (s.id == o || s.name == o) return s
			}
			return {}
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
		},
		
	},
	mutations: {
		SET_SYS_DICT(state, val) {
			state.dict = val
			uni.setStorageSync("8C7D00B_dict", val)
		},
		CLEAR_SYS_DICT(state) {
			state.dict = val
			uni.removeStorageSync("8C7D00B_dict")
		}
	}
}
