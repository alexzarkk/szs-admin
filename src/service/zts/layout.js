import { BaseService, Service, Permission } from "@/cool";

@Service("zts/layout")
export default class extends BaseService {

	//附近
	@Permission("around")
	around(data) {
		return this.request({
			url: "/around",
			method: "POST",
			data
		});
	}

	@Permission("merge")
	merge(data) {
		return this.request({
			url: "/merge",
			method: "POST",
			data
		});
	}
	
	@Permission("addLine")
	addLine(data) {
		return this.request({
			url: "/addLine",
			method: "POST",
			data
		});
	}
	
	@Permission("initT29")
	initT29(data) {
		return this.request({
			url: "/initT29",
			method: "POST",
			data
		});
	}
	
	@Permission("setTs")
	setTs(data) {
		return this.request({
			url: "/setTs",
			method: "POST",
			data
		});
	}
	
	@Permission("setSn")
	setSn(data) {
		return this.request({
			url: "/setSn",
			method: "POST",
			data
		});
	}
	
	//初始化
	@Permission("initNav")
	initNav(data) {
		return this.request({
			url: "/initNav",
			method: "POST",
			data
		});
	}
	//重置
	@Permission("reset")
	reset(data) {
		return this.request({
			url: "/reset",
			method: "POST",
			data
		});
	}
	//导出
	@Permission("expExcel")
	expExcel(data) {
		return this.request({
			url: "/expExcel",
			method: "POST",
			data
		});
	}
	
	//确认
	@Permission("checkout")
	checkout(data) {
		return this.request({
			url: "/checkout",
			method: "POST",
			data
		});
	}
	
	//删除
	@Permission("kill")
	kill(data) {
		return this.request({
			url: "/kill",
			method: "POST",
			data
		});
	}
	
	//下单确认
	@Permission("order")
	order(data) { return this.request({}) }
	
}