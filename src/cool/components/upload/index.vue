<template>
    <div class="cl-upload__wrap">
        <!-- 文件空间 -->
        <cl-upload-space v-if="isSpace" ref="space" :limit="limit" @confirm="onSpaceConfirm">
            <slot></slot>
        </cl-upload-space>

        <!-- 默认上传 -->
        <div v-else-if="fileType=='image'" class="cl-upload" :class="{ 'is-multiple': list.length < limit }">
            <div v-for="(item, index) in list" :key="index" :style="style" class="cl-upload__item" v-loading="item.loading">
				<template v-if="item.url">					<img class="cl-upload__image" :src="item.url"/>
					<i class="el-icon-close" @click.stop="removeFile(index)"/>				</template>
				<template v-else>
					<i class="el-icon-picture"/>
				</template>
            </div>
			
            <template v-if="list.length < limit">
                <div class="cl-upload__item" :style="style" @click="chooseImage()">
                    <i class="el-icon-picture"/>
                </div>
            </template>
        </div>
		
		<!-- 单文件上传 -->
		<div v-else>
			<el-row type="flex" class="row-bg" justify="left">
				<el-col :span="24">
					<template v-if="list.length">
						<template v-if="fileType=='video'">
							<video :src="list[0].url"></video>
						</template>
						<template v-else>
							<el-link class="padding-right-sm" type="info">{{ list[0].url }}</el-link>
						</template>
						<el-button type="danger" icon="el-icon-delete" plain circle :loading="list[0].loading" @click.stop="removeFile(0)"></el-button>
					</template>
					<template v-else>
						<el-button type="primary" size="small" plain @click="chooseImage">文件上传<i class="el-icon-upload el-icon--right"></i></el-button>
					</template>
				</el-col>
			</el-row>
		</div>
    </div>
</template>

<script>
import { uploadFile } from "../../utils/upload.js";

export default {
	props: {
		value: [Array, String],
		showSize: {
			type: [Number, Array],
			default: 120
		},
		
		// 最大允许上传个数
		limit: {
			type: Number,
			default: 9
		},
		
		fileType: {
			type: String,
			default: 'image'
		},
		
		// 上传时的钩子
		onUpload: Function,
		// 删除文件时的钩子
		onRemove: Function,
		// 是否显示文件空间
		isSpace: Boolean
	},

	data() {
		return {
			list: [],
			que: 0
		};
	},

	computed: {
		style() {
			if(this.fileType=='image') {
				return { height: this.showSize+'px', width: this.showSize+'px' }
			}else{
				return { height: '40px', width: '100%' }
			}
		}
	},

	watch: {
		value: {
			immediate: true,
			handler: "parseValue"
		}
	},
	mounted() {
		
	},

	methods: {
		parseValue(value) {
			let list = []
			if (value instanceof Array) {
				list = value
			} else {
				if(value) list = value.split(",")
			}
			this.list = list.map(url => {return {url}})
			console.log(this.list,this.fileType)
		},

		// 回调
		emit() {
			let value = this.list.filter((e) => e.url).map((e) => e.url).join(",");
			this.$emit("input", value);
			this.$emit("change", value);
		},

		// 上传成功
		onUploadSuccess(url, filePath) {
			console.log(url, filePath);
			// debugger
			let x = this.list.find(e=>e.filePath&&e.filePath==filePath)
			x.loading = false
			x.url = url
			delete x.filePath
			
			this.$emit("success", url)
			
			this.que --
			if(this.que==0) {
				this.emit()
			}
		},

		// 上传错误
		onUploadError(err, file) {
			console.error("upload error", err);
			this.$message.error(err);
			this.loading = false;
			this.$emit("error", err);
		},

		// 移除文件
		async removeFile(i) {
			if (this.onRemove){
				await this.onRemove(i)
				this.$emit("input", '')
				return this.list = []
			}
			
			this.$set(this.list[i], "loading", true)
			
			this.$service.space.info.delete({
					url: this.list[i].url
				}).then(() => {
					const next = (index) => {
						this.list.splice(index, 1);
						this.emit()
					};
					
					if (this.onRemove) {
						this.onRemove(i, { next })
					} else {
						next(i)
					}
				}).catch((err) => {
					this.$message.error(err);
				})
		},

		// 选择图片
		chooseImage() {
			let ext = [];
			switch (this.fileType) {
				case "kml":
					ext = ['kml'];
					break;
				case "pdf":
					ext = ['pdf'];
					break;
				case "video":
					ext = ['mp4','m4v','avi','webm','MPEG'];
					break;
				case "cdr":
					ext = ['cdr'];
					break;
				default:
					ext = ['bmp','jpg','png','tif','gif','pcx','jpeg','jfif','svg','psd','cdr',',ai','webp'];
			}
			
			uni.chooseFile({
				count: this.limit - this.list.length,
				type: this.fileType,
				extension: ext,
				success: (res) => {
					for (let s of res.tempFilePaths) {
						this.que ++
						this.list.push({filePath: s, loading: true })
					}
					
					res.tempFiles.forEach((e, i) => {
						const next = (name) => {
							return new Promise((resolve, reject) => {
								uploadFile({
									filePath: res.tempFilePaths[i],
									cloudPath: name || e.name
								}).then((url) => {
										this.onUploadSuccess(url, res.tempFilePaths[i])
										resolve(url)
									}).catch((err) => {
										reject(err)
									})
							})
						}

						const done = (item) => {
							if(item) item.loading = false
						}
						if (this.onUpload) {
							this.list = [{ url: e.name }]
							this.$emit("input", e.name)
							this.onUpload(e, { next, done })
						} else {
							next()
						}
					})
				}
			})
		},

		// 打开文件空间
		openSpace() {
			this.$refs["space"].open();
		},

		// 确认图片
		onSpaceConfirm(urls) {
			this.$emit("input", urls);
			this.$emit("change", urls);
		}
	}
};
</script>

<style lang="scss" scoped>
.cl-upload {
	display: flex;
	flex-wrap: wrap;

	&__hidden {
		height: 0;
		width: 0;
	}

	&__item {
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		border: 1px dashed #bfbfbf;
		background-color: #FFF;
		border-radius: 6px;
		position: relative;
		margin-right: 10px;
		margin-bottom: 10px;

		.el-icon-picture {
			font-size: 24px;
			color: #8c939d;
		}

		.el-icon-close {
			position: absolute;
			right: 5px;
			top: 5px;
			background-color: #f56c6c;
			color: #fff;
			border-radius: 100%;
			padding: 2px;

			&:hover {
				background-color: red;
			}
		}

		&:hover {
			border: 1px dashed #409eff;
		}
	}

	&__image {
		height: 100%;
		width: 100%;
		border-radius: 6px;
	}

	&.is-multiple {
		.cl-upload__wrap {
			margin-right: 10px;
		}
	}
}
</style>
