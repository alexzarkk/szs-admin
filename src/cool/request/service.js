import request from "@/service/request";
import { baseUrl } from "@/config/env";

export class BaseService {
	constructor() {
		const crud = {
			one: "one",
			
			info: "info",
			page: "page",
			
			list: "list",
			
			add: "add",
			delete: "delete",
			update: "update"
		};

		if (!this.permission) {
			this.permission = {};
		}

		for (let i in crud) {
			if (this.namespace) {
				this.permission[i] = this.namespace.replace(/\//g, ":") + ":" + crud[i];
			} else {
				this.permission[i] = crud[i];
			}
		}
	}

	request(options = {}) {
		if (!options.params) {
			options.params = {};
		}

		let path = "";

		if (process.env.NODE_ENV == "development") {
			path = this.proxy || baseUrl;
		} else {
			if (this.proxy) {
				path = this.url;
			} else {
				path = baseUrl;
			}
		}

		if (this.namespace) {
			path += "/" + this.namespace;
		}

		if (!options.url.includes("http")) {
			options.url = path + options.url;
		}

		return request(options);
	}

	list(params) {
		return new Promise((resolve, reject) => {
			this.request({
				url: "/list",
				params: {
					...params
				}
			})
				.then((res) => {
					res.map((e) => {
						e.id = e._id;
					});

					resolve(res);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	page(params) {
		return new Promise((resolve, reject) => {
			this.request({
				url: "/page",
				params: {
					...params
				}
			})
				.then((res) => {
					res.list.map((e) => {
						e.id = e._id;
					});

					resolve(res);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}
	one(params) {
		return this.request({
			url: "/one",
			params: {
				...params
			}
		})
	}

	info(params) {
		if (params.id) {
			params._id = params.id;
		}

		return this.request({
			url: "/info",
			params: {
				...params
			}
		});
	}
	
	

	update(params) {
		if (params.id) {
			params._id = params.id;
		}

		return this.request({
			url: "/update",
			method: "POST",
			data: {
				...params
			}
		});
	}

	delete(params) {
		return this.request({
			url: "/delete",
			method: "POST",
			data: {
				...params
			}
		});
	}

	add(params) {
		return this.request({
			url: "/add",
			method: "POST",
			data: {
				...params
			}
		});
	}
}
