<template>
    <view>
        <!-- #ifdef APP-PLUS  -->
        <view class="cu-custom" :style="[{ height: CustomBar + 'px' }]">
            <view class="cu-bar fixed" :style="style" :class="[bgImage ? 'none-bg text-white bg-img' : '', bgColor]">
                <block v-if="home">
                    <view class="flex justify-start align-center">
                        <view class="padding-tb-sm" @tap="BackPage">
                            <view class="action" v-if="isBack">
                                <text v-if="isClose" class="cuIcon-close"></text>
                                <text v-else class="cuIcon-back"></text>
                            </view>
                            <view class="action" v-else></view>
                        </view>
                        <view class="action padding-tb-sm" @tap="goHome"><text class="cuIcon-homefill margin-right-sm"></text></view>
                    </view>
                </block>
                <block v-else>
                    <view class="action" @tap="BackPage" v-if="isBack">
                        <text class="cuIcon-back padding-sm"></text>
                        <slot name="backText"></slot>
                    </view>
                </block>
                <slot name="left"></slot>
                <view class="content" :style="[{ top: StatusBar + 'px' }]">
                    <slot name="content"></slot>
                </view>
                <view style="position:absolute;right:0;">
                    <slot name="right"></slot>
                </view>
            </view>
        </view>
        <!-- #endif -->
    </view>
</template>

<script>
// | 参数       | 作用   |类型    |  默认值 |
// | --------   | -----:  |-----:  | :----:  |
// | bgColor    | 背景颜色类名 |String  |   ''    |
// | isBack     | 是否开启返回 | Boolean |   false |
// | bgImage    | 背景图片路径 | String  |  ''     |

// | slot块       | 作用   |
// | --------   | -----:  |
// | backText    | 返回时的文字 |
// | content     | 中间区域 |
// | right    | 右侧区域(小程序端可使用范围很窄！)  |
// #ifdef APP-PLUS
export default {
    name: 'cu-custom',
    data() {
        return {
            platform: this.platform,
            StatusBar: this.StatusBar,
            CustomBar: this.CustomBar
        };
    },
    props: {
        bgColor: {
            type: String,
            default: ''
        },
        isBack: {
            type: [Boolean, String],
            default: false
        },
        isClose: {
            type: Boolean,
            default: false
        },
        home: {
            type: Boolean,
            default: false
        },
        bgImage: {
            type: String,
            default: ''
        },
		manualBack:{
		    type: Boolean,
		    default: false
		}
    },
    computed: {
        style() {
            // if (this.CustomBar === 0) {
            //     this.CustomBar = 50;
            // }
            let StatusBar = this.StatusBar;
            let CustomBar = this.CustomBar;
            let bgImage = this.bgImage;
            let style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
            if (this.bgImage) {
                style = `${style}background-image:url(${bgImage});`;
            }
            return style;
        }
    },
    mounted() {
        uni.setNavigationBarTitle({ title: this.$slots.content ? this.$slots.content[0].text : '环浙步道' })
    },
    methods: {
        BackPage() {
			if(this.manualBack) return this.$emit('back')
            if (getCurrentPages().length == 1) {
                this.goHome();
            }
            if (getCurrentPages().length < 2 && 'undefined' !== typeof __wxConfig) {
                let url = '/' + __wxConfig.pages[0];
                return uni.redirectTo({ url });
            }
            uni.navigateBack({ delta: 1 });
        },
        goHome() {
            uni.switchTab({ url: '/pages/index/index' });
        }
    }
};
// #endif
</script>
