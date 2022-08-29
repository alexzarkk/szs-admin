export default function Ajax({u = 'app', data = {}, t = 9999 }) {
	const cloud = 'https://699d1eb1-ee53-4c66-bddd-06cda80d1231.bspapp.com/'
	const api = {
		app: cloud + 'app',
		zz: cloud + 'http/zz'
	}
	return new Promise((resolve, reject) => {
		
		let timer,x
		// #ifdef APP-PLUS
		x = new plus.net.XMLHttpRequest()
		// #endif
		// #ifndef APP-PLUS
		x = window.XMLHttpRequest? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")
		// #endif
			
		x.open('POST',api[u],true)
		x.setRequestHeader("Content-type","application/x-www-form-urlencoded")
		x.setRequestHeader("appid", '__UNI__210B33A')
		x.send(JSON.stringify(data))
		
		console.log('ajax ------------',u,data);
		
		x.onreadystatechange = ()=>{
			clearInterval(timer)
			if (x.readyState === 4) {
				let e = JSON.parse(x.responseText)
				if (x.status >= 200 && x.status < 300 || x.status == 304) {
					if(e.code==1000) {
						// console.log('success ------------',e.data);
						resolve(e.data)
					} else{
						console.log('错误：', e.message);
						reject(e.message)
					}
				}else{
					console.log('request error',e.error);
					reject(e.error.message)
				}
			}
		}
		//超时
		if(t){
			timer = setInterval(()=>{
				console.log('timedout!')
				x.abort()
				clearInterval(timer)
			},t)
		}
	})
}