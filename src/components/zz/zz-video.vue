<template>
<view class="flex align-center flex-direction">
	<view class="root" :style="{width,height}">
	    <image :style="{width,height}" class="posterImg" :src="posterUrl" mode="aspectFit"></image>
	    <view :style="{width,height}" @click="state=!state" class="box">
	        <image class="playIcon" src="@/static/play.png" mode="widthFix"></image>
	    </view>
	    <video :id="videoId" :style="{height,width:state?'740rpx':'0rpx'}" @pause="state=0" @timeupdate="timeupdate" @fullscreenchange="fullscreenchange" class="video" :src="url"></video>
	    <!-- <progress :style="{'top':height,width}" class="progress" :percent="currentTime?parseInt(currentTime/duration*100):0" show-info border-radius="5" active></progress> -->
	</view>
</view>
</template>

<script>
export default {
    props: {
        video: {
            type: Object,
            default() {
                return {}
            }
        },
        poster: {
            type: [String, Boolean],
            default() {
                return ''
            }
        },
        direction: {
            type: Number,
            default() {
                return 0
            }
        }
    },
    data() {
        return {
            url: '',
            height: "450rpx",
            width: "700rpx",
            VideoContext: {},
            state: false,
            currentTime: 0,
            duration: 0,
            videoId: ''
        };
    },
    computed: {
        posterUrl() {
            if (this.poster) return this.poster
            return this.url + '?x-oss-process=video/snapshot,t_' + (parseInt(this.currentTime * 1000)) + ',f_jpg,w_800,m_fast'
        }
    },
    watch: {
        state(state, oldValue) {
            // console.log(state, 'state');
            if (!state) {
                this.VideoContext.pause()
            } else {
                this.VideoContext.play()
                this.$nextTick(() => {
                    this.VideoContext.requestFullScreen({ direction: this.direction })
                })
            }
        },
		video(state, oldValue) {
		    this.init()
		}
    },
    created() {
        this.videoId = Date.now() + Math.ceil(Math.random() * 10000000) + "";
    },
    mounted() {
       this.init()
    },
    methods: {
		init(){
			Object.assign(this, this.video)
			if (this.video.tempFilePath) this.url = this.video.tempFilePath
			this.VideoContext = uni.createVideoContext(this.videoId)
		},
        fullscreenchange(e) {
            // console.log(e.detail.fullScreen);
            this.state = e.detail.fullScreen
        },
        timeupdate(e) {
            // console.log(e.detail);
            this.duration = e.detail.duration
            this.currentTime = e.detail.currentTime
        }
    }
}
</script>

<style lang="scss" scoped>
.root {
    position: relative;
    width: 750rpx;
    height: 300px;
    overflow: hidden;
}
.posterImg,
.video,
.box {
    display: flex;
    width: 700rpx;
    height: 300px;
    //border: solid 1px red;absolute
    position: absolute;
}
// .posterImg {
// }
.box {
    justify-content: center;
    align-items: center;
}
.playIcon {
    width: 100rpx;
}
</style>
