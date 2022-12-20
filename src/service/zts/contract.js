import { BaseService, Service, Permission } from "@/cool";

@Service("zts/contract")
export default class extends BaseService {
	
	@Permission("order")
	order(data) {
		return this.request({
			url: "/order",
			method: "POST",
			data
		})
	}
	
	@Permission("addLog")
	addLog(data) {
		return this.request({
			url: "/addLog",
			method: "POST",
			data
		})
	}
	
	@Permission("logList")
	logList(data) {
		return this.request({
			url: "/logList",
			method: "POST",
			data
		})
	}
	
	@Permission("excel")
	excel(data) {
		return this.request({
			url: "/excel",
			method: "POST",
			data
		})
	}
}
