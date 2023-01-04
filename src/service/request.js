import { req } from "@/comm/zz"

export default function (options) {
	return new Promise((resolve, reject) => {
		if (options.method == "POST") {
			options.params = options.data;
		}

		// console.log(options.url, options.params);
		
		req({$url: options.url, ...options.params}).then(e=>{
			resolve(e)
		}).catch(e=>{
			reject(e)
		})
	})
}
