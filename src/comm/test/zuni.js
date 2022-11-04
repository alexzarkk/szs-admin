const zuni = {
	async saveFile(tempFilePath){
		return new Promise((res, rej) => {
			uni.saveFile({
				tempFilePath,
				complete(v) { res(v.savedFilePath) },
				fail(d) { rej(d) }
			})
		})
	},
	async removeFile(filePath) {
		return new Promise((resolve, reject) => {
			if(filePath.startsWith('http')) {
				
			} else {
				uni.removeSavedFile({
					filePath,
					success(e) {
						resolve(e)
					},
					fail(e) {
						reject(e)
					}
				})
			}
		})
	},
	async upload(filePath) {
		return new Promise((resolve, reject) => {
			uniCloud.uploadFile({
				filePath,
				cloudPath: 'szs'+filePath,
				onUploadProgress(progressEvent) {
					// let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
				},
				success(e) {
					zuni.removeFile(filePath)
					resolve(e.fileID)
				},
				fail(err){
					console.error(filePath,"文件上传失败===", err)
					reject(err)
					
				}
			})
		})
	},
	async chooseImage({ sourceType = ['album', 'camera'], sizeType = ['compressed'], count = 1 }, upload = false) {
		
		// #ifndef APP-PLUS
		upload = true
		// #endif
		
		const [_, e] = await uni.chooseImage({ sourceType, sizeType, count })
		if (e) {
			for (let i = 0; i < e.tempFilePaths.length; i++) {
				e.tempFilePaths[i] = await this.saveFile(e.tempFilePaths[i])
				if(upload) e.tempFilePaths[i] = await this.upload(e.tempFilePaths[i])
			}
			return e.tempFilePaths
		}
	},
	async chooseVideo({ sourceType = ['camera'], compressed = false, camera = 'back', maxDuration = 10 }, upload = false) {
		compressed = uni.getSystemInfoSync().platform == 'ios'
		
		// #ifndef APP-PLUS
		upload = true
		// #endif
		
		const [_, e] = await uni.chooseVideo({ sourceType, compressed, camera, maxDuration })
		if (!e) return null
		e.tempFilePath = await this.saveFile(e.tempFilePath)
		
		if (upload) e.tempFilePath = await this.upload(e.tempFilePath)
		
		delete e.errMsg
		return e
	}
}

module.exports = zuni