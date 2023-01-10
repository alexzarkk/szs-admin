<template>
	<view>
		<view class="flex flex-direction align-center">
			<zz-qrcode :url="'path=/pages/comm/kml&_id=' + kml._id" :size="120"></zz-qrcode>
			<text class="text-sm">扫码查看巡线详情</text>
		</view>
		<el-descriptions title="巡线报告" size="small" :column="2" border>
			<el-descriptions-item label="开始时间">{{ kml.startTime }}</el-descriptions-item>
			<el-descriptions-item label="结束时间">{{ kml.endTime }}</el-descriptions-item>
			<el-descriptions-item label="巡线人">{{ kml.user }}</el-descriptions-item>
			<el-descriptions-item label="随机检查点">{{ kml.cps }}</el-descriptions-item>
		</el-descriptions>
		<view class="margin-tb-xs">
			<text class=" text-bold text-xl">巡查线路图</text>
		</view>
		<view v-if="loading" v-loading="loading"></view>
		<view v-else>
			<div class="tmap">
				<tdt-map :center="line.coord[0]" :mid="'049dj'" :zoom="14" :controls="[{name: 'scale',position: 'bottomright'}]">
					<tdt-polyline :path="line.coord" :weight="2" :color="'#00ff00'" :opacity="0.8" :extData="line"></tdt-polyline>
				</tdt-map>
			</div>
			<block v-for="(item, i) of list" :key="i">
				<view class="margin-tb">
					<el-divider><text class="text-bold text-xl">{{item.label}}</text></el-divider>
				</view>
				<table class="my-table">
					<tr>
						<td>类型</td>
						<td>位置</td>
						<td>照片/视频</td>
					</tr>
					<block v-for="(t, ii) of item.list" :key="ii">
						<block v-if="pm[t.value].length" >
							<tr v-if="pm[t.value].length">
								<td :rowspan="pm[t.value].length">{{ t.label }}</td>
								<td align="center">
									<pm-map :pm="pm[t.value][0]" :line="line"/>
								</td>
								<td>
									<pm-img :pm="pm[t.value][0]"/>
								</td>
							</tr>
							
							<block v-if="iii>0" v-for="(pm, iii) of pm[t.value]" :key="iii">
								<tr>
									<td align="center"><pm-map :pm="pm" :line="line"/></td>
									<td><pm-img :pm="pm"/></td>
								</tr>
							</block>
						</block>
						<block v-else>
							<tr>
								<td>{{ t.label }}</td>
								<td colspan="2">{{i==0?'不涉及':'无数据'}}或未采集</td>
							</tr>
						</block>
					</block>
				</table>
			</block>
			
			<block v-for="(item, i) of list2" :key="'_'+i">
				<view class="margin-tb">
					<el-divider><text class=" text-bold text-xl">{{item.label}}</text></el-divider>
				</view>
				
				<table class="my-table">
					<tr>
						<td>序号</td>
						<td>位置</td>
						<td>照片/视频</td>
					</tr>
					<block v-if="item.list.length">
						<block v-for="(pm, idx) of item.list" :key="'_'+idx">
							<tr>
								<td>{{idx+1}}</td>
								<td align="center"><pm-map :pm="pm" :line="line"/></td>
								<td><pm-img :pm="pm"/></td>
							</tr>
						</block>
					</block>
					<block v-else>
						<tr>
							<td colspan="3">无数据</td>
						</tr>
					</block>
					
				</table>
			</block>
		</view>
		<block v-if="t">
			<view class="margin-tb-xs"></view>
			<el-row>
				<el-col>
					<view class="margin-top-sm text-sm flex justify-end">注：巡线审核报告非验收报告</view>
					
					<el-descriptions title="审核报告" size="small" :column="2" border>
						<el-descriptions-item label="审核员">{{ t.userInfo.name }}</el-descriptions-item>
						<el-descriptions-item label="审核日期">{{ t.createTime }}</el-descriptions-item>
					</el-descriptions>
					<view class="solid">
						<el-form ref="form" :disabled="true" size="mini" class="light padding-xs solid" :model="t" :label-width="'auto'">
							<block v-for="(e, idx) in rule" :key="idx">
								<block v-if="e.title">
									<el-divider content-position="center"><el-link type="info" disabled>{{ e.title }}</el-link></el-divider>
								</block>
								<block v-else>
									<el-row>
										<el-col>
											<el-form-item :label="e.label" prop="trackRate">
												<text class="text-bold text-black">{{ vObj[t[e.key+'Rate']||0].label }}</text>
												<p><text class="text-bold">{{ t[e.key] }}</text></p>
												<block v-for="(text, idxx) in e.desc" :key="2000+idxx">
													<view class="text-grey text-sm">
														{{ text }}
													</view>
												</block>
											</el-form-item>
										</el-col>
									</el-row>
								</block>
							</block>
							
							<el-row>
								<el-col>
									<el-form-item label="整体评分" prop="constrRate">
										<el-rate v-model="t.constrRate" :colors="['#ffaa7f', '#ffa14f', '#ff5500']"></el-rate>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col>
									<el-form-item label="审核结果" prop="verified">
										<text class="text-bold text-black">{{ t.verified==4?'退回':'通过' }}</text>
									</el-form-item>
								</el-col>
							</el-row>
						</el-form>
					</view>
				</el-col>
			</el-row> 
			
		</block>
	</view>
</template>

<script>
	
import pmMap from "./pm-map"				
import pmImg from "./pm-img"
import rule from '../rule'
	
export default {
	components: { pmMap, pmImg },
	props: {
		kml: { type: Object },
	},
	data() {
		return {
			loading: true,
			rule,
			line: null,
			t: null,
			vRes: [
				{value:0, label:'不涉及' },
				{value:1, label:'不合规或未处理' },
				{value:3, label:'欠缺或不足' },
				{value:5, label:'达标' }
			],
			vObj: {},
			
			svg: 'https://zts.5618.co/static/loadding.gif',
			
			pm: {},
			list: [
				{label:'路体建设', list: [
										{icon:'z2012', 	value: 302, label:'路面'},
										{icon:'slope', 	value: 304, label:'坡度处理'},
										{icon:'jishui', value: 306, label:'排水系统'},
										{icon:'z210', 	value: 308, label:'河道/溪谷'},
										{icon:'cliff', 	value: 310, label:'岩壁'},
										{icon:'more', 	value: 300, label:'其他'}
									] },
									
				{label:'标牌系统', list: [
									{label: '指引牌', value:21 },
									{label: '主信息牌', value:22 },
									{label: '次信息牌', value:23 },
									{label: '禁止牌', value:25 },
									{label: '警示牌', value:26 },
									{label: '提示牌', value:27 }
								]},
				
			],
			list2: [
				{label:'服务设施（驿站和节点）', list: []},
				{label:'随机检查点', list: []}
			]
		}
	},
	
	mounted(){
		for (let s of this.list) {
			for (let x of s.list) {
				this.pm[x.value] = []
			}
		}
		
		this.vObj = this.zz.toObj(this.vRes)
		this.t = this.kml.t
		this.init()
	},
	methods: {
		async init() {
			
			this.loading = true
			let pms = await this.$service.zts.placemark.list({ kmlId: this.kml._id, plain:true })
			this.pms = pms
			
			for (let s of pms) {
				if(s.t2==9) {
					this.line = s
				} 
				if(s.t1==2){
					if(s.t3) {
						
						if(s.t3<300) {
							this.list2[0].list.push(s)
						} else {
							this.pm[s.t3].push(s)
						}
						
					} else if(s.t2==90) {
						this.list2[1].list.push(s)
					} else {
						this.pm[s.t2].push(s)
					}
				}
			}
			this.loading = false
		}
	}
};
</script>

<style lang="scss" scoped>
.tmap {
	width: 18cm;
	height: 16.3cm;
}
.minimap{
	justify-content: center;
	align-items: center;
	width: 220px;
	height: 180px;
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
		align-items: center;
      }
    }
  }
</style>
