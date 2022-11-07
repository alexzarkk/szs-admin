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

/* ==================
		DataV
 ==================== */

import dataV from '@jiaminghi/data-view';
// 引入全局css
import './assets/scss/style.scss';
// 按需引入vue-awesome图标
import Icon from 'vue-awesome/components/Icon';
import 'vue-awesome/icons/chart-bar.js';
import 'vue-awesome/icons/chart-area.js';
import 'vue-awesome/icons/chart-pie.js';
import 'vue-awesome/icons/chart-line.js';
import 'vue-awesome/icons/align-left.js';
//引入echart
//4.x 引用方式
import echarts from 'echarts'
//5.x 引用方式为按需引用
//希望使用5.x版本的话,需要在package.json中更新版本号,并切换引用方式
//import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts




LoadService({ store })
Vue.component('VueIcon', Icon);
Vue.component("cl-layout", Layout)
Vue.use(dataV);
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

const loader = Loading.service({text: "加载配置中"})

store.dispatch("appLoad").done(() => {
	loader.close()

	const app = new Vue({
		store,
		...App
	})
	app.$mount()
})
