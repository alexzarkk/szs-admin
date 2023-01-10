<template>
	<!-- 打印订单 -->
	<view v-if="cur" class="flex flex-direction align-center">
		<view class="padding-tb-xs flex justify-between" style="width: 21cm;">
			<view>
				<el-button icon="el-icon-printer" size="mini" type="success" v-print="p">打 印</el-button>
			</view>
			<view class="padding-lr"></view>
			<view>
				<el-radio-group v-model="page" size="mini">
					<el-radio-button label="基本信息"></el-radio-button>
					<!-- <el-radio-button label="数字化"></el-radio-button> -->
					<!-- <el-radio-button label="运维管理"></el-radio-button> -->
					<el-radio-button label="采集报告"></el-radio-button>
					<el-radio-button v-if="cur.kml40" label="巡线报告"></el-radio-button>
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
							<block v-for="(t, i) of log.imgs" :key="1000+i">
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
				
				<view v-if="cur.cst>=40 && page=='巡线报告'">
					<view class="flex justify-end"><el-link type="primary" @click="kmlInfo(cur.kml40._id)">轨迹地图</el-link></view>
					<inspect :kml="cur.kml40"></inspect>
				</view>
				
				<view v-if="cur.cst>=50" v-show="page=='巡线审核报告'">
					
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
  // font-family: SimSun, serif;


  .header-title {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    margin: 10px 0;
  }

  .content-title {
    // font-family: SimSun, serif;
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
    // font-family: SimSun, serif;
    line-height: 200%;
    font-size: 16px;
  }


  .content-text {
    white-space: pre;
    // font-family: SimSun, serif;
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