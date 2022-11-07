import { BaseService, Service, Permission } from "@/cool";
const method = "POST"

@Service("zts/kml")
export default class extends BaseService {
	
	@Permission("download")
	download(data) {
		return this.request({
			url: "/download",
			method,
			data
		});
	}
	//复制
	@Permission("copy")
	copy(data) {
		return this.request({
			url: "/copy",
			method,
			data
		});
	}
	
	//复制
	@Permission("move")
	move(data) {
		return this.request({
			url: "/move",
			method,
			data
		});
	}
	
	//导出excel
	@Permission("exportExcel")
	exportExcel(data) {
		return this.request({
			url: "/exportExcel",
			method,
			data
		});
	}
	
	//超级编辑者(可以修改他人数据)
	@Permission("superEdit")
	superEdit(data) {
		return this.request({
			url: "/superEdit",
			method,
			data
		});
	}
	
	@Permission("changeType")
	changeType(data) {
		return this.request({
			url: "/update",
			method,
			data
		});
	}
	
	//设计
	@Permission("design")
	design(data) {
		return this.request({
			url: "/design",
			method,
			data
		});
	}
	
	@Permission("merge")
	merge(data) {
		return this.request({
			url: "/merge",
			method,
			data
		});
	}
	
	//撤删
	@Permission("kill")
	kill(data) {
		return this.request({
			url: "/kill",
			method,
			data
		});
	}
	
	//审核
	@Permission("verify")
	verify(data) {
		return this.request({
			url: "/verify",
			method,
			data
		});
	}
	
	//退审
	@Permission("veriBack")
	veriBack(data) {
		return this.request({
			url: "/veriBack",
			method,
			data
		});
	}
	
	//生成报表
	@Permission("createChart")
	createChart(data) {
		return this.request({
			url: "/createChart",
			method,
			data
		});
	}
	
	
	
}