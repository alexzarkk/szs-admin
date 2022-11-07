<template>
	<div>
		<tinymce-vue v-model="content" api-key="ydhl463cqrcugurlxkzc3r0e8zszmohmpogh7raly4ml5a4i" :init="init"></tinymce-vue>
	</div>
</template>

<script>
import TinymceVue from "@tinymce/tinymce-vue";
import { uploadFile } from "./upload";

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
				toolbar:
					"fullscreen | removeformat | undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | link",
				plugins: "fullscreen autoresize lists image imagetools media table wordcount code anchor link",
				// fullscreen_native: true,

				image_title: true,
				file_picker_types: 'image media',
				// automatic_uploads: true,
				images_upload_handler: this.zz.upload,
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
	methods: {
		
		
	},
};
</script>
