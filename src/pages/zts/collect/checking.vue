<template>
	<div class="home">
		<view class="solid shadow">
			<block v-if="cur && cur.type==9">
				<block v-if="cur.status==10">
					<view class="flex justify-end">
						<el-button size="mini" type="primary" @click="edit">更新</el-button>
					</view>
					<collect-info :kml="cur"></collect-info>
				</block>
				<block v-else>
					<cl-form v-if="cur.status==-10 || cur.status==2 || cur.status==4" ref="form" inner></cl-form>
					<el-button size="mini" @click="reChart">刷新</el-button>
				</block>
			</block>
		</view>
		<block v-if="chart">
			<cl-scrollbar>
				<el-divider content-position="left">轨迹数据</el-divider>
				<view class="flex justify-between">
					<view>
						<text class="text-sm padding-left-xs text-grey">长度：</text>
						<text class="text-sm text-orange text-bold">{{chart.line.len}}m</text>
						
						<text class="text-sm padding-left-xs text-grey">海拔：<text class="cuIcon-top"></text></text>
						<text class="text-sm text-orange text-bold">{{line.info.top}}m</text>
						<text class="text-sm text-grey"><text class="cuIcon-down"></text></text>
						<text class="text-sm text-orange text-bold">{{line.info.bottom}}m</text>
						
						<text class="text-sm padding-left-xs text-grey">累计：<i class="header-icon el-icon-top"></i></text>
						<text class="text-sm text-orange text-bold">{{line.info.up}}m</text>
						<text class="text-sm text-grey"><i class="header-icon el-icon-bottom"></i></text>
						<text class="text-sm text-orange text-bold">{{line.info.down}}m</text>
					</view>
					<view>
						<!-- <el-button :loading="epxorting" size="mini" type="primary" @click="exportExcel">导出 Excel</el-button> -->
					</view>
				</view>
				
				
				<el-divider></el-divider>
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
			</cl-scrollbar>
		</block>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
// import { kmlChart,dict,veri } from '@/cool/utils/pmCurd'
// import { impression,conflict,clone,kmlGrade } from "@/cool/utils/dict.js"
// import { getLable } from "@/config/dict"

// import CollectInfo from "./component/collect-info"
// import LineDetail from "../report/components/line-detail"
// import PoiDetail from "../report/components/poi-detail"

var thiz
export default {
	// components: {
	// 	CollectInfo,
	// 	LineDetail,
	// 	PoiDetail
	// },
	data() {
		return {
			epxorting:false,
			
			ip: impression,
			colors: ['#ffaa7f', '#ffa14f', '#ff5500'],
			chart: null,
			line: null,
			cur: null
		};
	},
	props: {
		kml: {
			type: Object,
			default: ()=>{
				return { list:[] }
			}
		}
	},
	computed: {
		...mapGetters(['lay','userInfo'])
	},
	mounted() {
		thiz=this
		this.cur = clone(this.kml.cur)
		this.cur.dept = getLable(this.cur.departmentId)
		this.chart = kmlChart(this.kml.list)
		this.line = this.kml.list[0].children[0]
		
		console.log(this.chart, this.cur);
		if(this.cur.status<10) {
			setTimeout(function() {thiz.createForm()}, 100);
		}
	},
	methods: {
		edit(){
			this.cur.status = -10
			if(!veri.call(this,{})) return
			setTimeout(function() {thiz.createForm()}, 1);
		},
		async reChart(){
			await this.$service.zts.kml.createChart({ _id: this.cur._id })
		},
		formItem() {
			let kml = this.cur
			let line = this.kml.list[0].children[0]
			if(!line.coord) {
				return this.$message.error("必须包含一条默认轨迹！")
				line = line.children[0].children[0]
			}
			if(!kml.score) kml.score = [0,0,0,0,0,0]
			if(!kml.conflict) kml.conflict = []
			if(!kml.element) kml.element = []
			
			this.line = line
			// console.log(line);
			
			let h = this.$createElement,
				hv
			
			if(kml.type==9) {
				hv = [
					h('i', { style: 'color: teal' }, '采集日期：'+ (kml.startTime.substring(0,16) + ' - ' + kml.endTime.substring(11,16))),
					h('br'),
					h('i', { style: 'color: teal' }, '上传日期：'+ (kml.createTime.substring(0,16))),
					h('br'),
					h('i', { style: 'color: orange' }, '轨迹长度：' + line.info.len + 'm')
				]
			} else{
				hv = [
					h('i', { style: 'color: orange' }, '轨迹长度：' + line.info.len + 'm')
				]
			}
			
			let item = [
					{
						prop: "tips",
						component: () => {
							return hv
						}
					},
					{
						prop: 'name',
						label: '路段名称',
						span: 24,
						value: kml.name,
						component: {
							name: 'el-input'
						},
						rules: {
							required: true,
							message: '路段名称不能为空'
						}
					},
					{
						label: "归属类型",
						prop: "grade",
						span: 12,
						value: kml.grade,
						component: {
							name: "el-select",
							attrs: {
								placeholder: "请选择归属类型"
							},
							options: kmlGrade
						},
						rules: {
							required: true,
							message: '归属类型不能为空'
						}
					},
					{
						prop: 'sn',
						label: '路段序号',
						span: 12,
						value: kml.sn,
						component: {
							name: 'el-input-number',
							props: {
								placeholder: '请填写路段（数字）序号',
								min: 1,
								max: 999,
								'controls-position': 'right'
							}
						},
						rules: {
							required: true,
							message: '路段序号不能为空'
						}
					},
					
					
					{
						prop: 'ways',
						label: '途径地',
						span: 24,
						value: kml.ways,
						component: {
							name: 'el-input',
							attrs: {
								placeholder: "如 龙井-灵隐寺-北高峰"
							},
						},
						rules: {
							required: true,
							message: '途径地不能为空'
						}
					},
					{
						prop: 'collectorname',
						label: '采集员',
						span: 12,
						value: kml.collectorname,
						component: {
							name: 'el-input'
						},
						rules: {
							required: true,
							message: '采集员不能为空'
						}
					},
					
					{
						prop: 'collectortel',
						label: '手机',
						span: 12,
						value: kml.collectortel,
						component: {
							name: 'el-input',
							props: {
								maxlength: 11
							},
						},
						rules: {
							required: true,
							message: '手机不能为空'
						}
					},
					
					{
						label: "合理性验证",
						prop: "conflict",
						value: kml.conflict,
						span: 24,
						component: {
							name: "el-select",
							attrs: {
								placeholder: "请选择是否包含冲突项"
							},
							props: {
								multiple: true
							},
							options: conflict
						}
					},
					{
						label: "景观元素",
						prop: "element",
						value:  kml.element,
						component: {
							name: "el-checkbox-group",
							options: dict.element()
						}
					},
					{
						props: {
							"label-width": "0px"
						},
						component: ({ h }) => {
							return h(
								"el-divider",
								{
									props: {
										"content-position": "left"
									}
								},
								"印象评分"
							);
						}
					}
				]
				
			for (var i = 0; i < impression.length; i++) {
				item.push({
						label: impression[i].name,
						prop: "score"+i,
						span: 8,
						value:  kml.score[i],
						component: {
							name: "el-rate"
						}
					})
			}
			item.push({
						prop: 'desc',
						label: '备注说明',
						value: kml.desc,
						span: 24,
						component: {
							name: 'el-input',
							props: {
								type: 'textarea',
								rows: 4
							}
						}
					})
			return item
		},
		formKml(kml) {
			kml.score = []
			for (var i = 0; i < impression.length; i++) {
				kml.score.push(kml["score"+i])
				delete kml["score"+i]
			}
			return kml
		},
		createForm(){
			if(this.cur.type==9) {
				this.$refs.form.create({
					items: this.formItem(),
					on: {
						submit: async (data, { close, done }) => {
							const noLegal = (e)=>{
								done();
								return this.$message.error(e)
							}
							let len = this.chart.line.len
							if(this.chart.lenType<len*0.95) return noLegal('【路体类型】未设定或设定的距离有误（总距离不得少于采集的距离）')
							if(this.chart.lenType>len*1.05) return noLegal('【路体类型】设定距离有误（总距离不得大于采集的距离）')
							if(this.chart.lenLevel<len*0.95) return noLegal('【路况等级】未设定或设定的距离有误（总距离不得少于采集的距离）')
							if(this.chart.lenLevel>len*1.05) return noLegal('【路况等级】设定距离有误（总距离不得大于采集的距离）')
							
							let nkml = this.formKml(data)
							delete nkml.tips
							nkml.status = this.cur.status==-10? 10 : 6
							// nkml.status = 12
							
							await this.$service.zts.kml.update({
								...nkml,
								_id: this.cur._id
							}).catch((err) => {
								return noLegal(err)
							})
							
							let log = {
								kmlId: this.cur._id,
								name: this.cur.name,
								tar: '采集复核'+(this.cur.status==2?'':'(补充)'),
								status: nkml.status,
								user: this.userInfo.name,
								event: 'check'
							}
							if(this.cur.status==-10) {
								log.tar = '数据更新'
								log.oldValue = this.cur
								log.newVlaue = nkml
								log.event = 'update'
							}
							await this.$service.zts.log.add(log)
							if (this.kml.cur.status >= 10) await this.$service.zts.kml.createChart({ _id: this.cur._id });
							
							this.cur = Object.assign(this.cur, nkml)
							uni.setStorageSync('collect_check', this.cur._id)
							this.$message.success("保存成功")
							this.$emit('checked', this.cur)
							done()
						},
						close(done) {
							thiz.$emit('checked', thiz.cur)
							// done()
						}
					}
				});
			}
			
		}
	}
};
</script>

<style lang="scss" scoped>
.home {
	height: 100%;
	overflow: hidden auto;
	.direct {
		height: 400px;
		width: 100%;
		// padding: 0 10px;
		min-height: 400px;
	}
	._map {
		width: 100%;
		height: 100%;
	}
	.place {
		margin-left: 5px;
		cursor: pointer;
	}
	.inum {
		width: 110px;
	}
}
</style>
