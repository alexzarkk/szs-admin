<template>
    <div class="cl-upload__wrap">
        <!-- 文件空间 -->
        <cl-upload-space
            ref="space"
            :limit="limit"
            @confirm="onSpaceConfirm"
            v-if="isSpace"
        >
            <slot></slot>
        </cl-upload-space>

        <!-- 默认上传 -->
        <div
            v-else-if="fileType=='image'"
            class="cl-upload"
            :class="{ 'is-multiple': multiple }"
        >
            <div
                v-for="(item, index) in list"
                class="cl-upload__item"
                :key="index"
                :style="style"
                v-loading="item.loading"
                @click="chooseImage(item)"
            >
				<img
					class="cl-upload__image"
					:src="item.url"
					alt=""
					v-if="item.url"
				/>
				<i v-else class="el-icon-picture"></i>
				<i class="el-icon-close" v-if="item.url" @click.stop="removeFile(index)"></i>
			
            </div>
            <template v-if="isAppend">
                <div
                    class="cl-upload__item"
                    :style="style"
                    @click="chooseImage()"
                >
                    <i class="el-icon-picture"></i>
                </div>
            </template>
        </div>
		<div v-else>
			<!-- 单文件上传 -->
			<el-row type="flex" class="row-bg" justify="left">
				<el-col :span="24">
					<block v-if="list[0].url">
						<el-link class="padding-right-sm" type="info" href="#">{{ list[0].url }}</el-link>
						<el-button type="danger" icon="el-icon-delete" 
							plain circle
							:loading="list[0].loading"
							@click.stop="removeFile(0)"></el-button>
					</block>
					<block v-else>
					  <el-button type="primary" :loading="list[0].loading" @click="chooseImage">文件上传<i class="el-icon-upload el-icon--right"></i></el-button>
					</block>
				</el-col>
			</el-row>
		</div>
		
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import _ from "lodash";
// import { uploadFile } from "../../utils/cloud";

export default {
	props: {
		value: [Array, String],
		size: {
			type: [Number, Array],
			default: 120
		},
		// 是否支持多选文件
		multiple: Boolean,
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
			list: []
		};
	},

	computed: {
		...mapGetters(["token"]),

		style() {
			if(this.fileType=='image') {
				const [height, width] = (_.isArray(this.size) ? this.size : [this.size, this.size]).map(
					(e) => {
						return _.isNumber(e) ? `${e}px` : e;
					}
				);
				return {
					height,
					width
				};
			}else{
				return {
					'height': '40px',
					'width': '100%'
				};
			}
			
		},

		isAppend() {
			return this.multiple ? this.list.length < this.limit : this.list.length == 0;
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
			if (this.multiple) {
				let list = [];

				if (value instanceof Array) {
					list = value;
				} else {
					list = (value || "").split(",");
				}

				this.list = list.filter(Boolean).map((url) => {
					return {
						url,
						loading: false
					};
				});
			} else {
				this.list = [
					{
						url: value,
						loading: false
					}
				];
			}
		},

		// 回调
		emit() {
			let value = this.list.filter((e) => e.url).map((e) => e.url).join(",");

			this.$emit("input", value);
			this.$emit("change", value);
		},

		// 上传成功
		onUploadSuccess(url, file, item) {
		
			if (this.multiple) {
				if (item) {
					item.url = url;
				} else {
					this.list.push({
						url
					});
				}
			} else {
				this.list = [{ url }];
			}

			if (item) {
				item.loading = false;
			}
			
			// console.log();
			
			this.$emit("success", url);
			this.emit();
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
			if (this.onUpload){
				await this.onRemove(i);
				this.$emit("input", '');
				return this.list = [{}]
			}
			
			this.list[i].loading = true;
			this.$service.space.info.delete({
					url: this.list[i].url
				}).then(() => {
					
					// this.$message.success("删除成功");
					const next = (index) => {
						this.list.splice(index, 1);
						this.emit();
					};
					
					if (this.onRemove) {
						this.onRemove(i, { next });
					} else {
						next(i);
					}
				}).catch((err) => {
					this.$message.error(err);
				})
		},

		// 选择图片
		chooseImage(item) {
			const count = this.multiple && !item ? 2 : 1;
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
				count,
				extension: ext,
				success: (res) => {
					console.log(res)
					let data = null;

					if (item) {
						item.loading = true;
						data = item;
					}
					for (let s of res.tempFilePaths) {
						this.list.push({ loading: true })
					}
					
					res.tempFiles
						.filter((e, i) => { return this.multiple ? i < this.limit - this.list.length : i < 1 })
						.forEach((e, i) => {
							const next = (name) => {
								return new Promise((resolve, reject) => {
									this.zz.upload({
										filePath: res.tempFilePaths[i],
										cloudPath: name || e.name
									}).then((url) => {
											this.onUploadSuccess(url, e, data);
											resolve(url);
										}).catch((err) => {
											reject(err);
										});
								});
							};

							const done = () => {
								if (item) {
									item.loading = false;
								}
							};
							if (this.onUpload) {
								this.list = [{ url:e.name }];
								this.$emit("input", e.name);
								this.onUpload(e, { next, done });
							} else {
								next();
							}
						});
				}
			});
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
