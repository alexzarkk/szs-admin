<template>
    <div>
        <!-- 审核资源的弹框 -->
        <cl-dialog width="30%" title="审核" :props="{fullscreen:false}" :controls="['close']" :visible.sync="examineVisible">
            <el-form :model="examineObj" ref="examineForm" :rules="rules">
                <!-- 资源名称 -->
                <el-row>
                    <el-col>
                        <el-form-item label="待审核内容名称">
                            <el-input v-model="cur.name||cur.title" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 审核结果   退回，通过  退回原因-->
                <el-row>
                    <el-col>
                        <el-form-item label="审核结果" prop="verified">
                            <el-radio-group v-model="examineObj.status">
                                <el-radio label="4">退回</el-radio>
                                <el-radio label="10">通过</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
				<el-row v-if="examineObj.status==10">
				   	<el-col>
				   		<el-form-item label="整体评分" prop="trackRate">
				   			<el-rate v-model="examineObj.rate" :colors="['#ffaa7f', '#ffa14f', '#ff5500']"></el-rate>
				   		</el-form-item>
				   	</el-col>
				</el-row>
				
                <el-row v-if="examineObj.status==4">
                    <el-col>
                        <el-form-item label="退回原因" prop="reject">
                            <el-input v-model="examineObj.reject" type="textarea" :rows="1" placeholder="请填写退回原因">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <!-- 照片提示 -->
                    <el-col>
                        <el-form-item label="照片">
                            <cl-upload v-model="examineObj.pics" is-space></cl-upload>
                            <cl-pics :pics="examineObj.pics" @updatePic="updatePic"></cl-pics>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- <el-form-item> -->
                <view class="flex justify-end">
                    <el-button size="small" @click="examineVisible = false">取消</el-button>
                    <el-button size="small" type="success" @click="onSubmit">保存</el-button>
                </view>
                <!-- </el-form-item> -->
            </el-form>

        </cl-dialog>
    </div>
</template>

<script>
export default {
    props: {
        cur: {  // 审核的对象 必须包含以下参数 {name,_id,userId}
            type: Object,
            require: true
        },
        // 审核资源对应的请求的内容
        tt: {
            type: String,
            require: true
        },
        // 发短信使用的type
        type: {
            type: String,
            default: ''
        },

        // 自定义处理审核参数
        onDo: Function,
        // 是否发送短信
        sendSMS: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            loading: false,
            examineVisible: false, // 审核对话框的显示控制
            examineObj: {
				remark: '', // 补充内容
				status: '10', // 审核结果
				rate: 0,
				reject: '', // 退回原因
				pics: '', // 照片
				mutiPic: [] // 多张照片的时候
			},
            rules: {
                reject: [
                    {
                        required: true,
                        message: '请填写退回原因！',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },

    watch: {
        cur: {
            deep: true,
            handler(v) {
                if (v._id) {
                    this.examineObj = {
                        remark: '', // 补充内容
                        status: '10', // 审核结果
						rate: 0,
                        reject: '', // 退回原因
                        pics: '', // 照片
                        mutiPic: [] // 多张照片的时候
                    }
                    this.examineVisible = true
                }
            }
        }
    },
    methods: {
        updatePic(picData) {
            if (picData.idx != undefined) {
                this.examineObj.mutiPic[picData.idx].pics = picData.pic
            } else {
                this.examineObj.pics = picData.pic
            }
        },
        // 审核通过
        async onSubmit() {
			let ue = this.$store.getters.dict.ue.tt.find(e=>e.k==this.tt)
			
            const vali = await this.$refs.examineForm.validate()

            if (vali) {
                if (this.onDo) {  // 使用自定义函数来处理审核结果
                    await this.onDo(this.examineObj)
                } else {
                    await this.$service.system.audit.add({
                        ...this.examineObj,
                        tt: ue.value,
                        tid: this.cur._id,
                        status: Number(this.examineObj.status)
                    })

                    this.$message.success("保存成功！")
                    this.$emit('refresh')
                }
                this.examineVisible = false
            }
        }
    }
};
</script>
<style lang="scss" scoped>
	::v-deep .el-form-item {
		display: flex;
		margin-bottom: 22px;
		align-items: center;
	}
</style>