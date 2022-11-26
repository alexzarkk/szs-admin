<template>
    <div>
        <view class="button-box">
            <button style="width: 16px; height: 20px; background-color: green; margin-right: 10px;" @click="handleActive"> </button>
            <el-button type="primary" size="mini" @click="detail('north')">北线</el-button>
            <el-button type="primary" size="mini" @click="detail('east')">东线</el-button>
            <el-button type="primary" size="mini" @click="detail('south')">南线</el-button>
            <el-button type="primary" size="mini" @click="detail('west')">西线</el-button>
            <el-button type="primary" size="mini" @click="detail('zs')">舟山</el-button>

            <el-button type="success" size="mini" @click="show(0)">北线</el-button>
            <el-button type="success" size="mini" @click="show(1)">东线</el-button>
            <el-button type="success" size="mini" @click="show(2)">南线</el-button>
            <el-button type="success" size="mini" @click="show(3)">西线</el-button>
            <el-button type="success" size="mini" @click="show(4)">舟山</el-button>
            <el-button type="success" size="mini" @click="show(5)">洞头</el-button>
            <el-button type="success" size="mini" @click="show(6)">全省</el-button>
        </view>
        <map11 v-if="loaded" :pms="kml" :winH="mapHeight" @drawFinish="drawFinish"></map11>
        <div v-if="isShow" class="flex align-center justify-between info-box " :class="active?'an-scale-up':'an-scale-up-reverse'">
            <div class="left">
                <image class="image" mode="aspectFit" src="@/static/logo.png" alt="logo" />
                <!-- <div>环浙步道logo</div> -->
            </div>
            <div class="right">
                <div class="text-1">环浙步道 - {{line[idx].title}}</div>
                <div class="text-2 text-ztsgreen">成功贯通</div>
            </div>
            <div style="font-size:24px;" @click="handleActive">
                <span class="cuIcon-close close-icon"></span>
            </div>
        </div>
    </div>
</template>

<script>

import { getPms, getKml } from './dict.js'

import map11 from "./map11.vue";

export default {
    components: {
        map11
    },
    data() {
        return {
            mapHeight: 500,
            modalName: '',
            loaded: true,
            kml: null,
            active: false,
            isShow: false,
			idx:0,
			
			line:[
				{ k:['north'], title: '北线' },
				{ k:['east'], title: '东线' },
				{ k:['west'], title: '西线' },
				{ k:['south'], title: '南线' },
				{ k:['zs'], title: '舟山' },
				{ k:['dt'], title: '洞头' },
				{ k:['north','east','south','west','zs'], title: '省级主线' }
			]
        };
    },
    onLoad() {
        this.mapHeight = window.screen.height - 40
        // this.zz.req('')
    },
    onReady() {

        console.log("浏览器窗口高度=====", window.screen.height)
        // setTimeout(() => {

        // this.modalName = 'DialogModal1'
        // }, 3000)
        // this.isShow = true
    },
    mounted() {
    },
    methods: {
        hideModal() {
            this.modalName = ''
        },
        handleActive() {
            if (!this.isShow) {
                this.isShow = true
            }
            this.active = !this.active
            // setTimeout(() => {
            //     this.active = false
            // }, 500)
        },
        detail(k) {
            let kml = getPms(k)
            this.zz.href('/pages/demo/11/map', { kml })
        },
        async show(idx) {
			this.idx = idx
			let k = this.line[idx].k
            this.loaded = false
            this.kml = await getKml(k)
            this.loaded = true
            console.log(this.kml);
        },
        drawFinish() {
            console.log('drawFinish');
            this.handleActive()
        }
    }
};
</script>

<style lang="scss" scoped>
.button-box {
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.mask-box {
    width: 100vw;
    height: 100vh;
    background-color: rgba($color: #000000, $alpha: 0.3);
    z-index: 999999;
}

.info-box {
    position: fixed;
    top: calc(50% - 130px);
    left: calc(50% - 350px);
    z-index: 99999999;
    width: 700px;
    height: 260px;
    background-color: #1d50a2;
    color: #ffffff;
    border-radius: 20px;

    .left {
        width: 250px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        // margin-left: 30px;
        .image {
            width: 160px;
            height: 160px;
            padding: 20px;
            border-radius: 50%;
            background-color: #ffffff;

            background-size: 100% 100%;
            // background-image:url();
        }
    }

    .right {
        // margin-left: 50px;
        width: 450px;
        display: flex;
        flex-direction: column;
        // align-items: center;
        // justify-content: center;
        font-size: 20px;
        .text-1 {
            font-size: 50px;
            margin-bottom: 40px;
        }

        .text-2 {
            font-size: 36px;
            color: #8fc42f;
            // text-align: center;
        }
    }

    .close-icon {
        position: absolute;
        top: 30px;
        right: 30px;
    }
}

.an-hidden {
    opacity: 0;
    // display: none;
}

.an-scale-up {
    animation-duration: 0.5s;
    animation-timing-function: ease-out;
    animation-fill-mode: both;
    animation-name: scale-up;
}

.an-scale-up-reverse {
    animation-duration: 0.5s;
    animation-timing-function: ease-out;
    animation-fill-mode: both;
    animation-name: scale-up-reverse;
}

@keyframes scale-up {
    0% {
        opacity: 0;
        transform: scale(0.2);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes scale-up-reverse {
    0% {
        opacity: 1;
        transform: scale(1);
    }

    100% {
        opacity: 0;
        transform: scale(0.2);
    }
}
</style>
