import { api, isDev } from '@/comm/bd'
import { rndInt, upload, removeFile } from '@/comm/zz'
import { req, hadNet } from '@/comm/comm'

const sync = {
	removeFile,
	upload,
	req,
	get(){ return uni.getStorageSync('sync_task') || {r:Date.now()-20000,q:[]} },
	set(o){ uni.setStorageSync('sync_task', o) },
	add(o,k='req',sync=true){
		let tk = this.get()
		tk.q.push({o,k})
		this.set(tk)
		if(sync) {
			this.go()
		}
	},
	addFile(k,v){
		let f = uni.getStorageSync('sync_files')||{}
		f[k] = v
		uni.setStorageSync('sync_files', f)
	},
	
	async go(){
		if(hadNet()) {
			let tk = this.get(),
				now = Date.now()
				
			// console.log((now-tk.r),'task.start --->', tk);
			
			if((now-tk.r)>=20000) {
				tk.r = now
				this.set(tk)
				for (var i = 0; i < tk.q.length; i++) {
					let q = tk.q[i], u, v, r
					if(q.k=='req'){ 
						q.o.$fn = 'sync0'// + rndInt()
						u = q.o.$url
					} 
					
					await this[q.k](q.o,0).then(x=>{v=x}).catch(e=>{r=e})
					
					if(r||!v) {
						if(q.k=='req') q.o.$url = u
						this.set(tk)
						return setTimeout(()=>{this.go()}, 20001)
					}
					
					if(v){
						tk.q.splice(i,1)
						this.set(tk)
						i--
						if(q.k=='upload') {
							this.addFile(q.o,v)
							tk.q.unshift({o:{$url:'/user/rec/sync',file:{k:q.o,v}},k:'req'})
							tk.r-=20000
							this.set(tk)
							return this.go()
						}
						//saved
						if(v==2) {
							let temp = uni.getStorageSync('tempfiles')||[],
								local = uni.getStorageSync('nav_local_rec')||[],
								f = uni.getStorageSync('sync_files')||{}
							
							for (let u of temp) {
								if(!u.startsWith('http')) {
									removeFile(u)
									delete f[u]
								}
							}
							
							uni.setStorageSync('sync_files',f)
							uni.removeStorageSync('tempfiles')
							
							let idx = local.findIndex(s=>s.startTime==q.o.kml.startTime)
							if(idx!=-1) {
								local.splice(idx,1)
								uni.setStorageSync('nav_local_rec', local)
							}
						}
					}
				}
				tk.r-=20000
				this.set(tk)
			}
			// console.log(Date.now() - now,'task.finish --->', tk);
		}
	}
}

module.exports = sync