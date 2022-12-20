<template>
	<cl-layout>
		<div class="system-user">
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
							<cl-flex1 />
							<cl-filter label="状态">
								<el-select size="mini" v-model="status" @change="refresh()">
									<el-option value="" label="全部"></el-option>
									<el-option :value="1" label="草稿"></el-option>
									<el-option :value="2" label="待审核"></el-option>
									<el-option :value="10" label="已审核"></el-option>
								</el-select>
							</cl-filter>
							<cl-filter label="等级">
								<el-select size="mini" v-model="level" @change="refresh()">
									<el-option :value="0" label="全部"></el-option>
									<block v-for="(t, index) in poi.level" :key="index">
										<el-option :value="t.value" :label="t.text"></el-option>
									</block>
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
											prop: 'level',
											label: '类型',
											align: 'center'
										},
										{
											prop: 'type',
											label: '类别',
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
								<template #column-level="{ scope }">
									<block v-for="(i, idx) of poi.level" :key="idx">
										<el-tag v-if="i.value==scope.row.level" size="mini" style="margin-left: 4px;" effect="plain">{{ i.text }}</el-tag>
									</block>
								</template>
								<template #column-type="{ scope }">
									<block v-for="(i, idx) of scope.row.type" :key="idx">
										<el-tag size="mini" style="margin-left: 4px;" effect="plain" type="success">
											{{ poiType(i) }}
										</el-tag>
									</block>
								</template>

								<template #column-status="{ scope }">
									<el-tag size="small" effect="dark" :type="poi.st[scope.row.status].type">
										{{ poi.st[scope.row.status].text }}
									</el-tag>
								</template>

								<template #slot-edit="{ scope }">
									<el-button type="text" size="mini" @click="edit(scope.row)">编辑</el-button>
								</template>
								<template #slot-detail="{ scope }">
									<el-button type="text" size="mini" @click="detail(scope.row)">预览</el-button>
								</template>
								<template #slot-veri="{ scope }">
									<el-button type="text" size="mini"
										v-if="scope.row.status!==4&&scope.row.status!==10"
										 @click="toAudit(scope.row)" 
										 v-permission="$service.zts.kml.permission.verify">审核</el-button>
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
			<!-- <zz-qrcode :url="shareUrl"></zz-qrcode> -->
		</cl-dialog>
		
		<zts-audit :tar="'poi'" :type="'资源信息'" :cur="cur" @refresh="refresh"></zts-audit>
		
	</cl-layout>
	<!-- </cl-layout> -->
</template>

<script>
	//var QRCode = require("qrcode-svg");
	import { poi } from "@/cool/utils/dict.js"
	import { checkPerm } from "@/cool/permission"

	export default {
		data() {
			return {
				poi: this.$store.getters.dict.poi,
				dept: this.$store.getters.deptLabel,
				level: 0,
				status: '',
				winStyle: '',
				expand: this.$store.getters.userInfo.isLeaf,
				
				preview: false,
				svg: 'https://zts.5618.co/static/loadding.gif',
				epxorting: false,
				cur: {}
			};
		},
		async mounted() {
			console.log(this.poi);
			
		},
		methods: {
			deptExpand() {
				this.expand = !this.expand;
			},
			deptSet(e) {
				this.dpids = e
				this.refresh()
			},
			refresh() {
				this.$refs['crud'].refresh({
					page: 1,
					dpids: this.dpids,
					status: this.status,
					level: this.level? this.level: [1,2,3,4,5,6]
				});
			},
			onCrudLoad({ ctx, app }) {
				ctx.service(this.$service.zts.poi).done();
				app.refresh({
					page: 1,
					isoDept: true,
					level: [1,2,3,4,5,6]
				});
			},
			poiType(value) {
				let v = ''
				for (let k in this.poi) {
					for (let s of this.poi[k]) {
						if(s.value==value) return s.text
					}
				}
				return v
			},
			edit(e) {
				if(e && e.userId != this.$store.getters.userInfo._id && (!checkPerm(this.$service.zts.kml.permission.superEdit))) return this.$message.error(`无法更新他人数据！`);
				this.$router.push({
					path: '/pages/zts/declare/resource/poi/edit',
					query: {_id:e? e._id:0}
				});
			},
			detail(e) {
				this.zz.preview({path:'/pages/planning/poi',id:e._id})
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
