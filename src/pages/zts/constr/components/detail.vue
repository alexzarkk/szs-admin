<template>
</template>

<script>
import { kmlChart } from '@/cool/utils/pmCurd'
export default {
	props: {
		kml: { type: Object },
	},
	async mounted() {
		const close=(x)=>{this.$emit('close',x)}
		let e = this.kml,
			method = e.cst==1? 'add':'update'
			
		if(!e.pms) {
			this.$parent.loading = true
			e.pms = await this.$service.zts.placemark.list({ kmlId: e.kmlId, chart: true })
			this.$parent.loading = false
		}
		let kl = kmlChart(e.pms),
			k11 = kl.kLevel.find(e=>e.v==11)||{},
			k12 = kl.kLevel.find(e=>e.v==12)||{},
			k13 = kl.kLevel.find(e=>e.v==13)||{}
		
		// for (let s of [21,22,23,25,26,27,28,29]) {
		// 	if(!e['t'+s]) e['t'+s] = {}
		// }
		let gd = this.zz.toObj(this.zz.dict.kmlGrade)
		
		let items = [
					// {
					// 	prop:'select',
					// 	value:1,
					// 	component: {
					// 		name: "el-radio-group",
					// 		options: [
					// 			{
					// 				label: "基本信息",
					// 				value: 1
					// 			},
					// 			{
					// 				label: "开工报告",
					// 				value: 2
					// 			},
					// 			{
					// 				label: "完工报告",
					// 				value: 3
					// 			},
					// 			{
					// 				label: "验收报告",
					// 				value: 4
					// 			}
					// 		]
					// 	}
					// },
					
				
					{
						props: { 'label-width': '0px' },
						component: ({ h }) => {
							return h(
								'el-divider',
								{
									props: { 'content-position': 'left' }
								},
								'基本信息'
							);
						}
					},
					
					{
						label: "路段名称",
						component: ({ h }) => {
							return h('b', { style: 'color: #00344c' }, e.name);
						}
					},
					{
						label: "归属部门",
						span: 12,
						component: ({ h }) => {
							return h('b', { style: 'color: #550000' }, this.zz.dict.dept[e.deptId]);
						}
					},
					{
						label: "线路等级",
						span: 12,
						component: ({ h }) => {
							return h('b', { style: 'color: #00007f' },  gd[e.grade].label);
						}
					},
					{
						label: "线路长度",
						span: 12,
						component: ({ h }) => {
							return h('b', { style: 'color: #00007f' }, e.len +'m');
						}
					},
					
					{
						props: { 'label-width': '0px' },
						component: ({ h }) => {
							return h(
								'el-divider',
								{
									props: { 'content-position': 'left' }
								},
								'标距信息'
							);
						}
					},
					{
						component: (
							<div>
								<text class=" text-grey">标距柱：</text>
								<text class="text-blue text-bold">{ e.t28.total }</text>
								<text class="padding-left-xs text-grey">指引柱：</text>
								<text class="text-green text-bold">{ e.t29.total }</text>
								<text class="padding-left-xs text-grey">合计：</text>
								<text class="text-dark text-bold">{ e.t28.total + e.t29.total }</text>
								<text class="padding-left-xs text-grey">弃用：</text>
								<text class="text-dark text-bold">{ e.t28['-1']||0 + e.t29['-1']||0 }</text>
								<text class="padding-left-xs text-grey">有效数：</text>
								<text class="text-red text-bold">{ (e.t28.total + e.t29.total) - (e.t28['-1']||0 + e.t29['-1']||0)  }</text>
							</div>
						)
					},
					{
						props: { 'label-width': '0px' },
						component: ({ h }) => {
							return h(
								'el-divider',
								{
									props: { 'content-position': 'left' }
								},
								'标牌信息'
							);
						}
					},
					{
						component: (
							<div>
								<text class="text-grey">入口引导牌：</text>
								<text class="text-blue text-bold">{ e.t21.total||0 }</text>
								<text class="padding-left-xs text-grey">主信息牌：</text>
								<text class="text-blue text-bold">{ e.t22.total||0 }</text>
								<text class="padding-left-xs text-grey">二级信息牌：</text>
								<text class="text-blue text-bold">{ e.t23.total||0 }</text>
								
								<text class="padding-left text-grey">禁止牌：</text>
								<text class="text-red text-bold">{ e.t25.total||0 }</text>
								<text class="padding-left-xs text-grey">警示牌：</text>
								<text class="text-yellow text-bold">{ e.t26.total||0 }</text>
								<text class="padding-left-xs text-grey">提示牌：</text>
								<text class="text-green text-bold">{ e.t27.total||0 }</text>
							</div>
						)
					},
					{
						props: { 'label-width': '0px' },
						component: ({ h }) => {
							return h(
								'el-divider',
								{
									props: { 'content-position': 'left' }
								},
								'路况等级'
							);
						}
					},
					{
						component: (
							<div>
								<text class="text-grey">一级：</text>
								<text class="text-blue text-bold">{ k11.num||0 }</text>
								<text class="padding-left-xs text-grey">段</text>
								<text class="padding-left-xs text-blue text-bold">{ k11.len||0 }</text>
								<text class="text-grey">km</text>
								
								<text class="padding-left-sm text-grey">二级：</text>
								<text class="text-orange text-bold">{ k12.num||0 }</text>
								<text class="padding-left-xs text-grey">段</text>
								<text class="padding-left-xs text-orange text-bold">{ k12.len||0 }</text>
								<text class="text-grey">km</text>
								
								<text class="padding-left-sm text-grey">三级：</text>
								<text class="text-red text-bold">{ k13.num||0 }</text>
								<text class="padding-left-xs text-grey">段</text>
								<text class="padding-left-xs text-red text-bold">{ k13.len||0 }</text>
								<text class="text-grey">km</text>
							</div>
						)
					},
					{
						props: { 'label-width': '0px' },
						component: ({ h }) => {
							return h(
								'el-divider',
								{
									props: { 'content-position': 'left' }
								},
								'填报信息'
							);
						}
					}
			],
			
			declar = e.cst<10? [{
						prop: 'invest',
						label: '拟投资(万元)',
						value: e.invest,
						span: 12,
						component: {
							name: 'el-input-number',
							attrs: {
								placeholder: '请输入拟投资金额'
							}
						},
						rules: {
							required: true,
							message: '投资金额不能为空'
						}
					},
					{
						prop: 'ondate',
						label: '拟建周期',
						value: e.ondate,
						span: 24,
						component: {
							name: 'el-date-picker',
							attrs: {
								type:'daterange',
								'value-format': 'yyyy-MM-dd',
								'start-placeholder': '开建日期',
								'end-placeholder': '完成日期',
							}
						},
						rules: {
							required: true,
							message: '投资金额不能为空'
						}
					},
					{
						prop: 'desc',
						label: '备注',
						span: 24,
						value: e.desc,
						component: {
							name: 'el-input',
							props: {
								type: 'textarea',
								autosize:true,
								rows: 6
							}
						}
					},
					{
						component: ({ h }) => {
							return h('i', { style: 'color: #aa5500' }, '注：请先配置标牌信息再作填报！');
						}
					}]:[{
						label: "拟投资(万元)",
						span: 12,
						component: ({ h }) => {
							return h('b', { style: 'color: #00007f' }, e.invest);
						}
					},
					{
						label: "拟建周期",
						component: ({ h }) => {
							return h('b', { style: 'color: #00007f' }, e.ondate[0]+' — '+e.ondate[1]);
						}
					},
					{
						label: "备注",
						component: ({ h }) => {
							return h('b', { style: 'color: #464646' }, e.desc);
						}
					}]
					
		items = items.concat(declar)
		this.$crud.openForm({
			title: e.cst>=10?'建设实施':'实施计划填报',
			width: '800px',
			props: { "label-width": "122px" },
			items,
			op: {hidden: e.cst>=10},
			on: {
				load(data, { close, done, submit }) {
					// console.log("窗口打开事件");
				},
				submit: async (data, { close, done }) => {
					data._id = e._id
					await this.$service.zts.constr[method]({ ...data })
					this.$message.success("保存成功")
					
					close(1)
				},
				close(done) {
					close(0)
					done();
				}
			}
		})
	}
};
</script>