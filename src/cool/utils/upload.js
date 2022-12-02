import { pathToBase64 } from '@/js_sdk/mmmm-image-tools'
import { req, rndInt } from '@/comm/zz'
import { uniqId } from '@/comm/geotools'

export async function uploadFile({ filePath, cloudPath }) {
	
	/* 用 http 请求上传 */
	let base64 = [],
		f = await pathToBase64(filePath),
		id = uniqId()

	const put = (s, n = 900000) => {
		if (s.length > n) {
			base64.push(s.substring(0, n))
			put(s.substring(n, s.length))
		} else {
			base64.push(s)
		}
	}
	put(f.split(',')[1])
	
	// 批量上传
	const arr = base64.map((dataUrl, sn) => {
		return req({ $fn: 'sync'+rndInt(), $url: '/admin/comm/put', id, sn, dataUrl })
	})
	await Promise.all(arr)
	return new Promise((resolve, reject) => {
		req({ $fn: 'sync'+rndInt(), $url: '/admin/comm/done', id, cloudPath, size: base64.length }).then(e=>{
			resolve(e.fileID)
		})
	})

	/*  uniCloud 上传 */
	// return new Promise((resolve, reject) => {
	// 	uniCloud.uploadFile({
	// 		filePath,
	// 		cloudPath,
	// 		onUploadProgress(progressEvent) {
	// 			// let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
	// 		},
	// 		success(e) {
	// 			resolve(e.fileID)
	// 		},
	// 		fail(err) {
	// 			console.error(filePath, "文件上传失败===", err)
	// 			reject(false)
	// 		}
	// 	})
	// })
	
}