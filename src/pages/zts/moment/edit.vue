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
                        <el-col :span="6">
                            <el-form-item label="来源" prop="origin">
                                <el-input size="small" v-model="form.origin"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="作者" prop="author">
                                <el-input size="small" v-model="form.author"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="发布时间" prop="createTime">
                                <el-date-picker size="small" v-model="form.createTime" :value-format="'yyyy-MM-dd HH:mm:ss'" type="datetime"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="类型" prop="type">

                        <el-checkbox-group size="small" v-model="form.type">
                            <block v-for="(t, index) in $store.getters.dict.article" :key="index">
                                <el-checkbox :label="t.value">{{t.label}}</el-checkbox>
                            </block>
                        </el-checkbox-group>

                    </el-form-item>

                    <el-row>
                        <el-col :span="4">
                            <el-form-item label="发布区域" prop="pub">
                                <el-radio-group size="small" v-model="form.pub">
                                    <block v-for="(t, index) in tar" :key="index">
                                        <el-radio-button :label="t.value">{{t.text}}</el-radio-button>
                                    </block>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
						<el-col :span="20">
						    <block v-if="form.pub==1">
						        <el-form-item label="" prop="deptId">
						            <cl-dept-cascader :id="form.deptId" @input="setRegion" />
						        </el-form-item>
						    </block>
						</el-col>
                    </el-row>

                    <el-form-item label="封面" prop="cover">
						<cl-upload :value="form.cover.url" @input="setCover" :limit="1"></cl-upload>
                        <el-input size="small" v-model="form.cover.desc" placeholder="封面信息"></el-input>
                    </el-form-item>
                    
                    <el-row>
                    	<el-col :span="form.video.url?16:8">
                    		<el-form-item label="视频">
                    			<cl-upload :value="form.video.url" @input="setVideo" :limit="1" :fileType="'video'"></cl-upload>
                    			<view v-if="form.video.url">
                    				<el-input size="small" v-model="form.video.desc" placeholder="视频说明"></el-input>
                    			</view>
                    		</el-form-item>
                    	</el-col>
                    	<el-col v-if="!form.video.url" :span="16">
                    		<view class="flex align-center">
                    			<text class="text-red">*</text>
                    			<text class="text-gray text-sm">照片或视频请在本地进行压缩后再上传
                    				<text class="padding-left-xs"></text>
                    				<el-link type="primary" href="https://zts.5618.co/repo/JPEGResizer.zip" target="_blank">照片压缩工具下载</el-link>
                    				<text class="padding-left-xs"></text>
                    				<el-link type="primary" href="https://zts.5618.co/repo/HandBrake-1.3.3-x86_64-Win_GUI.exe" target="_blank">视频压缩工具下载</el-link>
                    				<text class="padding-left-xs"></text>
                    				<el-link type="primary" href="https://vvideo.vip" target="_blank">视频网站搬运解码</el-link>
                    			</text>
                    		</view>
                    	</el-col>
                    </el-row>

                    <el-form-item label="简介" prop="desc">
                        <el-input type="textarea" v-model="form.desc" placeholder="请输入6-200个字的简介信息"></el-input>
                    </el-form-item>

                    <el-form-item label="详情" prop="content">
                        <cl-editor-tinymce v-if="timTimer" v-model="form.content" :options="{height:600}"></cl-editor-tinymce>
                    </el-form-item>

                </el-form>
            </div>
            <view class="flex justify-center align-center">
            	<view class="flex-twice">
            		<el-link v-if="updateTime" type="info">自动保存：{{updateTime}}</el-link>
            	</view>
            	<view class="flex-twice padding-top-xs">
            		<el-button size="small" type="info" @click="back('view')">返 回</el-button>
            		<el-button size="small" type="success" @click="submitForm('view')">预 览</el-button>
            		<el-button size="small" type="primary" @click="submitForm('save')">保 存</el-button>
            	</view>
            </view>
        </div>

    </cl-layout>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            loading: true,
            timTimer: null,
            updateTime: '',

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
				deptId: [{
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
        ...mapGetters(['userInfo'])
    },
    activated() {
        this.init()
    },
    deactivated() {
        this.clearTim()
    },
    mounted() {
        this.init()
    },
    methods: {
        async init() {
            this.form = {
                title: '',
				author: '',
                type: [],
                coord: [],
                cover: {},
                video: {},
				pub: 0,
                desc: '',
                content: '',
                status: 1,
				deptId: this.userInfo.departmentId,
                userId: this.userInfo._id
            }
            this.loading = true
            let id = uni.getStorageSync('article_edit')
            if (!id) {
                await this.$service.zts.article.page({ userId: this.userInfo._id, status: 1 }).then(res => {
                    if (res.list.length) {
                        Object.assign(this.form, res.list[0])
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
				Object.assign(this.form, await this.$service.zts.article.info({ id }))
            }
            this.autoUpdate()
            this.loading = false
        },
        // 开启自动保存
        autoUpdate() {
            if (this.timTimer) this.clearTim()
            this.timTimer = setInterval(() => {
                this.save()
            }, 40000)
        },
        // 清除自动保存的定时器
        clearTim() {
            clearInterval(this.timTimer)
            this.timTimer = null
            this.updateTime = ''
        },
        setRegion(e) {
            this.form.deptId = e[e.length - 1] + ''
        },

        setCover(e) { this.form.cover.url = e },
        setVideo(e) { this.form.video.url = e },
		
		async save(){
			await this.$service.zts.article.update({ ...this.form })
			this.updateTime = this.zz.time2Date()
		},
        async submitForm(tar) {
			let veri = await this.$refs.form.validate()
			if (veri) {
				this.loading = true
				await this.save()
				this.loading = false

				//预览
				if (tar == 'view') {
					this.zz.preview({path:'/pages/planning/article', id: this.form._id})
				}
				// 保存
				if (tar == 'save') { 
					this.$message.success("保存成功")
				}
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
