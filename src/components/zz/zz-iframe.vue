<template>
    <div class="bg-mobile">
        <div class="model-content">
            <iframe v-if="iframeLink" ref="iframe" class="content-iframe" :src="iframeLink" @load="iframeOnLoad"></iframe>
            <div v-else class="content-iframe">
                <span>点击预览内容查看当前评论所在的内容</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        iframeLink: {
            type: String,
            default: ""
        }
    },
    mounted() {
        console.log("iframe========", this.$refs.iframe)
    },
    data() {
        return {}
    },
    methods: {
        iframeOnLoad(event) {
            console.log("监听加载========", event)
        }
    }
}
</script>

<style lang="scss" scoped>
.bg-mobile {
    min-width: 425px;
	width: 425px;
    height: 900px;
    margin-left: 20px;
    background-image: url(https://v1.uviewui.com/common/iPhoneX_model.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;
    .model-content {
        .content-iframe {
            position: absolute;
            top: 60px;
            left: 24px;
            // width: 100%;
            min-width: 375px;
			width: 375px;
            height: 800px;
            border-radius: 30px;
            border: none;
        }
    }
}
</style>