<template>
    <div class="cl-upload__wrap" v-if="list.length&&list[0]">
        <!-- 默认上传 -->
        <div class="cl-upload">
            <div class="cl-upload__item" v-for="(item, index) in list" :key="index" :style="style">
				<img class="cl-upload__image"
					:src="item"
					alt=""
					v-if="item"
				/>
				<i v-else class="el-icon-picture"></i>
				<i class="el-icon-close" v-if="item" @click.stop="removeFile(index)"></i>
            </div>
        </div>
    </div>
</template>

<script>
export default {
	props: {
		pics: [Array, String],
		size: {
			type: [Number],
			default: 100
		},
		idx:[Number]
	},

	computed: {
		style() {
			return {
				'height': this.size+'px',
			};
		},
		list() {
			return _.isArray(this.pics)? this.pics:this.pics.split(',')
		}
	},

	mounted() {
		
	},

	methods: {
		// 上传成功
		removeFile(k) {
			let t = this.zz.clone(this.list)
			let x = []
			for (var i = 0; i < t.length; i++) {
				if(i!=k){
					x.push(t[i])
				}
			}
			this.$emit("updatePic", {pic: _.isArray(this.pics)?x:x.map((e) => e).join(",") , idx: this.idx});
		},
	}
};
</script>

<style lang="scss" scoped>
.cl-upload {
	display: flex;
	flex-wrap: wrap;

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

}
</style>
