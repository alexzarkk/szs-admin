<template>
	<div class="home" v-if="kml" v-loading="loading">
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
									
									<!-- 开/完工报告 -->
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
					<el-descriptions class="bg-grey padding-lr padding-top-sm text-center" title="巡线审核" 
						:extra="'审核员：'+(!saved? userInfo.name:t.userInfo.name + ' 审核日期：'+t.createTime)"/>
					<scroll-view class="solid padding-lr-xs" :scroll-y="true" :style="'height:'+ (winH-(!saved?120:60)) + 'px'">
						<el-row :gutter="15">
							<el-col>
								<view class="margin-top-sm">
									<el-descriptions title="巡线报告" :column="2" border>
										<el-descriptions-item label="开始时间">{{ kml.startTime }}</el-descriptions-item>
										<el-descriptions-item label="结束时间">{{ kml.endTime }}</el-descriptions-item>
										<el-descriptions-item label="巡线人">{{ kml.userInfo.name }}</el-descriptions-item>
										<el-descriptions-item label="随机检查点">{{ kml.cps }}</el-descriptions-item>
									</el-descriptions>
								</view>
								
								<view class="margin-top-sm text-sm flex justify-end">注：巡线审核报告非验收报告</view>
								<block v-if="saved">
									<el-descriptions title="审核报告" :column="2" border></el-descriptions>
								</block>
								
								<el-form ref="form" :disabled="saved" size="mini" class="light padding-xs solid" :rules="rules" :model="t" :label-width="'auto'">
									
									<block v-for="(e, idx) in rule" :key="idx">
										<block v-if="e.title">
											<el-divider content-position="center"><el-link type="info" disabled>{{ e.title }}</el-link></el-divider>
										</block>
										<block v-else>
											<el-row>
												<el-col>
													<el-form-item :label="e.label" prop="trackRate">
														<block v-if="!saved">
															<el-radio-group v-model="t[e.key+'Rate']">
																<block v-for="(v, idxx) in vRes" :key="1000+idxx">
																	<el-radio :label="v.value">{{ v.label }}</el-radio>
																</block>
															</el-radio-group>
														</block>
														<block v-else>
															<text class="text-bold">{{ vObj[t[e.key+'Rate']||0].label }}</text>
															<p><text class="text-bold">{{ t[e.key] }}</text></p>
														</block>
														
														<block v-for="(text, idxx) in e.desc" :key="2000+idxx">
															<view class="text-gray text-sm">
																{{ text }}
															</view>
														</block>
														<el-input v-if="!saved" v-model="t[e.key]" type="textarea" :rows="1" placeholder="请输入审核说明(如有)"></el-input>
													</el-form-item>
												</el-col>
											</el-row>
										</block>
									</block>
									
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
												
												<block v-if="!saved">
													<el-radio-group v-model="t.verified">
														<el-radio label="4">退回</el-radio>
														<el-radio label="10">通过</el-radio>
													</el-radio-group>
												</block>
												<block v-else>
													<text class="text-bold">{{ t.verified==4?'退回':'通过' }}</text>
												</block>
												
											</el-form-item>
										</el-col>
									</el-row>
									<el-row v-if="!saved&&t.verified==4">
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
					
					<view v-if="!saved" class="flex justify-center align-start">
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
import rule from './rule'

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
			rule,
			rules: {
				constrRate: [{ required: true, message: '请选择整体建设实施评分', trigger: ['blur', 'change']}],
				verified: [{ required: true, message: '请选择审核结果', trigger: ['blur', 'change'] }],
				reject: [{ required: true, message: '请输入退回原因', trigger: ['blur', 'change'] }]
			},
			vRes: [
				{value:0, label:'不涉及' },
				{value:1, label:'不合规或未处理' },
				{value:3, label:'欠缺或不足' },
				{value:5, label:'达标' }
			],
			vObj: {}
		};
	},
	computed: {
		...mapGetters(['lay','userInfo'])
	},
	mounted(){
		this.vObj = this.zz.toObj(this.vRes)
		for (let s of rule) {
			if (!s.title) {
				this.rules[s.key+'Rate'] = [{ required: true, message: '请选择'+s.label+'评价', trigger: ['blur', 'change'] }]
			}
		}
		window.addEventListener('resize',()=>{
			this.winH = window.innerHeight-40
		})
		this.refresh()
	},
	methods: {
		async refresh(){
			this.loading = true
			this.kml = await this.$service.zts.kml.info({ id: uni.getStorageSync('constr_kml'), ui: true })
			let line = this.kml.children.find(e=>e.t2==10)
			line.info = calData(line.coord)
			this.line = line
			
			let { list } = await this.$service.zts.layout.page({ _id: this.kml.layId, children:true, cst:[40,50,60] })
			let kml9 = await this.$service.zts.kml.info({ id: list[0].kmlId })
			
			list[0].logs = await this.$service.zts.layLog.list({ constrId: this.kml.layId })
			
			this.kml9 = kml9
			this.chart = kmlChart(kml9.children)
			this.cur = list[0]
			this.kml9 = kml9
			
			if(this.kml.status!=6){
				// this.$message.error("此数据已经审核！")
				this.rules = {}
				let log = await this.$service.zts.log.page({ui:1, size:1, kmlId: this.kml._id})
				this.t = {...log.list[0], ...log.list[0].verResult}
				this.saved = true
			}
			
			console.log(list, kml9, this.kml, this.t);
			this.loading = false
		},
		async save(){
			// console.log('saving--------',this.t,this.userInfo,this.$store.getters.dictObj.ue);
			let veri = false,
				status = Number(this.t.verified)
				
			this.$refs.form.validate((valid) => { veri = valid })
			if(veri) {
				this.onSaving = true
				await this.$service.zts.kml.verify({   // 更新状态
					status,
					rate: this.t.constrRate,
					_id: this.kml._id
				}).catch((err) => {
					return this.$message.error(err)
				})
				
				if(status==10) {
					await this.$service.zts.constr.logSetp({constrId: this.kml.layId, nolog: true, status: 50})
				}
				
				await this.$service.zts.log.add({  // 添加操作日志
					tar: '完工巡线审核('+(status==4?'退回':'通过')+')',
					event: 'veryfy',
					kmlId: this.kml._id,
					tt: 100,
					name: this.kml.name,
					userId: this.userInfo._id,
					status,
					verResult: this.t
				})
				await this.$service.zts.log.sms({  // 发送短信
					userId: this.kml.userId,
					name: this.kml.name,
					templateId: status==4?'16688':'16687',
					content: this.t.reject
				})
				
				this.kml.status = status
				this.$message.success("保存成功")
				this.onSaving = false
				this.refresh()
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
.my-table {
    width: 100%;
    text-align: center;
    border-collapse: collapse;
    border-top: 1px solid black;
    border-left: 1px solid black;
    // margin: 20px 0;
	font-size: 14px;
    tr {
      td {
        height: 2em;
		text-align: left;
        //width: 20%;
        line-height: 1.4em;
        border-right: 1px solid black;
        border-bottom: 1px solid black;
        padding: 0;
        box-sizing: border-box;
      }
    }
  }
</style>