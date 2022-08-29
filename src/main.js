import Vue from "vue"
import Crud from "cl-admin-crud"
import ElementUI, { Loading } from "element-ui"
import store from "@/store"
import { LoadService } from "@/cool"
import App from "./App"
import Layout from "@/components/layout"

import zz from '@/comm/zz'

import "@/filter"
import "@/icons"
import "@/static/css/element-variables.scss"


import "@/filter"
import "@/icons"
import "@/static/css/element-variables.scss"
import "@/static/css/colorui/main.scss"
import "@/static/css/colorui/icon.scss"

LoadService({ store })

Vue.component("cl-layout", Layout)
Vue.use(ElementUI)
Vue.use(Crud, {
	crud: {
		dict: {
			sort: {
				prop: "order",
				order: "sort"
			}
		},
		fn: {
			permission(that) {
				const { permission } = that.$store.state.menu
				const { add, delete: del, update } = that.service.permission || {}

				return {
					add: permission.includes(add),
					delete: permission.includes(del),
					update: permission.includes(update)
				}
			}
		}
	}
});

App.mpType = "app";
Vue.config.productionTip = false;
Vue.prototype.zz = zz

const loader = Loading.service({
	text: "加载配置中"
})

store.dispatch("appLoad").done(() => {
	loader.close()

	const app = new Vue({
		store,
		...App
	})
	app.$mount()
})
