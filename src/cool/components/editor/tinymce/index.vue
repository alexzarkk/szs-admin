<template>
	<div>
		<tinymce-vue v-model="content" api-key="ydhl463cqrcugurlxkzc3r0e8zszmohmpogh7raly4ml5a4i" :init="init"></tinymce-vue>
		<cl-upload-space ref="space" :btn="false" @input="selected"></cl-upload-space>
	</div>
</template>

<script>
import TinymceVue from "@tinymce/tinymce-vue"
import { uploadFile } from "../../../utils/upload"

let thiz
export default {
	components: { TinymceVue },
	props: {
		value: null,
		options: Object
	},
	data() {
		return {
			content: "",
			init: {
				branding: false,
				menubar: false,
				// menubar: 'file edit view',
				language: 'zh_CN',
				statusbar: false,
				paste_data_images: true,
				min_height: 300,
				autoresize_on_init: true,
				
				toolbar: "fullscreen | removeformat | undo redo | formatselect | bold italic forecolor backcolor code | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent table | image media cloud | link",
				plugins: "fullscreen autoresize lists image imagetools media table wordcount code anchor link",
				// fullscreen_native: true,

				image_title: true,
				file_picker_types: 'image media',
				
				 selector: '#editor',
				// automatic_uploads: true,
				images_upload_handler: this.upload,
				setup(editor){
					thiz.editor = editor
				    editor.ui.registry.addButton('cloud', {
						icon: 'gallery',
						tooltip: '从空间加载（照片/视频）',
						onAction(){
							thiz.$refs.space.visible = true
						}
				    });
				},
				...this.options
			}
		}
	},
	watch: {
		value: {
			immediate: true,
			handler(val) {
				this.content = val;
			}
		},
		content(val) {
			this.$emit("input", val);
		}
	},
	mounted() {
		thiz = this
	},
	methods: {
		async upload(blobInfo, progress) {
			return new Promise((resolve, reject) => {
				uploadFile({
					filePath: blobInfo.blobUri(),
					cloudPath: blobInfo.filename()
				}).then((url) => {
					this.$service.space.info.add({
						url,
						type: blobInfo.blob().type,
						classifyId: 'tm_' + this.$store.getters.userInfo._id
					}).then(e=>{
						progress(url)
						resolve(url)
					})
				}).catch((err) => {
					reject(err)
				})
			})
		},
		selected(e){
			for (let s of e.split(',')) {
				let p = s.split('.'), x
				if(['mp4','m4v','avi','webm','mpeg'].includes(p[p.length-1].toLowerCase())) {
					x = `<p><video controls="controls" width="750" height="100%"><source src="${s}" type="video/mp4"/></video></p>`
				} else {
					x = `<p><img src="${s}" width="750"/></p>`
				}
				this.editor.insertContent(x)
			}
			this.$refs.space.visible = false
		}
	},
};
</script>