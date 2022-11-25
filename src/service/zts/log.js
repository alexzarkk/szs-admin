import { BaseService, Service, Permission } from "@/cool";

@Service("zts/log")
export default class extends BaseService {
	
	@Permission("sms")
	sms(data) {
		return this.request({
			url: "/sms",
			method: "POST",
			data
		})
	}
}
