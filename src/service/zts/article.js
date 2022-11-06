import { BaseService, Service, Permission } from "@/cool";

@Service("zts/article")
export default class extends BaseService {
	
	@Permission("audit")
	audit(data) {
		return this.request({
			url: "/audit",
			method: "POST",
			data
		})
	}
}
