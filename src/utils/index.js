export function calcDescartes(array) {
	if (array.length < 2) return array[0] || [];
	return [].reduce.call(array, function(col, set) {
		let res = [];
		col.forEach(function(c) {
			set.forEach(function(s) {
				let t = [].concat(Array.isArray(c) ? c : [c]);
				t.push(s);
				res.push(t);
			});
		});
		return res;
	});
}

export function deepMerge(a, b) {
	let k;
	for (k in b) {
		a[k] =
			a[k] && a[k].toString() === "[object Object]" ? deepMerge(a[k], b[k]) : (a[k] = b[k]);
	}
	return a;
}


export function handleImage(src, type, successF) {
	uni.getImageInfo({
		src: src,
		success: function(res) {
			let canvasWidth = res.width //图片原始长宽
			let canvasHeight = res.height;
			let base = canvasWidth / canvasHeight;
			if (canvasWidth > 500) {
				canvasWidth = 500;
				canvasHeight = Math.floor(canvasWidth / base);
			}
			//进行压缩
			let canvas = document.createElement('canvas');
			let ctx = canvas.getContext('2d');
			canvas.width = canvasWidth;
			canvas.height = canvasHeight;
			let img = new Image();
			img.src = src; // 要压缩的图片  
			//重画这个图片
			ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
			//转为blob格式发送
			canvas.toBlob(function(blob) {
				const blobUrl = URL.createObjectURL(blob)
				console.log("压缩后的bloburl:" + blobUrl)
				successF(blobUrl)
			}, 'image/jpeg');
		},
		fail: (err) => {
			reject('获取图片信息失败')
		}
	})
}
