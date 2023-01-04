<template>
	<cl-layout>
		<el-row>
			<el-col>
				<el-input v-model="page.size" placeholder="请输入内容"></el-input>
				<el-input v-model="page.page" placeholder="请输入内容"></el-input>
				<el-button size="mini" @click="updateVideo('poi', 20)">poi</el-button>
				<el-button size="mini" @click="updateVideo('trail', 20)">trail</el-button>
				<el-button size="mini" @click="updateImg('article', 20)">article</el-button>
				<el-button size="mini" @click="updateImg('blog', 20)">blog</el-button>
				<el-button size="mini" @click="updateImg('layLog', 50)">layLog</el-button>
				<el-button size="mini" @click="placemark">placemark</el-button>
			</el-col>
			<el-col>
				<image :src="src" @click="viewImg"></image>
			</el-col>
		</el-row>
	</cl-layout>
</template>

<script>
import { uploadFile } from "@/cool/utils/upload.js"

export default {
	data() {
		return {
			src:'',
			page: {
				size: 50,
				page: 1,
				order: "_id",
				sort: "asc",
				total: -1
			}
		};
	},

	methods: {
		viewImg(){
			uni.previewImage({
				current: 0,
				urls: [this.src]
			})
		},
		
		async updateVideo(target, size){
			if(size) this.page.size = size
			
			let page = await this.zz.req({$url: '/admin/zts/'+target+'/page', ...this.page })
			
			console.log('zts_'+target+' ------------>',page.list,page.pagination, this.page.page * this.page.size, this.page.total);
			this.page.total = page.pagination.total
			
			for (let s of page.list) {
				let imgs = []
				
				if(s.content) {
					let c = s.content.split("source src=\"")
					for (var i = 1; i < c.length; i++) {
						let img = c[i].split('"')[0]
						let url = await this.saveImg(img, 'zts_'+target+'-'+s._id)
						if(url) imgs.push([img, url])
					}
					for (let p of imgs) {
						s.content = s.content.replaceAll(p[0], p[1])
					}
				}
				
				if(s.video) {
					if(typeof s.video == 'string') {
						imgs.push([s.video])
						let url = await this.saveImg(s.video, 'zts_'+target+'-'+s._id)
						if(url) {
							s.video = url
						} 
					}
					if(typeof s.video == 'object') {
						if(s.video.url) {
							imgs.push([s.video.url])
							let url = await this.saveImg(s.video.url, 'zts_'+target+'-'+s._id)
							if(url) {
								s.video.url = url
							}
						}
					}
				}
				
				if (imgs.length) {
					delete s.userInfo
					await this.zz.req({$url: '/admin/zts/'+target+'/update', ...s })
					let dead = imgs.map(e=>e[0])
					if(dead.length) {
						await this.zz.req({$url: '/admin/app/space/info/delete', url: dead }, true)
					}
				}
			}
			
			if(this.page.page * this.page.size < this.page.total) {
				this.page.page ++
				await this.updateVideo(target)
			}
		},
		
		
		async updateImg(target, size){
			if(size) this.page.size = size
			
			let page = await this.zz.req({$url: '/admin/zts/'+target+'/page', ...this.page })
			
			console.log('zts_'+target+' ------------>',page.list,page.pagination, this.page.page * this.page.size, this.page.total);
			this.page.total = page.pagination.total
			
			for (let s of page.list) {
				let imgs = []
				
				if(s.content) {
					let c = s.content.split("img src=\"")
					for (var i = 1; i < c.length; i++) {
						let img = c[i].split('"')[0]
						let url = await this.saveImg(img, 'zts_'+target+'-'+s._id)
						if(url) imgs.push([img, url])
					}
					for (let p of imgs) {
						s.content = s.content.replaceAll(p[0], p[1])
					}
				}
				
				if(s.cover) {
					if(typeof s.cover == 'string') {
						imgs.push([s.cover])
						let url = await this.saveImg(s.cover, 'zts_'+target+'-'+s._id)
						if(url) {
							s.cover = url
						} 
					}
					if(typeof s.cover == 'object') {
						if(s.cover.url) {
							imgs.push([s.cover.url])
							let url = await this.saveImg(s.cover.url, 'zts_'+target+'-'+s._id)
							if(url) {
								s.cover.url = url
							}
						}
					}
				}
				
				if(s.imgs) {
					
					if (typeof s.imgs == 'string') {
						s.imgs = s.imgs.split(',')
					}
					
					let newImgs = []
					for (var i = 0; i < s.imgs.length; i++) {
						imgs.push([s.imgs[i]])
						let url = await this.saveImg(s.imgs[i], 'zts_'+target+'-'+s._id)
						if(url) {
							newImgs.push(url)
						}
					}
					s.imgs = newImgs
				}
				
				if (imgs.length) {
					delete s.pics
					delete s.avatar
					delete s.userInfo
					
					await this.zz.req({$url: '/admin/zts/'+target+'/update', ...s })
					let dead = imgs.map(e=>e[0])
					if(dead.length) {
						await this.zz.req({$url: '/admin/app/space/info/delete', url: dead }, true)
					}
				}
			}
			
			if(this.page.page * this.page.size < this.page.total) {
				this.page.page ++
				await this.updateImg(target)
			}
		},
		async saveImg(url, pre = 'zts'){
			let cloudPath,
				fileType = 'image'
				
			if(url.startsWith('data:')) {
				cloudPath = pre + '.' + url.split(";")[0].split('/')[1]
			} else {
				let p = url.split('.')
				if(['mp4','m4v','avi','webm','MPEG'].includes(p[p.length-1])) {
					fileType = 'video'
				} 
				
				cloudPath = pre + '.'+p[p.length-1]
			}
			
			
			
			try{
				const newUrl = await uploadFile({ filePath: url, cloudPath , fileType})
				this.src = newUrl
				return newUrl
			}catch(e){
				console.log('img.fail', e);
			}
		},
		async placemark(){
			let target = 'placemark'
			let page = await this.zz.req({$url: '/admin/zts/'+target+'/page', ...this.page, imgs: true })
			
			console.log('zts_'+target+' ------------>',page.list,page.pagination, this.page.page * this.page.size, this.page.total)
			this.page.total = page.pagination.total
			
			for (let s of page.list) {
				if(s.imgs) {
					let imgs = []
					for (var i = 0; i < s.imgs.length; i++) {
						if(s.imgs[i] && s.imgs[i].startsWith('https')) {
							let url = await this.saveImg(s.imgs[i], 'zts_'+target+'-'+s._id)
							if(url)	imgs.push(url)
						}
					}
					if (imgs.length || s.imgs.length != imgs.length) {
						await this.zz.req({$url: '/public/placemark/updateImg', _id: s._id, kmlId: s.kmlId, t2: s.t2, imgs })
						await this.zz.req({$url: '/admin/app/space/info/delete', url: s.imgs }, true)
					}
				}
			}
			
			if(this.page.page * this.page.size < this.page.total) {
				this.page.page ++
				// await this.updateImg(target)
			}
		},
		
		async updataBlog(){
			
			// let list = await this.zz.req({$url: '/admin/zts/blog/batch' })
			
			console.log('updataBlog ------------>',list);
			
			for (let s of list) {
				await this.zz.req({$url: '/admin/zts/blog/updateTT', ...s })
			}
		},
	}
};
</script>
