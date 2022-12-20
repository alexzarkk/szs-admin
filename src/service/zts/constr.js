import { BaseService, Service, Permission } from "@/cool";

@Service("zts/constr")
export default class extends BaseService {
	@Permission("audit")
	audit(data) {
		return this.request({
			url: "/audit",
			method: "POST",
			data
		});
	}
	
	@Permission("auditBack")
	auditBack(data) {
		return this.request({
			url: "/auditBack",
			method: "POST",
			data
		});
	}
	
	@Permission("detail")
	detail(data) {
		return this.request({
			url: "/detail",
			method: "POST",
			data
		});
	}
	
	@Permission("logSetp")
	logSetp(data) {
		return this.request({
			url: "/logSetp",
			method: "POST",
			data
		});
	}
}