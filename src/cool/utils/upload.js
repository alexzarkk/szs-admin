import { pathToBase64 } from '@/js_sdk/mmmm-image-tools'
export async function uploadFile({ filePath, cloudPath }) {
	
	// #ifdef H5-ZLB
	/* 用 http 请求上传 */
	let base64 = [],
		f = await pathToBase64(filePath)

	const put = (s, n = 900000) => {
		if (s.length > n) {
			base64.push(s.substring(0, n))
			put(s.substring(n, s.length))
		} else {
			base64.push(s)
		}
	}
	put(f.split(',')[1])

	let file = {
		id: Date.now() + '',
		sn: 1,
		size: base64.length,
		cloudPath: uni.getStorageSync(filePath)
	}
	for (let s of base64) {
		let e = await zz.req({ $fn: 'sync' + rndInt(), $url: '/admin/comm/upload', dataUrl: s, ...file })
		if (e) {
			file.url = e.fileID
			if (remove) uni.removeStorageSync(filePath)
		}
		file.sn++
	}

	return new Promise((resolve, reject) => {
		file.url ? resolve(file.url) : reject(false)
	})
	// #endif

	// #ifndef H5-ZLB
	return new Promise((resolve, reject) => {
		uniCloud.uploadFile({
			filePath,
			cloudPath,
			onUploadProgress(progressEvent) {
				// let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
			},
			success(e) {
				resolve(e.fileID)
			},
			fail(err) {
				console.error(filePath, "文件上传失败===", err)
				reject(false)
			}
		})
	})
	// #endif
	
	
	
	// return new Promise((resolve, reject) => {
	// 	uniCloud.uploadFile({
	// 		filePath,
	// 		cloudPath,
	// 		success: ({ fileID }) => {
	// 			resolve(fileID)
	// 		},
	// 		fail: (err) => {
	// 			reject(err);
	// 		}
	// 	});
	// });
}