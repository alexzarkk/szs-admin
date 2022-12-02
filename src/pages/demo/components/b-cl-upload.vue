<template>
    <div class="scope">
        <div class="h">
            <span>cl-upload</span>
            图片上传
        </div>
        <div class="c">
            <el-row>
                <cl-upload v-model="urls" :limit="3" @success="onSuccess" @error="onError"/>
                <cl-upload-space v-model="urls2" is-space></cl-upload-space>

                <ul
                    class="urls"
                    v-if="urls2"
                >
                    <li v-for="(item, index) in list" :key="index" >
                        <img :src="item" alt=""/>
                    </li>
                </ul>
				
				视频上传
				<cl-upload v-model="file" :fileType="'video'" :limit="1" @success="onSuccess" @error="onError"/>
				文件
				<cl-upload v-model="kml" :fileType="'kml'" :limit="1" @success="onSuccess" @error="onError"/>
            </el-row>
        </div>
        <div class="f">
            <span class="date">2020/08/08</span>
        </div>
    </div>
</template>

<script>
export default {
	data() {
		return {
			urls: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-996909cb-e5ca-4be8-8150-b60ae2422186/8781a1ac-35eb-40c4-b5a9-2534dd4bd05e.png",
			urls2: "",
			file: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-996909cb-e5ca-4be8-8150-b60ae2422186/a8828e74-741a-4c92-9441-3804f836dd04.mp4',
			kml: "",
		};
	},

	computed: {
		list() {
			return this.urls2.split(",");
		}
	},

	methods: {
		onSuccess(url) {
			this.$message.success("上传成功");
			console.log("上传成功", url);
		},

		onError(err) {
			console.error("上传失败", err);
		},

		onUpload(file, { next, done }) {
			console.log("上传钩子", file);
			next();
		},

		onRemove(index, { next }) {
			console.log("删除钩子", index);
			next(index);
		}
	}
};
</script>

<style lang="scss" scoped>
.scope {
	.label {
		display: inline-block;
		font-size: 12px;
		padding-bottom: 10px;
	}

	.urls {
		display: flex;
		flex-wrap: wrap;
		margin-top: 10px;

		li {
			img {
				display: block;
				height: 100px;
				width: 100px;
				margin: 0 10px 10px 0;
			}
		}
	}
}
</style>
