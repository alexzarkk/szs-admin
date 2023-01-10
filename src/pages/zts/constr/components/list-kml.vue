<template>
	<cl-crud ref="crud" @load="onCrudLoad" boder>
		<el-row type="flex">
			<view class="flex align-center">
				<div class="icon padding-lr-xs" @click="deptExpand">
					<i class="cursor el-icon-arrow-right" v-if="expand"></i>
					<i class="cursor el-icon-arrow-left" v-else></i>
				</div>
			</view>
			<cl-refresh-btn />
			<cl-multi-delete-btn>作废</cl-multi-delete-btn>
			<!-- <el-button type="warning" size="mini" :disabled="selected.length!=2" @click="merge" v-permission="$service.zts.kml.permission.merge">合并</el-button> -->
			
			<cl-flex1 />
			<cl-filter label="等级">
				<el-select size="mini" v-model="onGrade" @change="refresh">
					<el-option value="" label="全部"></el-option>
					<block v-for="(k, i) of $store.getters.dict.kmlGrade" :key="i">
						<el-option :value="k.value" :label="k.label"></el-option>
					</block>
				</el-select>
			</cl-filter>
			<cl-filter label="状态" v-if="status.length>1">
				<el-select size="mini" v-model="onStatus" @change="refresh" >
					<el-option value="" label="全部"></el-option>
					<block v-for="(k, i) of $store.getters.dict.kmlSt" :key="i">
						<block v-for="(x, j) of status" :key="'1'+j">
							<el-option v-if="x==k.value" :value="k.value" :label="k.label"></el-option>
						</block>
					</block>
				</el-select>
			</cl-filter>
			<cl-search-key />
		</el-row>

		<el-row>
			<cl-table :contextMenu="[]"
				v-loading="loading"
				@selection-change="onSelect"
				:props="{
					'default-sort': {
						prop: 'updateTime',
						order: 'descending'
					}
				}"
				:columns="[
					{
						type: 'selection',
						align: 'center',
						width: '50'
					},
					{
						prop: 'departmentId',
						label: '部门',
						align: 'center',
						dict: $store.getters.deptLabel
					},
					{
						prop: 'name',
						label: '名称',
						align: 'center'
					},
					{
						prop: 'grade',
						label: '等级',
						align: 'center',
						sortable: 'custom',
						dict: $store.getters.dict.kmlGrade
					},
					{
						prop: 'user',
						label: '巡线员',
						align: 'center'
					},
					{
						prop: 'startTime',
						label: '巡线时间',
						align: 'center',
						sortable: 'custom',
						'min-width': 132
					},
					{
						prop: 'cps',
						label: '检查点',
						align: 'center',
					},
					{
						prop: 'updateTime',
						label: '更新时间',
						align: 'center',
						sortable: 'custom',
						width: 130
					},
					{
						prop: 'status',
						label: '状态',
						align: 'center',
						dict: $store.getters.dict.kmlSt
					},
					{
						type: 'op',
						align: 'center',
						width: 150,
						buttons: [ 'slot-btn']
					}
				]"
			>
			<!-- 采集时间 -->
			<template #column-startTime="{ scope }">
				{{ scope.row.startTime.substring(0,16) + ' - ' + scope.row.endTime.substring(11,16)}}
			</template>
			<template #column-user="{ scope }">
				{{ scope.row.userInfo.name }}
			</template>
			
			<!-- 更新时间 -->
			<template #column-updateTime="{ scope }">
				{{ scope.row.updateTime.substring(0,16) }}
			</template>
			
			<template #slot-btn="{ scope }">
				<el-button type="text" size="mini" @click="detail(scope.row)">详情</el-button>
				<el-button type="text" size="mini" @click="share(scope.row)">分享</el-button>
				<el-button v-if="scope.row.status!=6" type="text" size="mini" @click="report(scope.row)">审核报告</el-button>
			</template>
			
			</cl-table>
		</el-row>

		<el-row type="flex">
			<cl-flex1 />
			<cl-pagination />
		</el-row>
		
		<el-dialog title="扫码预览" center :visible.sync="preview" :width="'240px'">
		    <zz-qrcode v-if="preview" :url="shareUrl"></zz-qrcode>
		</el-dialog>
		
	</cl-crud>
	
</template>

<script>
import { mapGetters } from "vuex";
import { checkPerm } from "@/cool/permission";

export default {
	data() {
		return {
			onGrade: '',
			onStatus: '',
			name: '',
			selected:[],
			
			loading:false,
			moveDept: false,
			preview: false,
			shareUrl: '',
		};
	},
	computed: {
		...mapGetters(['userInfo'])
	},
	props: {
		list: { type: Array },
		ids: { type: Array },
		status: { type: Array },
		expand: { type: Boolean }
	},
	watch: {
		ids: {
			deep: true,
			handler(v) {
				this.refresh()
			}
		}
	},
	methods: {
		refresh(e) {
			this.$refs["crud"].refresh({
					type: 40,
					dpids: this.ids,
					page: 1,
					status: this.onStatus || this.status,
					grade: this.onGrade,
					name: this.name,
					children: false,
				});
		},
		onCrudLoad({ ctx, app }) {
			ctx.service(this.$service.zts.kml).done();
			app.refresh({
				isoDept: true,
				children: false,
				status: this.onStatus || this.status,
				grade: this.onGrade,
				ui: true,
				type: 40
			});
		},
		onSelect(e){ this.selected = e },
		deptExpand(e){
			this.$emit('update:expand',!this.expand)
		},
		report(e) {
			uni.setStorageSync('constr_kml', e._id)
			this.zz.openWin({url: '#/pages/zts/constr/verify'})
		},
		detail(e){
			uni.setStorageSync('collect_check', e._id)
			this.$router.push('/pages/zts/map/map')
		},
		
		
		merge(){
			let x = this.selected, uid = this.userInfo._id
			if(x[0].status != x[1].status) return this.$message.error('状态错误（数据状态必须相同）！');
			if(!checkPerm(this.$service.zts.kml.permission.verify)) {
				if((uid != x[0].userId || uid != x[1].userId) || x[0].userId != x[1].userId) return this.$message.error('没有权限（不能合并他人数据）！');
				if(x[0].status>=10 || x[1].status>=10) return this.$message.error('无法合并已经审核的数据！');
			}
			
			this.$confirm("数据合并是不可逆操作，是否继续？", "高风险提示", {
				type: "warning"
			}).then((res) => {
				if (res === "confirm") {
					this.$service.zts.kml.merge({ ids: x.map(e=> e._id) })
						.then((res) => {
							this.$message.success("合并成功！");
							this.refresh()
						}).catch((err) => {
							this.$message.error(err);
						});
				}
			}).catch(() => null);
		},
		
		share(e) {
			this.preview = true
			this.shareUrl = 'path=/pages/comm/kml&_id=' + e._id
		},
		
	}
};
</script>
