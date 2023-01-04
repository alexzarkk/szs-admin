<template>
	<!-- 打印订单 -->
	<view v-if="cur" class="flex flex-direction align-center">
		<view class="padding-xs flex justify-between" style="width: 21cm;">
			<view>
				<el-button icon="el-icon-printer" size="mini" type="success" v-print="p">打 印</el-button>
			</view>
			<view class="padding-lr"></view>
			<view>
				<el-radio-group v-model="page" size="mini">
					<el-radio-button label="基本信息"></el-radio-button>
					<el-radio-button label="数字化"></el-radio-button>
					<el-radio-button label="运维管理"></el-radio-button>
					<el-radio-button label="采集报告"></el-radio-button>
					<el-radio-button v-if="cur.cst>=40" label="巡线报告"></el-radio-button>
					<el-radio-button v-if="cur.cst>=60" label="验收报告"></el-radio-button>
				</el-radio-group>
			</view>
		</view>
		<div class="A4">
			<div class="print-box" id="printBox">
				<view class="flex justify-between padding-bottom-sm">
					<text class="text-df">路段名称：{{ cur.name }}</text>
					<text class="text-df">等级：{{ $store.getters.dictObj.kmlGrade[cur.grade].label }}</text>
					<text class="text-df">属地：{{ $store.getters.dictObj.deps[cur.deptId].name }}</text>
				</view>
			
				<view v-show="page=='基本信息'">
					
					
					<el-descriptions title="" size="small" :column="3" border>
						<el-descriptions-item label="线路长度">{{ cur.len }}m</el-descriptions-item>
						<el-descriptions-item label="投建金额">{{ cur.invest }}万元</el-descriptions-item>
						<el-descriptions-item label="填报人">{{ cur.user }}</el-descriptions-item>
					</el-descriptions>
					<view class="margin-top-xs"></view>
					<el-descriptions title="标牌配置" size="small" :column="3" border>
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
						<el-descriptions :title="(log.status==20?'开':'完')+'工报告'" size="small" :column="2"  border>
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
				
				
				
				<view v-if="page=='采集报告'">
					
					<el-row :gutter="15">
						<el-col>
							<collect-info :kml="cur.kml"></collect-info>
							
							<el-divider content-position="left">轨迹数据</el-divider>
							<text class="text-sm padding-left-xs text-grey">采集长度：</text>
							<text class="text-sm text-orange text-bold">{{cur.kml.chart.line.len}}m</text>
							
						<!-- 	<text class="text-sm padding-left-xs text-grey">海拔：<text class="cuIcon-top"></text></text>
							<text class="text-sm text-orange text-bold">{{line.info.top}}m</text>
							<text class="text-sm text-grey"><text class="cuIcon-down"></text></text>
							<text class="text-sm text-orange text-bold">{{line.info.bottom}}m</text>
							
							<text class="text-sm padding-left-xs text-grey">累计：<i class="header-icon el-icon-top"></i></text>
							<text class="text-sm text-orange text-bold">{{line.info.up}}m</text>
							<text class="text-sm text-grey"><i class="header-icon el-icon-bottom"></i></text>
							<text class="text-sm text-orange text-bold">{{line.info.down}}m</text> -->
							
							<el-divider></el-divider>
							
							<el-row :gutter="15">
								<line-detail :title="'路体类型'" :data="cur.kml.chart.kType"></line-detail>
							</el-row>
							<el-row :gutter="15">
								<line-detail :title="'路况等级'" :data="cur.kml.chart.kLevel"></line-detail>
							</el-row>
							<el-divider content-position="left">坐标数据</el-divider>
							<el-row>
								<el-col>
									<div class="card">
										<poi-detail :data="cur.kml.chart.poi"></poi-detail>
									</div>
								</el-col>
							</el-row>
							
						</el-col>
					</el-row>
				</view>
				
				<view v-if="cur.cst>=40" v-show="page=='巡线报告'">
					<el-collapse v-model="activeName" accordion>
						<block v-for="(kml, idx) of cur.kml40" :key="idx">
							<el-collapse-item :title="kml.startTime" :name="idx+''">
								<view class="flex justify-end"><el-link type="primary" @click="kmlInfo(kml._id)">轨迹地图</el-link></view>
								<inspect :kml="kml"></inspect>
							</el-collapse-item>
						</block>
					</el-collapse>
				</view>
				
				<view v-if="cur.cst>=40" v-show="page=='验收报告'">
					<table class="my-table">
						<tr>
							<td colspan="2" rowspan="2">验收内容</td>
							<td rowspan="2">技术要求</td>
							<td rowspan="2" >评分参考</td>
							<td colspan="2" >打分评定</td>
						</tr>
						<tr>
							<td nowrap>分值</td>
							<td nowrap>评分</td>
						</tr>
						<tr>
							<td rowspan="7">路体建设</td>
							<td>选线</td>
							<td>串联主要山峰、自然和人文资源，交通通达性好，驿站、农家乐、民宿等服务设施完善；优先选用古道、山林道、防火道等现有道路，没有长距离公路。沿途无墓地、垃圾填埋场、矿区采石场、工厂等景观不协调区域。</td>
							<td>未串联主要山峰、自然和人文资源,沿线景观资源、村落少，扣2分<br/>
								交通不便利，扣2分<br/>
								有长距离公路或不协调区域，扣5分
							</td>
							<td>5</td>
							<td>{{ '' }}</td>
						</tr>
						<tr>
							<td>路面</td>
							<td>天然砂土路面或人工修筑路体，人工修筑路体符合生态环保施工原则，材料以就地取材，可以是土质、草质、腐殖质、落叶、碎石、砂石等材料，部分古道或高人流路段可使用石块铺筑路面。</br>
								路面坚实、稳固、平整，无明显植被侵占，通过性好。<br/>
								路体上方净空间充足，无横梁、藤蔓、树枝等障碍物。
							</td>
							<td>路面材质不符合，扣2分<br/>
								路面不稳固，扣2分<br/>
								路面不平整，扣2分<br/>
								路面有明显植被、物体侵占，扣2分<br/>
								路体上方净空间不足，有障碍物，扣2分
							</td>
							<td>10</td>
							<td>{{ '' }}</td>
						</tr>
						<tr>
							<td>宽度</td>
							<td>平均宽度0.8-1.2m，最低宽度应大于0.6m。</td>
							<td>未达到，扣5分</td>
							<td>5</td>
							<td>{{ '' }}</td>
						</tr>
						<tr>
							<td>坡度处理</td>
							<td>纵向坡度大于12%时，已作梯步或“之”字迂回，梯步最大高度25cm以内，平均高度差10%以内，最小梯面不低于30cm。<br/>
								梯步的制作材料应就地取材，梯面应采用防腐的树木或石块，两侧应固定。<br/>
								最大断面坡度不超过15%。<br/>
							</td>
							<td>未达到，扣5分</td>
							<td>5</td>
							<td>{{ '' }}</td>
						</tr>
						<tr>
							<td>排水系统</td>
							<td>根据地形和水文情况，路体一侧或两侧应设置排水沟或引流渠。排水沟渠符合流水方向，不易於堵、积水。
							</td>
							<td>未达到，扣10分</td>
							<td>10</td>
							<td>{{ '' }}</td>
						</tr>
						<tr>
							<td>河道/溪谷</td>
							<td>采用汀步或木便桥或涵道方式。</td>
							<td>未达到，扣5分</td>
							<td>5</td>
							<td>{{ '' }}</td>
						</tr>
						<tr>
							<td>岩壁</td>
							<td>岩壁和陡峭岩体时辅以人工设施以保证安全，材料以不宜腐败的金属为主，可以是扶手、抓手、铁链等形式安装。</td>
							<td>未达到，扣5分</td>
							<td>5</td>
							<td>{{ '' }}</td>
						</tr>
						
						<tr>
							<td rowspan="14">标牌系统</td>
							<td rowspan="5">配置合理性</td>
							<td align="left"><b>主信息牌—</b>步道主要起终点、服务中心、停车场等人流易集中位置。</td>
							<td rowspan="5">漏配、错配或未达到标准，每项扣1分</td>
							<td rowspan="5">5</td>
							<td rowspan="5">{{ '' }}</td>
						</tr>
						<tr>
							<td align="left"><b>次级信息牌—</b>途经的休息点、垭口、特色的自然或人文点。</td>
						</tr>
						<tr>
							<td align="left"><b>出入口引导牌—</b>主要的交通入口处，途经重要的分岔口。</td>
						</tr>
						<tr>
							<td align="left"><b>警示/提示牌—</b>陡坡、落石、悬崖、禁行等安全隐患路段。安全、环保等相关提示性标识。</td>
						</tr>
						<tr>
							<td align="left"><b>标距/指引柱—</b>标距柱每500m/个，指引柱根据岔路口配置。</td>
						</tr>
						
						<tr>
							<td rowspan="4">选址要求</td>
							<td align="left"><b>展示性—</b>选址位置具有较好的展示性，评估人流走向选择周边无明显遮挡物区域。</td>
							<td rowspan="4">未达到，扣1分</td>
							<td rowspan="4">4</td>
							<td rowspan="4">{{ '' }}</td>
						</tr>
						<tr>
							<td align="left"><b>安全性—</b>用户的阅读站位安全，站位区域避免交通道、上下坎、危险水域等。</td>
						</tr>
						<tr>
							<td align="left"><b>景观性—</b>和周围环境协调统一，融合度高，旁边无厕所、垃圾点等设施。</td>
						</tr>
						<tr>
							<td align="left"><b>不冲突—</b>无重要景观和设施的遮挡，如交通导示、消防设施等。</td>
						</tr>
						<!-- <tr>
							<td><b>展示性</b>选址位置具有良好的展示性，评估人流走向选择周边无明显遮挡物区域。</td>
						</tr> -->
						
						<tr>
							<td rowspan="4">设计和制作</td>
							<td align="left"><b>整体风格—</b>风格样式符合《环浙步道VI》要求。</td>
							<td>未达到，扣1分</td>
							<td>1</td>
							<td>{{ '' }}</td>
						</tr>
						<tr>
							<td align="left"><b>制图规范—</b>有地形图，有介绍，有图例，地名使用规范。</td>
							<td>未达到，扣2分</td>
							<td>2</td>
							<td>{{ '' }}</td>
						</tr>
						<tr>
							<td align="left"><b>材料—</b>标牌制作材料应选用天然环保材料。</td>
							<td>未达到，扣1分</td>
							<td>1</td>
							<td>{{ '' }}</td>
						</tr>
						<tr>
							<td align="left"><b>信息化—</b>标牌有独立的信息化（二维码）。</td>
							<td>未达到，扣2分</td>
							<td>2</td>
							<td>{{ '' }}</td>
						</tr>
						
						<tr>
							<td>安装规范</td>
							<td>安装牢固，无明显晃动、无倾斜。安装基础已做好覆土复绿。标距/指引柱安装已通过环浙步道数字平台审核。</td>
							<td>“环浙采集”APP审核通过率，未达到100%，扣10分</td>
							<td>10</td>
							<td>{{ '' }}</td>
						</tr>
						
						<tr>
							<td width="6%">服务设施</td>
							<td width="6%">驿站和休息点</td>
							<td>驿站可以是新建或在原有基础上改建升级，也可结合现有的公路驿站、旅游驿站及村庄、林场、露营地等结合公用。连续5km或3小时的徒步路程中途必须配置驿站。<br/>
								一级驿站 步道主要起终点，提供综合服务功能。<br/>
								二级驿站 承担常规服务功能。<br/>
								三级驿站 基本休息功能。
							</td>
							<td width="24%">漏配或未达到标准，扣5分。没有，扣10分</td>
							<td width="6%">10</td>
							<td width="6%">{{ '' }}</td>
						</tr>
						<tr>
							<td rowspan="2">数字化</td>
							<td>节点信息</td>
							<td>自然景观节点、体育健身节点、文化景观节点、休闲游憩节点、科普教育节点、地方特色节点等。</td>
							<td rowspan="2">应报未报或报送未通过审核，扣5分</td>
							<td>5</td>
							<td>{{ '' }}</td>
						</tr>
						<tr>
							<td>推荐路线</td>
							<td>基于资源特色，制定特色线路，包括但不仅限于名山系列、海岛系列、森林系列、河湖系列、滨海系列、田园系列、古道系列、体育系列、红色系列。</td>
							<td>5</td>
							<td>{{ '' }}</td>
						</tr>
						<tr>
							<td rowspan="2">运维管理</td>
							<td>管理</td>
							<td>设立步道归口管理单位,设置专人负责步道管理，制定管理手册、巡查制度、使用者准则、维护计划等。（以相关文件或会议纪要为准）</td>
							<td rowspan="2">没有，扣5分</td>
							<td>5</td>
							<td>{{ '' }}</td>
						</tr>
						<tr>
							<td>赛事获得</td>
							<td>谋划环浙步道赛事活动，制定下一年度或长期的赛事活动计划方案。（以相关文件或会议纪要为准）</td>
							<td>5</td>
							<td>{{ '' }}</td>
						</tr>
						
						<tr height="40">
							<td colspan="2">合计</td>
							<td colspan="2"></td>
							<td colspan="2"></td>
						</tr>
						<tr>
							<td colspan="2" style="height: 200px">验收专家组意见</td>
							<td colspan="4"></td>
						</tr>
						<tr>
							<td colspan="2" style="height: 100px">验收专家组签名</td>
							<td colspan="4"></td>
						</tr>
						<tr>
							<td colspan="2" style="height: 200px">验收单位意见</td>
							<td></td>
							<td colspan="3">盖章</td>
						</tr>
						<tr>
							<td colspan="2" style="height: 50px">验收地点</td>
							<td></td>
							<td colspan="3"><br/>{{'______年_____月_____日'}}</td>
						</tr>
						
					</table>
				</view>
				
			</div>
		</div>
	</view>
</template>

<script>
import Print from 'vue-print-nb-dom-show'
import Vue from "vue"
Vue.use(Print)

import inspect from "./inspect"
import CollectInfo from "../../collect/component/collect-info"
import LineDetail from "../../report/components/line-detail"
import PoiDetail from "../../report/components/poi-detail"

var thiz
export default {
	components: { inspect, CollectInfo, LineDetail, PoiDetail },
	props: {
		cur: { type: Object },
	},
	data() {
		return {
			lay:{},
			loading: -1, // 列表加载
			
			page: '基本信息',
			list: [],
			logs: [],
			orderView:false,
			order:{},
			activeName:'0',
			
			noPrint: true,
			p: {
				// 打印的参数对象
				id: 'printBox',
				preview: false,
				extraHead:'',  // 打印头
				// previewTitle: '打印预览',
				popTitle: '环浙步道巡线报告',
				asyncpreviewBeforeOpenCallback(vue) {
					thiz.noPrint = false
					console.log('正在加载预览窗口');
				},
				previewOpenCallback(vue) {
					console.log('已经加载完预览窗口');
				},
				 beforeOpenCallback(vue) {
					thiz.noPrint = false
					console.log('打开之前');
					
				},
				openCallback(vue) {
					// console.log('执行了打印');
				},
				closeCallback(vue) {
					thiz.noPrint = true
					// console.log('关闭了打印工具');
				}
			},
		};
	},
	mounted() { thiz=this },
	methods: {
		pdferr(e){
		},
		kmlInfo(_id){
			this.$emit('kmlInfo', {_id})
		},
		info(e) {
			console.log(e);
		}
	}
};
</script>
<style scoped lang="scss">
.A4 {
  width: 22cm;
  min-height: 297mm;
  margin-bottom: 20px;
  border: 1px solid black;
}

.print-box {
  padding-top: 10px;
  background: white;
  width: 18cm;
  //width: 980px;
  display: block;
  margin: 0 auto 0.5cm;
  font-size: 18px;
  font-family: SimSun, serif;


  .header-title {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    margin: 10px 0;
  }

  .content-title {
    font-family: SimSun, serif;
    font-weight: bold;
    line-height: 150%;
    font-size: 16px;
  }

  .content { // 保留空格的内容文本
    white-space: pre-wrap;
    //font-size: 12px;
    text-indent: 2em;
    //letter-spacing: 4px;
    font-family: SimSun, serif;
    line-height: 160%;
    font-size: 16px;
  }

  .content-sub-text {
    white-space: pre-wrap;
    text-indent: 3em;
    font-family: SimSun, serif;
    line-height: 200%;
    font-size: 16px;
  }


  .content-text {
    white-space: pre;
    font-family: SimSun, serif;
    line-height: 200%;
    font-size: 16px;
  }


  .my-table {
    width: 18cm;
    text-align: center;
    border-collapse: collapse;
    border-top: 1px solid black;
    border-left: 1px solid black;
    // margin: 20px 0;
	font-size: 14px;
    tr {
      td {
        height: 2em;
        //width: 20%;
        line-height: 1.4em;
        border-right: 1px solid black;
        border-bottom: 1px solid black;
        padding: 0;
        box-sizing: border-box;
      }
    }
  }

}

.title {
	font-size: 1.7em;
	// width: 40px;
	// font-size: width:6px;
	margin-bottom: 20px;
	font-weight: 500;
	text-align: center;
}

.info-box {
	display: flex;
	flex-direction: column;
	row-gap: 0.4cm;
	.info {
	}
}

.custome-title {
	margin: 0.5cm 0 0.5cm;
}

.user-info {
	margin: 0.5cm 0 1.2cm;
}
</style>