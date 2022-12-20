import { BaseService, Service, Permission } from "@/cool";

const method = "POST"
@Service("zts/layLog")
export default class extends BaseService {
	
	//工厂下载cdr
	@Permission("download")
	download(data) { return this.request({ url: "/download", method, data }) }
	
	// 作废
	@Permission("log0")
	async log0(data) { return this.request({ url: "/log0", method, data }) }
	// 初始
	@Permission("log2")
	async log2(data) { return this.request({ url: "/log2", method, data }) }
	// 布局
	@Permission("log3")
	async log3(data) { return this.request({ url: "/log3", method, data }) }
	// 排版
	@Permission("log4")
	async log4(data) { return this.request({ url: "/log4", method, data }) }
	// 校对
	@Permission("log8")
	async log8(data) { return this.request({ url: "/log8", method, data }) }
	// 确认
	@Permission("log10")
	async log10(data) { return this.request({ url: "/log10", method, data }) }
	// 下单
	@Permission("log12")
	async log12(data) { return this.request({ url: "/log12", method, data }) }
	// 上传
	@Permission("log14")
	async log14(data) { return this.request({ url: "/log14", method, data }) }
	// 出库
	@Permission("log20")
	async log20(data) { return this.request({ url: "/log20", method, data }) }
	// 签收
	@Permission("log30")
	async log30(data) { return this.request({ url: "/log30", method, data }) }
	// 安装
	@Permission("log40")
	async log40(data) { return this.request({ url: "/log40", method, data }) }
	// 审核
	@Permission("log50")
	async log50(data) { return this.request({ url: "/log50", method, data }) }
	
	// 审核不合规
	@Permission("log32")
	async log32(data) { return this.request({ url: "/log32", method, data }) }
	
}
