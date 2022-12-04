<template>
	<cl-crud ref="crud" @load="onCrudLoad" boder v-loading="loading">
		<el-row type="flex">
			<cl-refresh-btn />
			<el-button size="mini" type="primary" @click="edit(false)">导入</el-button>
			<!-- <cl-multi-delete-btn>作废</cl-multi-delete-btn> -->
			<cl-flex1 />
			<cl-filter label="类型">
				<el-select
					style="width: 60px;"
					size="mini"
					v-model="qr.type"
					@change="
						(val) => {
							refresh({
								type: val,
								page: 1
							});
						}
					"
				>
					<block v-for="(t, idx) of kt" :key="idx">
						<el-option :value="t.value" :label="t.label"></el-option>
					</block>
				</el-select>
			</cl-filter>
			<cl-search-key field="name" v-model="qr.name" placeholder="请输入轨迹名称"></cl-search-key>
		</el-row>
		<div>
		<el-row>
			<cl-table :contextMenu="[]"
				v-loading="loading"
				@selection-change="onSelect"
				:props="{
					'default-sort': {
						prop: 'updateTime',
						order: 'descending'
					},
					'highlight-current-row':true,
					'row-style': {'height':'20px'}
				}"
				:columns="[
					{
						type: 'selection',
						align: 'center',
						width: '60'
					},
					{
						prop: 'departmentId',
						label: '部门',
						align: 'center',
						dict: dept
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
						prop: 'desc',
						label: '备注',
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
						buttons: ['slot-edit', 'slot-draw', 'slot-camera', 'slot-download', 'slot-del']
					}
				]"
			>
				<!-- 时间 -->
				<template #column-updateTime="{ scope }">
					{{ scope.row.updateTime.substring(0, 16) }}
				</template>
				<template #column-type="{ scope }">
					<el-tag size="mini" style="margin-left: 4px;" effect="plain">{{ tt(scope.row.type) }}</el-tag>
				</template>
				
				<template #slot-edit="{ scope }">
					<el-button type="text" size="mini" @click="edit(scope.row)">编辑</el-button>
				</template>
				<template #slot-draw="{ scope }">
					<!-- <el-button type="text" size="mini" @click="draw(scope.row)" v-permission="$service.zts.kml.permission.design">设计</el-button> -->
					<el-button type="text" size="mini" @click="draw(scope.row)">详情</el-button>
				</template>
				<template #slot-camera="{ scope }">
					<el-button type="text" size="mini" @click="camera(scope.row)">循迹</el-button>
				</template>
				<template #slot-download="{ scope }">
					<el-button type="text" size="mini" @click="download(scope.row)">下载</el-button>
				</template>
				<template #slot-del="{ scope }">
					<block v-if="scope.row.status == -1">
						<el-button type="danger" size="mini" @click="del(scope.row)">删除</el-button>
					</block>
				</template>
				
				
			</cl-table>
		</el-row>
		</div>
		<div class="padding-xxs bg-gray solid">
			<cl-pagination  />
		</div>
	</cl-crud>
</template>
<script>
import { mapGetters } from "vuex";
// import { kmlType } from "@/cool/utils/dict.js"
// import { upload } from "@/cool/utils/uploadKml.js"
// import { getLable } from "@/config/dict"
// import { clone } from "@/cool/utils/ztool.js"
// import { checkPerm } from "@/cool/permission/index.js";

export default {
	data() {
		return {
			dept: getLable(),
			loading: false,
			qr:{type:0,name:''},
			
			kt: [{label:"不限", value:0},...kmlType],
			tt: (e)=>{ for (let s of kmlType) { if(s.value==e)return s.label } },
			t: {
				on: {
					"row-click": (row) => {
						// console.log(row);
						this.$emit('on',row)
					}
				}
			}
		};
	},
	computed: {
		...mapGetters(['userInfo'])
	},
	props: {
		ids: { type: Array },
		deptId: { type: Number }
	},
	watch: {
		ids: {
			deep: true,
			handler(v) {
				this.refresh({type: this.qr.type, dpids: this.ids, page: 1})
			}
		}
	},
	methods: {
		refresh(params) {
			this.$refs['crud'].refresh(params);
		},
		onCrudLoad({ ctx, app }) {
			ctx.service(this.$service.zts.kml).done();
			app.refresh({
				children: false,
				dpids: this.ids,
				type: this.qr.type,
				name: this.qr.name
			});
		},
		onSelect(e){
			this.$emit('on',e)
		},
		edit(kml) {
			let kt = [
						{label:"绘制草稿", value:2},
						{label:"优化方案", value:3},
						{label:"本区规划", value:4},
						{label:"推荐路线", value:60}
					]
					
			if(kml&&kml.type==9){
				kt = [{label:"采集", value:9}]
			}
			if(checkPerm(this.$service.zts.kml.permission.design)) {
				kt = clone(kmlType)
			}
			upload.call(this, { kml, e:{coord:true, ids: this.ids}, kt});
		},
		draw(e) {
			uni.setStorageSync('collect_check', e._id)
			this.$router.push('/pages/zts/map/map')
		},
		camera(e) {
			uni.setStorageSync('kml_camera', e._id);
			this.$router.push('/pages/zts/map/camera');
		},
		download(e){
			this.loading = true;
			this.$service.zts.kml.download({id:e.id}).then(url => {
				window.location.href = url
				
				//下载后自动删除云端文件
				let t = this
				setTimeout(function() {
					t.$service.space.info.delete({ url })
				}, 3000)
				
			}).catch(e=>{
				this.$message.error(e)
			}).done(() => {
				this.loading = false;
			})
		},
		del(e){
			if(!this.userInfo.admin && this.userInfo._id!=e.userId) return this.$message.error("没有权限（删除数据必须由采集员本人操作）！")
			this.$confirm("此操作将永久删除选中数据，是否继续？", "高风险提示", {
				type: "warning"
			}).then((res) => {
				if (res === "confirm") {
					this.loading = true;
					this.$service.zts.kml.kill({ ids: [e._id] })
						.then((res) => {
							this.$message.success("删除成功");
							this.loading = false;
							this.refresh()
						}).catch((err) => {
							this.$message.error(err);
						});
				}
			}).catch(() => null);
		},
	}
};
</script>
