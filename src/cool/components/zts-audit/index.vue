<template>
	<div>
		<!-- 审核资源的弹框 -->
		<cl-dialog width="30%" title="审核" :props="{fullscreen:false}" :controls="['close']" :visible.sync="examineVisible">
			<el-form :model="examineObj" ref="examineForm" :rules="rules">
				<!-- 资源名称 -->
				<el-row>
					<el-col>
						<el-form-item label="资源名称">
							<el-input v-model="cur.name" :disabled="true"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
		
				<!-- 待补充 -->
				<!-- <el-row>
					<el-col>
						<el-form-item label="待补充">
							<el-input v-model="examineObj.remark" type="textarea" :rows="1" placeholder="请输入不合规项(如有)">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row> -->
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
							<!--  -->
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
	data() {
		return {
			loading: false,
			examineVisible: false, // 审核对话框的显示控制
			examineObj: { // 审核内容
				remark: '', // 补充内容
				status: false, // 审核结果
				reject: '', // 退回原因
				pics: '', // 照片
				mutiPic: [] // 多张照片的时候
			
			},
			rules:{
				reject:[
					{
						required:true,
						message:'请填写退回原因。',
						trigger:'blur'
					}
				]
			}
		};
	},
	props: {
		cur: { type: Object },
		tar: { type: String },
		type:{ type: String, default: '' },
		onDo: Function
	},
	watch: {
		cur: {
			deep:true,
			handler(v) {
				if(v._id) {
					this.examineObj = {
						remark: '', // 补充内容
						status: false, // 审核结果
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
			const vali = await this.$refs.examineForm.validate()
			if(!vali){
				
			}else{
				if(this.onDo) {
					await this.onDo(this.examineObj)
				} else {
					await this.$service.zts[this.tar].update({ // 更新状态
						status: Number(this.examineObj.status),
						_id: this.cur._id
					})
					this.$message.success("保存成功！")
					this.$emit('refresh')
					
					let log = {
						tar: '数据审核('+(this.examineObj.status==4?'退回':'通过')+')',
						event: 'veryfy',
						user: this.$store.getters.userInfo.name, // 用户名
						name: this.cur.name,  // 当前审核的资源名称
						status: Number(this.examineObj.status), //  审核的状态
						verResult: this.examineObj
					}
					log[this.tar+'Id'] = this.cur._id
					this.$service.zts.log.add(log)
					
					// 14865 数据审核 - 退回	通知类	【环浙采集】您申报的 “${name}” 数据因 ${content} 未通过审核，请尽快补充
					// 15288 数据审核 - 通过	通知类	【环浙采集】您申报的 “${name}” 数据已通过审核
					this.$service.zts.log.sms({  // 发送短信
						userId: this.cur.userId,
						name: this.type+'('+this.cur.name+')',
						templateId:this.examineObj.status==4?'14865':'15288',
						content: this.examineObj.status==4? this.examineObj.reject:''
					})
				}
				this.examineVisible = false
			}
		}
	}
};
</script>
<style lang="scss" scoped>

</style>