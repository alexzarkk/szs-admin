import { BaseService, Service, Permission } from "@/cool";

@Service("zts/poi")
export default class extends BaseService {
	
	@Permission("preview")
	preview(data) {
		return this.request({
			url: "/preview",
			method: "POST",
			data
		});
	}
	
}
