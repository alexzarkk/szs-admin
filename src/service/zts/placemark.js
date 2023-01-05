import { BaseService, Service, Permission } from "@/cool";

@Service("zts/placemark")
export default class extends BaseService {
	
	@Permission("merge")
	merge(data) {
		return this.request({
			url: "/merge",
			method: "POST",
			data
		});
	}
	
	@Permission("lines")
	lines(data) {
		return this.request({
			url: "/lines",
			method: "POST",
			data
		});
	}
	
	
	@Permission("backDef")
	backDef(data) {
		return this.request({
			url: "/backDef",
			method: "POST",
			data
		});
	}
	
}
