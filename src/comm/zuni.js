// return imgs []

const saveFile = function (tempFilePath) {
	return new Promise((res, rej) => {
		uni.saveFile({
			tempFilePath,
			complete: v => { res(v.savedFilePath) },
			fail(d) { rej(d) }
		})
	})
}

const removeFile = function (tempFilePath) {
	return new Promise((resolve, reject) => {
		uni.removeSavedFile({
			filePath: tempFilePath,  // string,需要删除的文件路径
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				console.error("文件删除异常===", err)
			}
		})
	})
}


async function chooseImage({ sourceType = ['album', 'camera'], sizeType = ['original'], count = 1 }, save = true) {

	try {
		const [_, e] = await uni.chooseImage({ sourceType, sizeType, count })
		if (e) {
			if (save) {
				for (let i = 0; i < e.tempFilePaths.length; i++) {
					e.tempFilePaths[i] = await saveFile(e.tempFilePaths[i])
				}
			}
			return e.tempFilePaths
		}
	} catch (e) {
		throw new Error(e)
	}
}
// return video {}
async function chooseVideo({ sourceType = ['camera'], compressed = false, camera = 'back', maxDuration = 10 }, save = true) {
	compressed = uni.getSystemInfoSync().platform == 'ios'
	try {
		const [_, e] = await uni.chooseVideo({ sourceType, compressed, camera, maxDuration })
		if (!e) return null
		if (save) e.tempFilePath = await saveFile(e.tempFilePath)
		delete e.errMsg
		return e
	} catch (e) {
		throw new Error(e)
	}
}


async function upload(filePath) {
	try {
		const e = await uniCloud.uploadFile({ filePath, cloudPath: filePath })
		return e.fileID
	} catch (x) {
		console.log(x, filePath);
		throw new Error(x)
	}
}





export default {
	chooseImage,
	chooseVideo,
	saveFile,
	upload
}