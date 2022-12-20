<template>
		<div class="home" v-if="kml" v-loading="loading">
			<cl-scrollbar>
			<el-row :gutter="15">
				<el-col :lg="12" :xs="24">
					
					<el-row :gutter="15">
						<el-col v-if="kml">
							<collect-info :kml="kml"></collect-info>
							
							<block v-if="chart">
								<el-divider content-position="left">轨迹数据</el-divider>
								<text class="text-sm padding-left-xs text-grey">采集长度：</text>
								<text class="text-sm text-orange text-bold">{{chart.line.len}}m</text>
								
								<text class="text-sm padding-left-xs text-grey">海拔：<text class="cuIcon-top"></text></text>
								<text class="text-sm text-orange text-bold">{{line.info.top}}m</text>
								<text class="text-sm text-grey"><text class="cuIcon-down"></text></text>
								<text class="text-sm text-orange text-bold">{{line.info.bottom}}m</text>
								
								<text class="text-sm padding-left-xs text-grey">累计：<i class="header-icon el-icon-top"></i></text>
								<text class="text-sm text-orange text-bold">{{line.info.up}}m</text>
								<text class="text-sm text-grey"><i class="header-icon el-icon-bottom"></i></text>
								<text class="text-sm text-orange text-bold">{{line.info.down}}m</text>
								
								<el-divider ></el-divider>
								
								<el-row :gutter="15">
									<el-col :lg="12" :xs="20">
										<div class="card">
											<line-detail :title="'路体类型'" :data="chart.kType"></line-detail>
										</div>
									</el-col>
									<el-col :lg="12" :xs="20">
										<div class="card">
											<line-detail :title="'路况等级'" :data="chart.kLevel"></line-detail>
										</div>
									</el-col>
								</el-row>
								<el-divider content-position="left">坐标数据</el-divider>
								<el-row>
									<el-col>
										<div class="card">
											<poi-detail :data="chart.poi"></poi-detail>
										</div>
									</el-col>
								</el-row>
							</block>
							
						</el-col>
					</el-row>
					
				</el-col>
				<el-col :lg="12" :xs="24">
					
					<el-row :gutter="15">
						<el-col>
							<el-descriptions class="bg-grey padding-lr padding-top-xs text-center" title="审核评分" :extra="'审核员：'+userInfo.name" :column="2"  border>
							</el-descriptions>
							<el-form ref="form" :disabled="saved" size="mini" class="bg-gray light padding-xs margin-top-xs" :rules="rules" :model="t" :label-width="'auto'">
								<el-divider content-position="center"><el-link type="info" disabled>轨迹类</el-link></el-divider>
								<el-row>
									<el-col>
										<el-form-item label="完整度">
											<!-- <el-tooltip class="item" effect="light" content="轨迹是否完整，是否连续;漂移点是否有修正"> -->
												<el-input v-model="t.track" type="textarea" :rows="1" placeholder="请输入不合规项(如有)"></el-input>
											<!-- </el-tooltip> -->
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col>
										<el-form-item label="路况类型">
											<el-input v-model="t.routeType" type="textarea" :rows="1" placeholder="请输入不合规项(如有)"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								
								<el-row>
									<el-col>
										<el-form-item label="等级分类">
											<el-input v-model="t.routeLevel" type="textarea" :rows="1" placeholder="请输入不合规项(如有)"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								
								
								<el-divider content-position="center"><el-link type="info" disabled>附加信息</el-link></el-divider>
								<el-row>
									<el-col>
										<el-form-item label="地名或兴趣点"  :label-width="'120px'" prop="poiRate">
											<el-radio-group v-model="t.poiRate">
											    <el-radio :label="1">无</el-radio>
											    <el-radio :label="3">欠缺</el-radio>
											    <el-radio :label="5">齐全</el-radio>
											  </el-radio-group>
											<el-input v-if="t.poiRate<5" v-model="t.poi" type="textarea" :rows="1" placeholder="请输入不合规项(如有)"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col>
										<el-form-item label="服务设施" prop="servePoiRate">
											<el-radio-group v-model="t.servePoiRate">
											    <el-radio :label="1">无</el-radio>
											    <el-radio :label="3">有</el-radio>
											  </el-radio-group>
											<el-input v-model="t.servePoi" type="textarea" :rows="1" placeholder="请输入不合规项(如有)"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								
								
								<el-divider content-position="center"><el-link type="info" disabled>标牌配置</el-link></el-divider>
								<el-row>
									<el-col>
										<el-form-item label="配置合理性" prop="sResonRate">
											<el-radio-group v-model="t.sResonRate">
											    <el-radio :label="1">有疑问</el-radio>
											    <el-radio :label="3">一般</el-radio>
											    <el-radio :label="5">合理</el-radio>
											  </el-radio-group>
											<el-input v-if="t.sResonRate<3" v-model="t.sReson" type="textarea" :rows="1" placeholder="请输入不合规项(如有)"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col>
										<el-form-item label="齐全度" prop="sFullRate">
											<el-radio-group v-model="t.sFullRate">
											    <el-radio :label="1">无</el-radio>
											    <el-radio :label="3">欠缺</el-radio>
											    <el-radio :label="5">齐全</el-radio>
											  </el-radio-group>
											<el-input v-if="t.sFullRate<5" v-model="t.sFull" type="textarea" :rows="1" placeholder="请输入不合规项(如有)"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								
								<el-row>
									<el-col>
										<el-form-item label="照片" prop="sPhotoRate">
											<el-radio-group v-model="t.sPhotoRate">
												<el-radio :label="1">无</el-radio>
												<el-radio :label="3">欠缺</el-radio>
												<el-radio :label="5">齐全</el-radio>
											 </el-radio-group>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col>
										<el-form-item label="反馈意见">
											<el-input v-model="t.signFeeadback" type="textarea" :rows="1" placeholder="请输入不合规项(如有)"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								
								<el-divider content-position="center"><el-link type="info" disabled>指引柱配置</el-link></el-divider>
								<el-row>
									<el-col>
										<el-form-item label="齐全度" prop="dRate">
											<el-radio-group v-model="t.dRate">
											    <el-radio :label="1">无</el-radio>
											    <el-radio :label="3">欠缺</el-radio>
											    <el-radio :label="5">齐全</el-radio>
											  </el-radio-group>
											<el-input v-if="t.dRate<5" v-model="t.direct" type="textarea" :rows="1" placeholder="请输入不合规项(如有)"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-divider content-position="left"><el-link type="info" disabled>异常柱</el-link></el-divider>
								<block v-for="(e,i) in t.derr" :key="i">
									<el-divider v-if="i"></el-divider>
									<el-row>
										<el-col :span="12">
											<el-form-item label="柱号">
												<el-input v-model="e.name" placeholder="请输入指引柱编号"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="12">
											<el-form-item label="异常项">
												
												<el-select v-model="e.errs" multiple placeholder="请选择">
												    <el-option
														v-for="k in err" :key="k" :label="k" :value="k">
												    </el-option>
												</el-select>
												
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col>
											<el-form-item label="说明">
												<el-input v-model="e.desc" type="textarea" :rows="1" placeholder="请输入不合规项(如有)"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col>
											<el-form-item label="照片">
												<cl-upload v-model="e.pics" is-space></cl-upload>
												<cl-pics :pics="e.pics" :idx="i" @updatePic="updatePic"></cl-pics>
											</el-form-item>
										</el-col>
									</el-row>
								</block>
								
								<el-row>
									<el-col :span="24">
										<view class="flex justify-center">
											<el-button v-if="t.derr.length" type="warning" size="mini" icon="el-icon-delete" @click="delErr">删除</el-button>
											<el-tooltip class="item" effect="dark" content="添加异常柱" placement="top">
												<el-button type="success" size="mini" icon="el-icon-plus" @click="addErr">添加</el-button>
											</el-tooltip>
										</view>
									</el-col>
								</el-row>
								
								<el-divider content-position="center"><el-link type="info" disabled>其它项</el-link></el-divider>
								<el-row>
									<el-col>
										<el-form-item label="待补充">
											<el-input v-model="t.desc" type="textarea" :rows="1" placeholder="请输入不合规项(如有)"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col>
										<el-form-item label="照片">
											<cl-upload v-model="t.pics" is-space></cl-upload>
											<cl-pics :pics="t.pics" @updatePic="updatePic"></cl-pics>
										</el-form-item>
										
									</el-col>
								</el-row>
								<el-row>
									<el-col>
										<el-form-item label="整体评分" prop="trackRate">
											<el-rate v-model="t.trackRate" :colors="colors"></el-rate>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col>
										<el-form-item label="审核结果" prop="verified">
											<el-radio-group v-model="t.verified">
												<el-radio label="4">退回</el-radio>
												<el-radio label="10">通过</el-radio>
											</el-radio-group>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row v-if="t.verified==4">
									<el-col>
										<el-form-item label="退回原因" prop="reject">
											<el-input v-model="t.reject" placeholder="请输入退回原因"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								
							</el-form>
							
						</el-col>
					</el-row>
					
					<view class="flex justify-end align-start">
						<view class="padding-tb-xs">
							<el-button type="primary" :loading="onSaving" :disabled="saved" @click="save('save')">保 存</el-button>
						</view>
					</view>
				</el-col>
			</el-row>
			
			</cl-scrollbar>
		</div>
</template>

<script>
	
import { mapGetters } from 'vuex';
import { getLable } from "@/config/dict";
import { kmlChart, dict } from '@/cool/utils/pmCurd';

import CollectInfo from "./component/collect-info";
import LineDetail from "../report/components/line-detail";
import PoiDetail from "../report/components/poi-detail";

export default {
	components: {
		CollectInfo,
		LineDetail,
		PoiDetail
	},
	data() {
		return {
			loading: true,
			kml: null,
			chart: null,
			colors: ['#ffaa7f', '#ffa14f', '#ff5500'],
			
			onSaving: false,
			saved: false,
			err:['方位角','指向角','指向地位置','照片'],
			
			t: {
				// track: '',
				// routeType: '',
				// routeLevel: '',
				// trackRate: 0,
				
				// poiRate: 0,
				// poi: '',
				// servePoiRate: 0,
				// servePoi: '',
				
				// sResonRate: 0,
				// sReson: '',
				// sFullRate: 0,
				// sFull: '',
				// sPhotoRate: 0,
				// signFeeadback: '',
				
				// dRate: 0,
				// direct: '',
				
				derr:[],
				pics: ''
			},
			rules: {
				trackRate: [{ required: true, message: '请选择轨迹评分', trigger: ['blur', 'change']}],
				poiRate: [{ required: true, message: '请选择地名或兴趣点评分', trigger: ['blur', 'change'] }],
				servePoiRate: [{ required: true, message: '请选择服务设施评分', trigger: ['blur', 'change'] }],
				sResonRate: [{ required: true, message: '请选择标牌合理性评分', trigger: ['blur', 'change'] }],
				sFullRate: [{ required: true, message: '请选择标牌齐全度评分', trigger: ['blur', 'change'] }],
				sPhotoRate: [{ required: true, message: '请选择标牌照片评分', trigger: ['blur', 'change'] }],
				dRate: [{ required: true, message: '请选择指引柱配置评分', trigger: ['blur', 'change'] }],
				verified: [{ required: true, message: '请选择审核结果', trigger: ['blur', 'change'] }],
				reject: [{ required: true, message: '请输入退回原因', trigger: ['blur', 'change'] }],
			},
		};
	},
	computed: {
		...mapGetters(['lay','userInfo'])
	},
	mounted(){
		let id = uni.getStorageSync('collect_check')
		
		this.$service.zts.kml.info({ id }).then((o) => {
			o.dept = getLable(o.departmentId)
			console.log(o);
			this.kml = o
			let line = o.children[0].children[0]
			if(!line.coord) line = line.children[0].children[0]
			this.line = line
			console.log(this.line);
			
			this.chart = kmlChart(this.kml.children)
			if(o.status!=6){
				this.$message.error("此数据已经审核！")
				this.saved = true
			}
			
			this.loading = false
		})
	},
	methods: {
		getText(n,v){
			let t = getText(n,v)
			return t.label||t.text
		},
		addErr(e){
			this.t.derr.push({
					name:'',
					errs:[],
					pics:'',
				})
		},
		delErr(){
			this.t.derr.splice(this.t.derr.length-1,1)
		},
		updatePic(picData){
			if(picData.idx!=undefined) {
				this.t.derr[picData.idx].pics = picData.pic
			} else {
				this.t.pics = picData.pic
			}
		},
		
		async save(){
			console.log('saving--------',this.t);
			let veri = false
			this.$refs.form.validate((valid) => { veri = valid })
			for (let s of this.t.derr) {
				if(!s.name||!s.errs.length) return this.$message.error("完善异常柱信息！")
			}
			if(veri) {
				this.onSaving = true
				await this.$service.zts.kml.verify({   // 更新状态
					status: Number(this.t.verified),
					rate: this.t.trackRate,
					_id: this.kml._id
				}).catch((err) => {
					return this.$message.error(err)
				})
				await this.$service.zts.log.add({  // 添加操作日志
					tar: '采集审核('+(this.t.verified==4?'退回':'通过')+')',
					event: 'veryfy',
					kmlId: this.kml._id,
					name: this.kml.name,
					user: this.userInfo.name,
					status: Number(this.t.verified),
					verResult: this.t
				})
				await this.$service.zts.log.sms({  // 发送短信
					phone: this.kml.collectortel,
					name: this.kml.name,
					templateId: this.t.verified==4?'12696':'12652',
					content: this.t.reject,
				})
				this.kml.status = Number(this.t.verified)
				uni.setStorageSync('collect_check', this.kml)
				this.$message.success("保存成功")
				this.saved = true
				this.onSaving = false
			}
		}
	}
};
</script>
<style lang="scss" scoped>
.home {
	height: 100%;
	overflow: hidden auto;
	padding: 12px;
}
</style>