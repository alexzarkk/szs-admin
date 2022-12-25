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
								<div class="icon padding-lr-xs" @click="expand = !expand">
									<i class="cursor el-icon-arrow-right" v-if="expand"></i>
									<i class="cursor el-icon-arrow-left" v-else></i>
								</div>
							</view>
							<cl-refresh-btn />
							<el-button size="mini" type="primary" @click="edit({})">新增</el-button>
							<cl-multi-delete-btn />
							<cl-flex1 />
							
							<cl-filter label="状态">
								<el-select size="mini" v-model="status" @change="refresh()">
									<el-option :value="0" label="全部"></el-option>
									<block v-for="(st, idx) in $store.getters.dict.commSt" :key="idx">
										<el-option :value="st.value" :label="st.label"></el-option>
									</block>
								</el-select>
							</cl-filter>
							
							<cl-filter label="类型">
								<el-select size="mini" v-model="level" @change="refresh()">
									<el-option :value="0" label="全部"></el-option>
									<block v-for="(t, index) in tar" :key="index">
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
											dict: $store.getters.deptLabel
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
											prop: 'cover',
											label: '封面',
											align: 'center'
										},
										{
											prop: 'level',
											label: '类型',
											align: 'center'
										},
										{
											prop: 'grade',
											label: '等级',
											align: 'center'
										},
										{
											prop: 'cfg',
											label: '配置',
											align: 'center',
											width: 240
										},
										{
											prop: 'curSt',
											label: '建设状态',
											align: 'center'
										},
										{
											prop: 'status',
											label: '填报状态',
											align: 'center',
											dict: $store.getters.dict.commSt
										},
										{
											label: '操作',
											align: 'center',
											type: 'op',
											buttons: ['slot-btn']
										}
									]">
								<!-- 时间 -->
								<template #column-updateTime="{ scope }">
									{{ scope.row.updateTime.substring(0, 16) }}
								</template>
								<template #column-cover="{ scope }">
									<template v-if="scope.row.cover">
										<el-image style="width: 70px; height: 70px" fit="cover" :src="scope.row.cover" :preview-src-list="[scope.row.cover]"/>
									</template>
								</template>
								<template #column-level="{ scope }">
									<block v-for="(i, idx) of tar" :key="idx">
										<el-tag v-if="i.value==scope.row.level" :type="i.type" size="mini" style="margin-left: 4px;" effect="plain">{{ i.text }}</el-tag>
									</block>
								</template>
								<template #column-grade="{ scope }">
									<block v-for="(i, idx) of grade" :key="idx">
										<el-tag v-if="i.value==scope.row.grade" size="mini" style="margin-left: 4px;" effect="plain">{{ i.text }}</el-tag>
									</block>
								</template>
								<template #column-cfg="{ scope }">
									<block v-for="(i, idx) of scope.row.cfg" :key="idx">
										<el-tag size="mini" style="margin-left: 4px;" effect="plain">{{ $store.getters.dictObj.serveCfg[i].label }}</el-tag>
									</block>
								</template>
								<template #column-curSt="{ scope }">
									<block v-for="(i, idx) of curSt" :key="idx">
										<el-tag v-if="i.value==scope.row.curSt" :type="i.type" size="mini" style="margin-left: 4px;" effect="plain">{{ i.text }}</el-tag>
									</block>
								</template>
								
								<template #column-user="{ scope }">
									{{ scope.row.userInfo.name }}
								</template>
								
								<template #slot-btn="{ scope }">
									<block v-if="scope.row.status>0&&scope.row.status<10">
										<el-button v-if="scope.row.status<6" type="text" size="mini" @click="edit(scope.row)">编辑</el-button>
										<el-button type="text" size="mini" v-if="scope.row.status<6" @click="toSubmit(scope.row,6)">递交审核</el-button>
										<el-button type="text" size="mini" v-else @click="toSubmit(scope.row,4)">撤回审核</el-button>
										<el-button type="text" size="mini" v-if="scope.row.status==6" @click="toAudit(scope.row)" 
											v-permission="$service.zts.kml.permission.verify">审核</el-button>
									</block>
									<el-button type="text" size="mini" @click="preview(scope.row)">预览</el-button>
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
		
		<zts-audit :tt="'station'" :cur="cur" @refresh="refresh()"></zts-audit>
		
	</cl-layout>
</template>

<script>
	export default {
		data() {
			return {
				expand: this.$store.getters.userInfo.isLeaf,
				
				tar: [{text: '驿站',type:'primary',value: 4004}, {text: '户外营地',type:'success',value: 4006}],
				curSt: [{text: '已建成',type:'success', value: 2}, {text: '拟投建',type:'info',value: 1}],
				grade: [{text: '一级',value: 1}, {text: '二级',value: 2}, {text: '三级',value: 3}],
				
				level: 0,
				status: 0,
				dpids: [],
				cur: {}
			};
		},
		methods: {
			deptSet(e) {
				this.dpids = e
				this.refresh()
			},
			refresh() {
				this.$refs['crud'].refresh({
					page: 1,
					level: this.level? this.level: [4004,4006],
					dpids: this.dpids,
					status: this.status
				});
			},
			onCrudLoad({ ctx, app }) {
				ctx.service(this.$service.zts.station).done();
				app.refresh({
					isoDept: true,
					page: 1
				});
			},
			async edit(e) {
				if(await this.$store.dispatch('hasPerm', {obj: e, perms: [this.$service.zts.kml.permission.superEdit]})) {
					uni.setStorageSync('station_edit', e?e._id:0)
					this.$router.push('/pages/zts/declare/resource/station/edit')
				}
			},
			//递交/撤回审核
			async toSubmit(e,status){
				if(await this.$store.dispatch('hasPerm', {obj:e})) {
					let load = this.$loading()
					await this.$service.zts.station.update({ _id: e._id, status })
					load.close()
					this.refresh()
				}
			},
			
			preview(e) {
				this.zz.preview({path:'/pages/planning/poi', id:e._id})
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
