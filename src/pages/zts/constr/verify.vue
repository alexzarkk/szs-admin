<template>
	<div class="home"  v-if="kml" v-loading="loading">
			<el-row :gutter="15">
				<el-col :lg="12" :xs="24">
					<scroll-view class="solid" :scroll-y="true" :style="'height:'+ winH + 'px'">
						
						<el-row :gutter="15">
							<view v-if="cur" class="margin">
								<el-descriptions title="基本信息" :column="3" border>
									<el-descriptions-item label="路段名称">{{ cur.name }}</el-descriptions-item>
									<el-descriptions-item label="线路等级">{{ $store.getters.dictObj.kmlGrade[cur.grade].label }}</el-descriptions-item>
									<el-descriptions-item label="归属部门">{{ $store.getters.dictObj.deps[cur.deptId].name }}</el-descriptions-item>
									<el-descriptions-item label="线路长度">{{ cur.len }}m</el-descriptions-item>
									<el-descriptions-item label="投建金额">{{ cur.invest }}万元</el-descriptions-item>
									<el-descriptions-item label="填报人">{{ cur.user }}</el-descriptions-item>
								</el-descriptions>
								<view class="margin-top-xs"></view>
								<el-descriptions title="标牌配置" :column="3" border>
									<el-descriptions-item label="入口引导牌">{{ cur.t21.total||0 }}</el-descriptions-item>
									<el-descriptions-item label="主信息牌">{{ cur.t22.total||0 }}</el-descriptions-item>
									<el-descriptions-item label="二级信息牌">{{ cur.t23.total||0 }}</el-descriptions-item>
									<el-descriptions-item label="禁止牌">{{ cur.t25.total||0 }}</el-descriptions-item>
									<el-descriptions-item label="警示牌">{{ cur.t26.total||0 }}</el-descriptions-item>
									<el-descriptions-item label="提示牌">{{ cur.t27.total||0 }}</el-descriptions-item>
									<el-descriptions-item label="标距柱">{{ cur.t28.total||0 }}</el-descriptions-item>
									<el-descriptions-item label="指引柱">{{ cur.t29.total||0 }}</el-descriptions-item>
								</el-descriptions>
								
								<block v-for="(log, idx) of cur.logs" :key="idx">
									<view class="margin-top-xs"></view>
									<el-descriptions :title="(log.status==20?'开':'完')+'工报告'" :column="2"  border>
										<el-descriptions-item label="开工日期">{{ log.ondate[0] }}</el-descriptions-item>
										<el-descriptions-item :label="(log.status==20?'拟完':'完')+'工日期'">{{ log.ondate[1] }}</el-descriptions-item>
										<el-descriptions-item label="技术指导单位">{{ log.observer }}</el-descriptions-item>
										<el-descriptions-item label="路体建设单位">{{ log.constor }}</el-descriptions-item>
										<el-descriptions-item label="标牌供应商单位">{{ log.sign }}</el-descriptions-item>
										<el-descriptions-item label="标牌安装单位">{{ log.setter }}</el-descriptions-item>
										<el-descriptions-item label="备注">{{ log.desc }}</el-descriptions-item>
										<el-descriptions-item label="填报日期">{{ log.time }}</el-descriptions-item>
										<el-descriptions-item label="填报人">{{ log.user }}</el-descriptions-item>
									</el-descriptions>
									<el-divider content-position="left">纸质报告(照片)</el-divider>
									<block v-if="log.imgs.length">
										<block v-for="(t, i) of log.imgs" :key="i">
											<el-image style="width: 100px; height: 100px" :src="t" :preview-src-list="log.imgs"></el-image>
										</block>
									</block>
									<block v-else>
										<el-divider content-position="center">未上传</el-divider>
									</block>
									
								</block>
							</view>
							
							<el-col v-if="kml9">
								<block v-if="chart">
									<el-divider content-position="left">建设前采集数据</el-divider>
									<view class="margin-sm"><collect-info :kml="kml9"></collect-info></view>
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
									
									<el-row>
										<el-col>
											<div class="card">
												<line-detail :title="'路体类型'" :data="chart.kType"></line-detail>
											</div>
										</el-col>
										
									</el-row>
									<el-row>
										<el-col>
											<div class="card">
												<line-detail :title="'路况等级'" :data="chart.kLevel"></line-detail>
											</div>
										</el-col>
									</el-row>
									
								</block>
							</el-col>
						</el-row>
					</scroll-view>
				</el-col>
				<el-col :lg="12" :xs="24">
					<scroll-view class="solid" :scroll-y="true" :style="'height:'+ (winH-60) + 'px'">
					<el-row :gutter="15">
						<el-col>
							<el-descriptions class="bg-grey padding-lr padding-top-xs text-center" title="审核评分" :extra="'审核员：'+userInfo.name" :column="2"  border>
							</el-descriptions>
							<view class="margin-top-sm">
								<el-descriptions title="巡线报告" :column="2" border>
									<el-descriptions-item label="开始时间">{{ kml.startTime }}</el-descriptions-item>
									<el-descriptions-item label="结束时间">{{ kml.endTime }}</el-descriptions-item>
									<el-descriptions-item label="巡线人">{{ kml.userInfo.name }}</el-descriptions-item>
									<el-descriptions-item label="随机检查点">{{ kml.cps }}</el-descriptions-item>
								</el-descriptions>
							</view>
							
							<el-form ref="form" :disabled="saved" size="mini" class="bg-gray light padding-xs margin-top-xs" :rules="rules" :model="t" :label-width="'auto'">
								
								<el-divider content-position="center"><el-link type="info" disabled>路体建设</el-link></el-divider>
								<el-row>
									<el-col>
										<el-form-item label="路面处理" prop="trackRate">
											<el-radio-group v-model="t.trackRate">
											    <el-radio :label="1">未处理</el-radio>
											    <el-radio :label="3">欠缺</el-radio>
											    <el-radio :label="5">达标</el-radio>
											</el-radio-group>
											<view class="text-gray text-sm">
												① 天然砂土路面或人工修筑路体，人工修筑路体符合生态环保施工原则，材料以就地取材，可以是土质、草质、腐殖质、落叶、碎石、砂石等材料，部分古道或高人流路段可使用石块铺筑路面。
											</view>
											<view class="text-gray text-sm">
												② 路面坚实、稳固、平整，无明显植被侵占，通过性好。
											</view>
											<view class="text-gray text-sm">
												③ 路体上方净空间充足，无横梁、藤蔓、树枝等障碍物。
											</view>
											  
											<el-input v-if="t.trackRate<5" v-model="t.track" type="textarea" :rows="1" placeholder="请输入不合规项(如有)"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col>
										<el-form-item label="陡坡处理" prop="slopeRate">
											<el-radio-group v-model="t.slopeRate">
											   <el-radio :label="0">不涉及</el-radio>
											   <el-radio :label="1">未处理</el-radio>
											   <el-radio :label="3">不达标</el-radio>
											   <el-radio :label="5">达标</el-radio>
											</el-radio-group>
											
											<view class="text-gray text-sm">
											  	① 纵向坡度大于12%时，已作梯步或“之”字迂回，梯步最大高度25cm以内，平均高度差10%以内，最小梯面不低于30cm。
											</view>
											<view class="text-gray text-sm">
											  	② 梯步的制作材料应就地取材，梯面应采用防腐的树木或石块，两侧应固定。
											</view>
											<view class="text-gray text-sm">
											  	③ 最大断面坡度不超过15%。
											</view>
											<el-input v-if="t.slopeRate&&t.slopeRate<=3" v-model="t.slope" type="textarea" :rows="1" placeholder="请输入不合规项(如有)"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col>
										<el-form-item label="河道/溪谷" prop="riverRate">
											<el-radio-group v-model="t.riverRate">
											   <el-radio :label="0">不涉及</el-radio>
											   <el-radio :label="1">未处理</el-radio>
											   <el-radio :label="3">不达标</el-radio>
											   <el-radio :label="5">达标</el-radio>
											</el-radio-group>
											
											<view class="text-gray text-sm">
											  	采用汀步或木便桥或涵道方式
											</view>
											<el-input v-if="t.riverRate&&t.riverRate<=3" v-model="t.river" type="textarea" :rows="1" placeholder="请输入不合规项(如有)"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col>
										<el-form-item label="岩壁/侧崖" prop="cliffRate">
											<el-radio-group v-model="t.cliffRate">
											   <el-radio :label="0">不涉及</el-radio>
											   <el-radio :label="1">未处理</el-radio>
											   <el-radio :label="3">不达标</el-radio>
											   <el-radio :label="5">达标</el-radio>
											</el-radio-group>
											
											<view class="text-gray text-sm">
											  	岩壁和陡峭岩体时辅以人工设施以保证安全，材料以不宜腐败的金属为主，可以是扶手、抓手、铁链等形式安装
											</view>
											<el-input v-if="t.cliffRate&&t.cliffRate<=3" v-model="t.cliff" type="textarea" :rows="1" placeholder="请输入不合规项(如有)"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								
								
								<el-divider content-position="center"><el-link type="info" disabled>标牌系统</el-link></el-divider>
								<el-row>
									<el-col>
										<el-form-item label="配置合理性" prop="signCfgRate">
											<el-radio-group v-model="t.signCfgRate">
											    <el-radio :label="0">不涉及</el-radio>
											    <el-radio :label="3">欠缺</el-radio>
											    <el-radio :label="5">合理</el-radio>
											</el-radio-group>
											<view class="text-gray text-sm">
											  	<b>主信息牌—</b>步道主要起终点、服务中心、停车场等人流易集中位置。
											</view>
											<view class="text-gray text-sm">
											  	<b>次级信息牌—</b>途经的休息点、垭口、特色的自然或人文点。
											</view>
											<view class="text-gray text-sm">
											  	<b>出入口引导牌—</b>主要的交通入口处，途经重要的分岔口。
											</view>
											<view class="text-gray text-sm">
											  	<b>警示/提示牌—</b>陡坡、落石、悬崖、禁行等安全隐患路段。安全、环保等相关提示性标识。
											</view>
											
											<el-input v-if="t.signCfgRate==3" v-model="t.signCfg" type="textarea" :rows="1" placeholder="请输入不合规项(如有)"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col>
										<el-form-item label="选址要求" prop="signPositionRate">
											<el-radio-group v-model="t.signPositionRate">
											    <el-radio :label="0">不涉及</el-radio>
											    <el-radio :label="3">欠缺</el-radio>
											    <el-radio :label="5">达标</el-radio>
											  </el-radio-group>
											 <view class="text-gray text-sm">
											   	<b>展示性—</b>选址位置具有较好的展示性，评估人流走向选择周边无明显遮挡物区域。
											 </view>
											 <view class="text-gray text-sm">
											   	<b>安全性—</b>用户的阅读站位安全，站位区域避免交通道、上下坎、危险水域等。
											 </view>
											 <view class="text-gray text-sm">
											   	<b>景观性—</b>和周围环境协调统一，融合度高，旁边无厕所、垃圾点等设施。
											 </view>
											 <view class="text-gray text-sm">
											   	<b>不冲突—</b>无重要景观和设施的遮挡，如交通导示、消防设施等。
											 </view>
											<el-input v-if="t.signPositionRate==3" v-model="t.signPosition" type="textarea" :rows="1" placeholder="请输入不合规项(如有)"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								
								<el-row>
									<el-col>
										<el-form-item label="制作要求" prop="signProdRate">
											<el-radio-group v-model="t.signProdRate">
												<el-radio :label="0">不涉及</el-radio>
												<el-radio :label="3">欠缺</el-radio>
												<el-radio :label="5">达标</el-radio>
											 </el-radio-group>
											 <view class="text-gray text-sm">
											   	<b>整体风格—</b>风格样式符合《环浙步道VI》要求。
											 </view>
											 <view class="text-gray text-sm">
											   	<b>制图规范—</b>有地形图，有介绍，有图例，地名使用规范。
											 </view>
											 <view class="text-gray text-sm">
											   	<b>材料—</b>标牌制作材料应选用天然环保材料。
											 </view>
											 <view class="text-gray text-sm">
												<b>信息化—</b>标牌有独立的信息化（二维码）。
											 </view>
											 <el-input v-if="t.signProdRate==3" v-model="t.signProd" type="textarea" :rows="1" placeholder="请输入不合规项(如有)"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col>
										<el-form-item label="安装要求" prop="signSetRate">
											<el-radio-group v-model="t.signSetRate">
											    <el-radio :label="0">不涉及</el-radio>
											    <el-radio :label="3">欠缺</el-radio>
											    <el-radio :label="5">达标</el-radio>
											  </el-radio-group>
											  <view class="text-gray text-sm">
												安装牢固，无倾斜。安装基础已做好覆土复绿。
											  </view>
											<el-input v-if="t.signSetRate==3" v-model="t.signSet" type="textarea" :rows="1" placeholder="请输入不合规项(如有)"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								
								<el-row>
									<el-col>
										<el-form-item label="整体评分" prop="constrRate">
											<el-rate v-model="t.constrRate" :colors="colors"></el-rate>
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
											<el-input type="textarea" v-model="t.reject" placeholder="请输入退回原因"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								
							</el-form>
							
						</el-col>
					</el-row> 
					</scroll-view>
					
					<view class="flex justify-center align-start">
						<view class="padding-tb-xs">
							<el-button type="primary" :loading="onSaving" :disabled="saved" @click="save('save')">保 存</el-button>
						</view>
					</view>
					
				</el-col>
			</el-row>
		
		</div>
</template>

<script>
	
import { mapGetters } from 'vuex'
import { kmlChart } from '@/cool/utils/pmCurd'
import { calData } from '@/comm/geotools'

import CollectInfo from "../collect/component/collect-info";
import LineDetail from "../report/components/line-detail"
import PoiDetail from "../report/components/poi-detail"

export default {
	components: {
		CollectInfo, LineDetail, PoiDetail
	},
	data() {
		return {
			winH: window.innerHeight-40,
			loading: true,
			cur: null,
			kml: null,
			kml9: null,
			chart: null,
			colors: ['#ffaa7f', '#ffa14f', '#ff5500'],
			
			onSaving: false,
			saved: false,
			
			t: {},
			rules: {
				trackRate: [{ required: true, message: '请选择路面处理评分', trigger: ['blur', 'change'] }],
				slopeRate: [{ required: true, message: '请选择陡坡处理评分', trigger: ['blur', 'change'] }],
				riverRate: [{ required: true, message: '请选择河道/溪谷处理评分', trigger: ['blur', 'change'] }],
				cliffRate: [{ required: true, message: '请选择岩壁/侧崖处理评分', trigger: ['blur', 'change'] }],
				
				signCfgRate: [{ required: true, message: '请选择标牌配置合理性评分', trigger: ['blur', 'change'] }],
				signPositionRate: [{ required: true, message: '请选择标牌选址评分', trigger: ['blur', 'change'] }],
				signProdRate: [{ required: true, message: '请选择标牌制作评分', trigger: ['blur', 'change'] }],
				signSetRate: [{ required: true, message: '请选择标牌安装评分', trigger: ['blur', 'change'] }],
				
				constrRate: [{ required: true, message: '请选择整体建设实施评分', trigger: ['blur', 'change']}],
				verified: [{ required: true, message: '请选择审核结果', trigger: ['blur', 'change'] }],
				reject: [{ required: true, message: '请输入退回原因', trigger: ['blur', 'change'] }]
			},
		};
	},
	computed: {
		...mapGetters(['lay','userInfo'])
	},
	async mounted(){
		window.addEventListener('resize',()=>{
			this.winH = window.innerHeight-40
		})
		
		let kml40 = await this.$service.zts.kml.info({ id: uni.getStorageSync('constr_kml'), ui: true })
		this.kml = kml40
		let line = kml40.children.find(e=>e.t2==10)
		line.info = calData(line.coord)
		this.line = line
		
		if(kml40.status!=6){
			this.$message.error("此数据已经审核！")
			this.saved = true
		}
		
		let { list } = await this.$service.zts.layout.page({ _id: kml40.layId, children:true,cst:[40] })
		let kml9 = await this.$service.zts.kml.info({ id: list[0].kmlId })
		
		list[0].logs = await this.$service.zts.layLog.list({ constrId: kml40.layId })
		
		this.kml9 = kml9
		this.chart = kmlChart(kml9.children)
		this.cur = list[0]
		this.kml9 = kml9
		
		console.log(list, kml9, kml40);
		
		this.loading = false
	},
	methods: {
		async save(){
			console.log('saving--------',this.t,this.userInfo,this.$store.getters.dictObj.ue);
			let veri = false
			this.$refs.form.validate((valid) => { veri = valid })
			if(veri) {
				this.onSaving = true
				await this.$service.zts.kml.verify({   // 更新状态
					status: Number(this.t.verified),
					rate: this.t.constrRate,
					_id: this.kml._id
				}).catch((err) => {
					return this.$message.error(err)
				})
				await this.$service.zts.log.add({  // 添加操作日志
					tar: '完工巡线审核('+(this.t.verified==4?'退回':'通过')+')',
					event: 'veryfy',
					kmlId: this.kml._id,
					tt: 100,
					name: this.kml.name,
					userId: this.userInfo._id,
					status: Number(this.t.verified),
					verResult: this.t
				})
				await this.$service.zts.log.sms({  // 发送短信
					userId: this.kml.userId,
					name: this.kml.name,
					templateId: this.t.verified==4?'16688':'16687',
					content: this.t.reject
				})
				
				this.kml.status = Number(this.t.verified)
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
	background-color: #fff;
	overflow: hidden auto;
	padding: 12px;
}
</style>