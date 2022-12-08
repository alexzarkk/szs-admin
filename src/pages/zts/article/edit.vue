<template>
    <cl-layout>
        <div class="container">
            <div class="scroller">
                <el-form ref="form" :rules="rules" :model="form" label-width="100px" v-loading="loading">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="标题" prop="title">
                                <el-input size="small" v-model="form.title" placeholder="请输入标题"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="4">
                            <el-form-item label="来源" prop="origin">
                                <el-input size="small" v-model="form.origin"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="作者" prop="author">
                                <el-input size="small" v-model="form.author"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item label="发布时间" prop="createTime">
                                <el-date-picker size="small" v-model="form.createTime" :value-format="'yyyy-MM-dd HH:mm:ss'" type="datetime"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="类型" prop="type">

                        <el-checkbox-group size="small" v-model="form.type">
                            <block v-for="(t, index) in article" :key="index">
                                <el-checkbox :label="t.value">{{t.label}}</el-checkbox>
                            </block>
                        </el-checkbox-group>

                    </el-form-item>

                    <el-row>
                        <el-col>
                            <el-form-item label="发布区域" prop="pub">
                                <el-radio-group size="small" v-model="form.pub">
                                    <block v-for="(t, index) in tar" :key="index">
                                        <el-radio-button :label="t.value">{{t.text}}</el-radio-button>
                                    </block>
                                </el-radio-group>
                            </el-form-item>
                            <block v-if="form.pub==1">
                                <el-form-item label="" prop="deptId">
                                    <cl-dept-cascader2 v-if="timTimer" :id="cur.deptId" @input="setRegion"></cl-dept-cascader2>
                                </el-form-item>
                            </block>
                        </el-col>
                    </el-row>

                    <el-form-item label="封面" prop="cover">
                        <cl-upload :value="form.cover.url" @input="setCover"></cl-upload>
                        <el-input size="small" v-model="form.cover.desc" placeholder="封面信息"></el-input>
                    </el-form-item>
                    <tool-tip></tool-tip>
                    <el-form-item label="视频">
                        <cl-upload :value="form.video.url" @input="setVideo" :fileType="'video'" is-space></cl-upload>
                        <view v-if="form.video.url">
                            <video id="myVideo" :src="form.video.url" controls></video>
                        </view>
                        <el-input size="small" v-model="form.video.desc" placeholder="视频说明"></el-input>
                    </el-form-item>

                    <el-form-item label="简介" prop="desc">
                        <el-input type="textarea" v-model="form.desc" placeholder="请输入6-200个字的简介信息"></el-input>
                    </el-form-item>

                    <el-form-item label="详情" prop="content">
                        <cl-editor-tinymce v-if="timTimer" v-model="form.content" :options="{height:600}"></cl-editor-tinymce>
                    </el-form-item>

                </el-form>
            </div>
            <view class="flex justify-center align-start">
                <view class="flex-twice">
                    <block v-if="updateTime">
                        <el-link type="info">自动保存：{{updateTime}}</el-link>
                    </block>
                </view>
                <view class="flex-twice padding-tb-xs">
                    <el-button type="info" @click="back('view')">返 回</el-button>
                    <el-button type="success" @click="submitForm('view')">预 览</el-button>
                    <el-button type="primary" @click="submitForm('save')">保 存</el-button>
                </view>
            </view>
        </div>

        <!-- <cl-dialog :title="'位置坐标'" :height="'600px'" :width="'880px'" :controls="['close']" :visible.sync="visible">
			<tdt-map :center="form.coord||center" :zoom="13" @init="initTdt">
				<block v-if="form.coord">
					<tdt-marker :position="form.coord" :dragging="true" :edit="true" @dragend="marked"></tdt-marker>
				</block>
				<block v-for="(pm, idx) of refKml" :key="idx + '0000'">
					<tdt-polyline
						:path="pm.coord"
						:weight="pm.prop.weight"
						:color="pm.prop.color"
						:opacity="pm.prop.opacity"
						:extData="pm"
					></tdt-polyline>
				</block>
				<tdt-mousetool ref="mousetool" :markTool="{follow:true}" :polygonTool="{showLabel:true}"
					:polylineTool="{showLabel:true, color:'#d80000'}" @markend="marked" @polyline-draw="lineDrawed"
					@polygon-draw="gonDrawed">
				</tdt-mousetool>
			</tdt-map>
		</cl-dialog> -->

        <el-dialog title="扫码预览" center :visible.sync="preview" :width="'240px'">
            <zz-qrcode :url="shareUrl"></zz-qrcode>
        </el-dialog>
    </cl-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import { dept, article } from "@/comm/dict"

export default {
    data() {
        return {
            cid: [],
            article,
            visible: false,
            center: [120.15, 30.28],
            refKml: [],
            region: [],
            loading: true,
            timTimer: null,
            updateTime: '',
            preview: false,
            shareUrl: '',

            cur: {},
            tar: [{ text: '不限', type: 'info', value: 0 }, { text: '定向', type: 'primary', value: 1 }],
            form: { cover: {}, video: {}, type: [] },
            rules: {
                title: [{
                    required: true,
                    message: '请输入标题',
                    trigger: 'blur'
                }, {
                    min: 2,
                    max: 30,
                    message: '长度在 2 到 30 个字符',
                    trigger: 'blur'
                }],
                cover: [{
                    required: true,
                    message: '请上传封面照片',
                    trigger: 'blur'
                }],
                type: [{
                    required: true,
                    message: '请选择类型',
                    trigger: 'blur'
                }],
                pub: [{
                    required: true,
                    message: '请选择发布区域',
                    trigger: 'blur'
                }],
                desc: [{
                    required: true,
                    message: '请输入简介',
                    trigger: 'blur'
                }, {
                    min: 6,
                    max: 200,
                    message: '长度在 6 到 200 个字符',
                    trigger: 'blur'
                }],
                content: [{
                    required: true,
                    message: '请输入详情',
                    trigger: 'blur'
                }],
            }
        };
    },
    computed: {
        ...mapGetters(['lay', 'userInfo'])
    },
    activated() {
        this.init()
    },
    deactivated() {
        this.clearTim()
    },
    mounted() {
        // this.gd = new T.Geocoder()
        this.cid = dept.getCids(this.userInfo.departmentId)
        this.init()
    },
    methods: {
        async init() {
            this.form = {
                title: '',
                deptId: '',
                type: [],
                coord: [],
                pub: 0,
                cover: {},
                video: {},
                desc: '',
                content: '',
                status: 1,
                deptId: 330000,
                author: '',
                userId: this.userInfo._id
            }
            if (this.cid.length == 1) {
                this.setRegion(this.cid)
            }
            this.loading = true
            let id = this.$route.query._id
            if (!id) {
                await this.$service.zts.article.page({ userId: this.userInfo._id, status: 1 }).then(res => {
                    if (res.list.length) {
                        this.form = res.list[0]
                    }
                })
                if (!this.form._id) {
                    this.$service.zts.article.add({
                        ...this.form
                    }).then(e => {
                        this.form._id = e.id
                    })
                }
            } else {
                this.cur = await this.$service.zts.article.info({ id })

                // this.cur.cover = {"url":"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-699d1eb1-ee53-4c66-bddd-06cda80d1231/fce7f997-8053-438a-b211-63223baf46b3.png"}

                this.form = this.cur

            }
            this.autoUpdate()
            this.loading = false
        },
        // 开启自动保存
        autoUpdate() {
            if (this.timTimer) this.clearTim()
            this.timTimer = setInterval(() => {
                this.updateTime = this.zz.time2Date()
                this.$service.zts.article.update({ ...this.form })
            }, 40000);
        },
        // 清除自动保存的定时器
        clearTim() {
            clearInterval(this.timTimer)
            this.timTimer = null
            this.updateTime = ''
        },
        // initTdt(e) {
        // 	this.map = e
        // 	if (!this.form.coord) this.$refs.mousetool.open('markTool')
        // },
        setRegion(e) {  // 设置 地区信息
            this.form.deptId = e[e.length - 1] + ''
        },

        // async onNear(){
        // 	let e = await this.$service.zts.layout.around({deptId:this.form.deptId, coord:[this.center]}),
        // 		prop = {
        // 			1:['#ff5500',5],
        // 			2:['#aa0000',4],
        // 			3:['#ff3dff',3],
        // 			4:['#aa557f',3]
        // 		}
        // 	for (let s of e.line) {
        // 		s.prop = {
        // 					opacity: 0.9,
        // 					width: prop[s.level][1],
        // 					color: prop[s.level][0]
        // 				}
        // 	}
        // 	this.refKml = e.line
        // 	// console.log("获取到的当前属地的信息.onNear",e.line)
        // },
        marked(e) {
            let coord
            if (e.type && e.type == 'dragend') {
                coord = [e.lnglat.getLng(), e.lnglat.getLat(), 0]
            } else {
                coord = [e.currentLnglat.getLng(), e.currentLnglat.getLat(), 0]
            }
            this.form.coord = coord
            const searchResult = (e) => {
                var addressComponent = e.getAddressComponent();
                this.form.addr = addressComponent.address
            }
            this.gd.getLocation(new T.LngLat(coord[0], coord[1]), searchResult);
        },
        setCover(e) { this.form.cover.url = e },
        setVideo(e) { this.form.video.url = e },
        async submitForm(tar) {
            let veri = false
            this.$refs.form.validate((valid) => {
                if (valid) {
                    // alert('submit!');
                    veri = true
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
            if (veri) {
                this.loading = true
                if (this.form.status == 1) this.form.status = 2
                // console.log("提交的内容",this.form)
                await this.$service.zts.article.update({
                    ...this.form
                }).done(() => {
                    this.loading = false;

                    if (tar == 'view') {
                        this.preview = true
                        this.shareUrl = '?path=/pages/planning/article&id=' + this.form._id
                    }
                    if (tar == 'save') { // 保存
                        this.$message.success("保存成功");
                        // uni.removeStorageSync('zts_poi_edit')
                        // setTimeout(() => {
                        // 	// this.$router.back();
                        // 	this.$router.push({
                        // 		path:'/pages/zts/poi/list',
                        // 		query:{
                        // 			refresh:true
                        // 		}
                        // 	})
                        // }, 500)
                    }
                });
            }
        },
        back() {
            this.$router.back();
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    .scroller {
        padding: 10px;
        border: 1px solid #dcdfe6;
        border-radius: 3px;

        box-sizing: border-box;
        overflow-x: hidden;
        height: calc(100% - 52px);
    }

    height: calc(100%);
}
</style>
