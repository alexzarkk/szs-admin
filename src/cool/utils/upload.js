import { pathToBase64 } from '@/js_sdk/mmmm-image-tools'
import { req, rndInt } from '@/comm/zz'
import { uniqId } from '@/comm/geotools'

export async function uploadFile({ filePath, fileType = 'image/png', compress = true, maxWidth = 750, maxHeight = 1600, cloudPath }) {
	
	/* 用 http 请求上传 */
	let base64 = [],
		src = await pathToBase64(filePath),
		fit = async()=>{
			return new Promise((resolve, reject) => {
				let reader = new FileReader(),
					img = new Image(),
					canvas = document.createElement('canvas'),
					context = canvas.getContext('2d')
					
				img.src = src
				img.onload = function () {
				    // 图片原始尺寸
				    let originWidth = this.width,
						originHeight = this.height
					
				    // 目标尺寸
				    let targetWidth = originWidth, targetHeight = originHeight;
				    // 图片尺寸超过限制
				    if (originWidth > maxWidth || originHeight > maxHeight) {
				        if (originWidth / originHeight > maxWidth / maxHeight) {
				            // 更宽，按照宽度限定尺寸
				            targetWidth = maxWidth;
				            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
				        } else {
				            targetHeight = maxHeight;
				            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
				        }
				    }
				        
				    // canvas对图片进行缩放
				    canvas.width = targetWidth;
				    canvas.height = targetHeight;
				    // 清除画布
				    context.clearRect(0, 0, targetWidth, targetHeight);
				    // 图片压缩
				    context.drawImage(img, 0, 0, targetWidth, targetHeight);
					
				    // canvas转为blob并上传
				    canvas.toBlob((blob)=> {
						reader.readAsDataURL(blob)
						reader.onloadend = ()=>{
							// console.log('..................',reader);
							resolve(reader.result)
						}
				    })
				}
			})
		}
	
	if(fileType.startsWith('image') && compress) {
		src = await fit()
	}
	
	const put = (s, n = 900000) => {
		if (s.length > n) {
			base64.push(s.substring(0, n))
			put(s.substring(n, s.length))
		} else {
			base64.push(s)
		}
	}
	put(src.split(',')[1])
	
	if(base64.length==1) {
		return new Promise((resolve, reject) => {
			req({ $fn: 'sync'+rndInt(), $url: '/admin/comm/upload', size: 1, dataUrl: base64[0], cloudPath }).then(e=>{
				resolve(e.fileID)
			})
		})
	} else {
		// 批量上传
		let id = uniqId()
		const arr = base64.map((dataUrl, sn) => {
			return req({ $fn: 'sync'+rndInt(), $url: '/admin/comm/put', id, sn, dataUrl })
		})
		await Promise.all(arr)
		return new Promise((resolve, reject) => {
			req({ $fn: 'sync'+rndInt(), $url: '/admin/comm/done', id, cloudPath, size: base64.length }).then(e=>{
				resolve(e.fileID)
			})
		})
	}
}