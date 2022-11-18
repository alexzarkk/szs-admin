import { BaseService, Service, Permission } from "@/cool";

@Service("zts/blog")
export default class extends BaseService {
	
	// @Permission("audit")
	// audit(data) {
	// 	return this.request({
	// 		url: "/audit",
	// 		method: "POST",
	// 		data
	// 	})
	// }
}
