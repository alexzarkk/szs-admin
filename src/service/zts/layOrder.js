import { BaseService, Service, Permission } from "@/cool"
const method = "POST"

@Service("zts/layOrder")
export default class extends BaseService {
	//工厂导出
	@Permission("excel")
	excel(data) { return this.request({ url: "/excel", method, data }) }
	
	//工厂接单
	@Permission("accept")
	accept(data) { return this.request({ url: "/accept", method, data }) }

}