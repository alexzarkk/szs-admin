import { BaseService, Service, Permission } from "@/cool";

@Service("zts/chart")
export default class extends BaseService {
	
	@Permission("create")
	create(data) {
		return this.request({
			url: "/create",
			method: "POST",
			data
		});
	}
	@Permission("get")
	get(data) {
		return this.request({
			url: "/get",
			method: "POST",
			data
		});
	}
	
}