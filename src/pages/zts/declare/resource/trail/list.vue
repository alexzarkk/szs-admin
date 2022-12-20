<template>
	<!-- 
			@name:资源类查看/审核页面
			@desc：
			@date：2021-09-10
			@author: ZK
	 -->
	<cl-layout>
		<div class="system-user" :style="winStyle">
			<div class="pane">
				<!-- 部门区域 -->
				<div class="dept" :class="[!expand ? '_expand' : '_collapse']">
					<cl-dept-tree :deptId="$store.getters.userInfo.dept.id" @check="deptSet"></cl-dept-tree>
				</div>
				<!-- 资源列表 -->
				<div class="user">
					<cl-crud ref="crud" @load="onCrudLoad" boder>
						<el-row type="flex">
							<view class="flex align-center">
								<div class="icon padding-lr-xs" @click="deptExpand">
									<i class="cursor el-icon-arrow-right" v-if="expand"></i>
									<i class="cursor el-icon-arrow-left" v-else></i>
								</div>
							</view>
							<cl-refresh-btn />
							<el-button size="mini" type="primary" @click="edit(false)">新增</el-button>
							<!-- <el-button size="mini" :loading="epxorting" class="filter-item" type="primary" icon="el-icon-download" @click="download">
									导出 Excel
								</el-button> -->
							<cl-multi-delete-btn />
							<el-button size="mini" type="success" @click="track">轨迹管理</el-button>
							<cl-flex1 />
							<cl-filter label="状态">
								<el-select size="mini" v-model="queryParams.status" @change="refresh()">
									<el-option value="" label="全部"></el-option>
									<el-option :value="1" label="草稿"></el-option>
									<el-option :value="2" label="待审核"></el-option>
									<el-option :value="10" label="已审核"></el-option>
								</el-select>
							</cl-filter>
							<cl-search-key />
						</el-row>

						<el-row>
							<cl-table :contextMenu="[]"
								:props="{
										'default-sort': {
											prop: 'updateTime',
											order: 'descending'
										}
									}" :columns="[
										{
											type: 'selection',
											align: 'center',
											width: '60'
										},
										{
											prop: 'deptId',
											label: '部门',
											align: 'center',
											dict: dept
										},
										{
											prop: 'user',
											label: '用户',
											align: 'center',
										},
										{
											prop: 'name',
											label: '名称',
											align: 'center'
										},
										{
											prop: 'type',
											label: '类型',
											align: 'center'
										},
										{
											prop: 'status',
											label: '状态',
											align: 'center'
										},
										{
											prop: 'updateTime',
											label: '更新时间',
											align: 'center',
											sortable: 'custom'
										},
										{
											label: '操作',
											align: 'center',
											type: 'op',
											buttons: ['slot-edit', 'slot-detail', 'slot-veri']
										}
									]">
								<!-- 时间 -->
								<template #column-updateTime="{ scope }">
									{{ scope.row.updateTime.substring(0, 16) }}
								</template>
								
								<template #column-user="{ scope }">
									{{ scope.row.userInfo.name }}
								</template>
								<template #column-type="{ scope }">
									<block v-for="(i, idx) of scope.row.type" :key="idx">
										<el-tag size="mini" style="margin-left: 4px;" effect="plain" type="success">
											{{ trailObj[i].label }}
										</el-tag>
									</block>
								</template>

								<template #column-status="{ scope }">
									<el-tag size="small" effect="dark" :type="st[scope.row.status].type">
										{{ st[scope.row.status].text }}
									</el-tag>
								</template>

								<template #slot-edit="{ scope }">
									<el-button type="text" size="mini" @click="edit(scope.row)">编辑</el-button>
								</template>
								<template #slot-detail="{ scope }">
									<el-button type="text" size="mini" @click="detail(scope.row)">预览</el-button>
								</template>
								<template #slot-veri="{ scope }">
									<el-button 
									v-if="scope.row.status!==4&&scope.row.status!==10"
									type="text" size="mini" @click="toAudit(scope.row)"
										v-permission="$service.zts.kml.permission.verify"
										>审核</el-button>
									<!-- <el-button type="text" size="mini" @click="clFormShow(scope.row)"
											v-permission="$service.zts.kml.permission.verify">审核</el-button> -->
								</template>
							</cl-table>
						</el-row>

						<el-row type="flex">
							<cl-flex1 />
							<cl-pagination />
						</el-row>
					</cl-crud>

				</div>
			</div>
		</div>

		<cl-dialog :title="'扫码预览'" :height="'200px'" :width="'240px'" :controls="['close']" :visible.sync="preview">
			<image style="width: 200px; height: 200px;" mode="aspectFill" :src="svg"></image>
		</cl-dialog>
		
		<zts-audit :tar="'trail'" :type="'特色路线'" :cur="cur" @refresh="refresh"></zts-audit>
		
	</cl-layout>
	<!-- </cl-layout> -->
</template>

<script>
	//var QRCode = require("qrcode-svg");
	import { getLable, getCids } from "@/config/dict";
	import { trail,poi } from "@/cool/utils/dict.js"

	export default {
		data() {
			return {
				trail,
				trailObj: this.zz.toObj(trail.type),
				st: poi.st,
				queryParams: {
					level: 0,
					status: '',
					isoDept: true,
					page: 1
				},
				winStyle: '',
				expand: this.$store.getters.userInfo.isLeaf,
				dept: getLable(),
				preview: false,
				svg: 'https://zts.5618.co/static/loadding.gif',
				epxorting: false,
				cur: {}
			};
		},
		watch: {
			lay: {
				deep: true,
				handler(v) {
					this.winStyle = `width:${this.lay.width}px; height:${this.lay.height}px;`
				}
			}
		},
		methods: {
			deptExpand() {
				this.expand = !this.expand;
			},
			deptSet(e) {
				this.queryParams.dpids = e
				this.refresh()
			},
			refresh() {
				this.$refs['crud'].refresh(this.queryParams);
			},
			onCrudLoad({ ctx, app }) {
				
				console.log(this.trailObj);
				
				ctx.service(this.$service.zts.trail).done();
				app.refresh(this.queryParams);
			},
			edit(e) {
				this.$router.push({
					path: '/pages/zts/declare/resource/trail/edit',
					query: {_id:e? e._id:0}
				});
			},
			track(){
				this.$router.push({
					path: '/pages/zts/declare/resource/trail/track/t60',
					query: {}
				});
			},
			async detail(e) {
				if (!this.preview) {
					this.preview = true
					let qrcode = new QRCode({
						content: "https://zts.5618.co/h5/#/pages/share?path=/pages/planning/detail&id=" + e._id,
						join: true
					});
					let svg = qrcode.svg();

					await this.$service.zts.trail.preview({
						file: svg
					}).then(e => {
						this.svg = e
					})
					let t = this
					setTimeout(function() {
						t.$service.space.info.delete({ url: t.svg })
					}, 3000)
				}
			},
			toAudit(e){
				this.cur = {}
				setTimeout(()=> {this.cur = e}, 10)
			}
		}
	};
</script>
<style lang="scss" scoped>
	.system-user {
		.pane {
			display: flex;
			height: 100%;
			position: relative;
		}

		.dept {
			height: 100%;
			width: 200px;
			border: 1px solid #e9ecf1;
			background-color: #fff;
			overflow-y: auto;
			overflow-x: hidden;
			transition: width 0.3s;
			margin-right: 8px;

			&._collapse {
				margin-right: 0;
				width: 0;
			}
		}

		.user {
			width: calc(100% - 310px);
			flex: 1;
		}
	}
</style>
