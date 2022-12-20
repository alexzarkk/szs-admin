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
							<el-descriptions class="bg-grey padding-lr padding-top-xs text-center" title="审核报告" :extra="'审核时间：'+log.updateTime.substring(0,16)+' 审核员：'+log.user" :column="2"  border>
							</el-descriptions>
							<el-form ref="form" :disabled="true" size="mini" class=" light padding-xs margin-top-xs" :model="t" :label-width="'auto'">
								<el-divider content-position="center"><el-link type="info" disabled>轨迹类</el-link></el-divider>
								<el-row>
									<el-col>
										<el-form-item label="完整度">
											<el-input v-model="t.track" type="textarea" :rows="1" ></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col>
										<el-form-item label="路况类型">
											<el-input v-model="t.routeType" type="textarea" :rows="1" ></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								
								<el-row>
									<el-col>
										<el-form-item label="等级分类">
											<el-input v-model="t.routeLevel" type="textarea" :rows="1" ></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col>
										<el-form-item label="整体评分">
											<el-rate v-model="t.trackRate" :colors="colors"></el-rate>
										</el-form-item>
									</el-col>
								</el-row>
								
								<el-divider content-position="center"><el-link type="info" disabled>附加信息</el-link></el-divider>
								<el-row>
									<el-col>
										<el-form-item label="地名或兴趣点" :label-width="'100px'">
											<el-radio-group v-model="t.poiRate">
											    <el-radio :label="1">无</el-radio>
											    <el-radio :label="3">欠缺</el-radio>
											    <el-radio :label="5">齐全</el-radio>
											  </el-radio-group>
											<el-input v-if="t.poiRate<5" v-model="t.poi" type="textarea" :rows="1" ></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col>
										<el-form-item label="服务设施" >
											<el-radio-group v-model="t.servePoiRate">
											    <el-radio :label="1">无</el-radio>
											    <el-radio :label="3">有</el-radio>
											  </el-radio-group>
											<el-input v-model="t.servePoi" type="textarea" :rows="1" ></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								
								
								<el-divider content-position="center"><el-link type="info" disabled>标牌配置</el-link></el-divider>
								<el-row>
									<el-col>
										<el-form-item label="配置合理性">
											<el-radio-group v-model="t.sResonRate">
											    <el-radio :label="1">有疑问</el-radio>
											    <el-radio :label="3">一般</el-radio>
											    <el-radio :label="5">合理</el-radio>
											  </el-radio-group>
											<el-input v-if="t.sResonRate<3" v-model="t.sReson" type="textarea" :rows="1" ></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col>
										<el-form-item label="齐全度">
											<el-radio-group v-model="t.sFullRate">
											    <el-radio :label="1">无</el-radio>
											    <el-radio :label="3">欠缺</el-radio>
											    <el-radio :label="5">齐全</el-radio>
											  </el-radio-group>
											<el-input v-if="t.sFullRate<5" v-model="t.sFull" type="textarea" :rows="1" ></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								
								<el-row>
									<el-col>
										<el-form-item label="照片">
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
											<el-input v-model="t.signFeeadback" type="textarea" :rows="1" ></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								
								<el-divider content-position="center"><el-link type="info" disabled>指引柱配置</el-link></el-divider>
								<el-row>
									<el-col>
										<el-form-item label="齐全度">
											<el-radio-group v-model="t.dRate">
											    <el-radio :label="1">无</el-radio>
											    <el-radio :label="3">欠缺</el-radio>
											    <el-radio :label="5">齐全</el-radio>
											  </el-radio-group>
											<el-input v-if="t.dRate<5" v-model="t.direct" type="textarea" :rows="1" ></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-divider content-position="left"><el-link type="info" disabled>异常柱</el-link></el-divider>
								<block v-for="(e,i) in t.derr" :key="i">
									<el-divider v-if="i"></el-divider>
									<el-row>
										<el-col :span="12">
											<el-form-item label="柱号">
												<el-input v-model="e.name"></el-input>
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
												<el-input v-model="e.desc" type="textarea" :rows="1" ></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col>
											<el-form-item label="照片">
												<!-- <cl-upload v-model="e.pics" is-space></cl-upload> -->
												<block v-if="e.pics">
													<block v-for="(p,i) in e.pics.split(',')" :key="i">
														<el-image style="padding:6px; width: 100px; height: 100px"
															:src="p" :preview-src-list="e.pics.split(',')">
														  </el-image>
													</block>
												</block>
											</el-form-item>
										</el-col>
									</el-row>
								</block>
								
								<!-- <el-row>
									<el-col :span="24">
										<view class="flex justify-center">
											<el-button v-if="t.derr.length" type="warning" size="mini" icon="el-icon-delete" @click="delErr">删除</el-button>
											<el-tooltip class="item" effect="dark" content="添加异常柱" placement="top">
												<el-button type="success" size="mini" icon="el-icon-plus" @click="addErr">添加</el-button>
											</el-tooltip>
										</view>
									</el-col>
								</el-row> -->
								
								<el-divider content-position="center"><el-link type="info" disabled>其它项</el-link></el-divider>
								<el-row>
									<el-col>
										<el-form-item label="待补充">
											<el-input v-model="t.desc" type="textarea" :rows="1" ></el-input>
											
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col>
										<el-form-item label="照片">
											<!-- <cl-upload v-model="t.pics" is-space></cl-upload> -->
											<!-- <cl-pics :pics="t.pics" @updatePic="updatePic"></cl-pics> -->
											<block v-if="t.pics" v-for="(e,i) in t.pics.split(',')" :key="i">
												<el-image style="padding:6px; width: 100px; height: 100px"
													:src="e" :preview-src-list="t.pics.split(',')">
												  </el-image>
											</block>
											
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
					
					<!-- <view class="flex justify-end align-start">
						<view class="padding-tb-xs">
							<el-button type="primary" :loading="onSaving" :disabled="saved" @click="save('save')">保 存</el-button>
						</view>
					</view> -->
					
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
			log: null,
			kml: null,
			chart: null,
			line:{},
			colors: ['#ffaa7f', '#ffa14f', '#ff5500'],
			
			onSaving: false,
			saved: false,
			err:['方位角','指向角','指向地位置','照片'],
			
			t: {
				track: '',
				routeType: '',
				routeLevel: '',
				trackRate: 0,
				
				poiRate: 0,
				poi: '',
				servePoiRate: 0,
				servePoi: '',
				
				sResonRate: 0,
				sReson: '',
				sFullRate: 0,
				sFull: '',
				sPhotoRate: 0,
				signFeeadback: '',
				
				dRate: 0,
				direct: '',
				
				derr:[],
				pics: ''
			}
		};
	},
	computed: {
		...mapGetters(['lay','userInfo'])
	},
	
	onShow(){
		let o = uni.getStorageSync('collect_report')
		// console.log('onShow',o);
		this.t = Object.assign(this.t, o.verResult)
		// console.log('activated',this.t);
		this.log = o
		// console.log(this.log);
		this.$service.zts.kml.info({
			id: o.kmlId,
			// noChild: true
		}).then((e) => {
			o = e
			e.dept = getLable(e.departmentId)
			// console.log(e);
			this.kml = e
			
			let line = o.children[0].children[0]
			if(!line.coord) line = line.children[0].children[0]
			this.line = line
			this.chart = kmlChart(this.kml.children)
			console.log(this.line,this.chart);
			this.loading = false
		})
	},
	methods: {
		getText(n,v){
			let t = getText(n,v)
			return t.label||t.text
		},
	}
};
</script>
<style lang="scss" scoped>
.home {
	height: 100%;
	overflow: hidden auto;
	padding: 12px;
}
input {
	color: '#000000'
}
</style>