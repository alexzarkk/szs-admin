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
			<el-button type="warning" :disabled="selected.length!=2" size="mini" @click="merge" v-permission="$service.zts.kml.permission.merge">合并</el-button>
			<el-button size="mini" type="success" :disabled="selected.length != 1" @click="toMove()" v-permission="$service.zts.kml.permission.move">转移</el-button>
			
			<cl-flex1 />
			<cl-filter label="等级">
				<el-select size="mini" v-model="onGrade" @change="refresh">
					<el-option value="" label="全部"></el-option>
					<block v-for="(k, i) of grade" :key="i">
						<el-option :value="k.value" :label="k.label"></el-option>
					</block>
				</el-select>
			</cl-filter>
			<cl-filter label="状态" v-if="status.length>1">
				<el-select
					size="mini"
					v-model="onStatus"
					@change="refresh"
				>
					<el-option value="" label="全部"></el-option>
					<block v-for="(k, i) of st" :key="i">
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
						dict: dept
					},
					{
						prop: 'name',
						label: '名称',
						align: 'center'
					},

					{
						prop: 'collectorname',
						label: '采集员',
						align: 'center'
					},
					
					{
						prop: 'startTime',
						label: '采集时间',
						align: 'center',
						sortable: 'custom',
						'min-width': 132
					},
					{
						prop: 'createTime',
						label: '上传时间',
						align: 'center',
						sortable: 'custom'
					},
					
					{
						prop: 'status',
						label: '状态',
						align: 'center',
						dict: st
					},
					{
						type: 'op',
						align: 'center',
						width: 150,
						buttons: ['slot-detail','slot-del','slot-report']
					}
				]"
			>
			<!-- 采集时间 -->
			<template #column-startTime="{ scope }">
				{{ scope.row.startTime.substring(0,16) + ' - ' + scope.row.endTime.substring(11,16)}}
			</template>
			<!-- 上传时间 -->
			<template #column-createTime="{ scope }">
				{{ scope.row.createTime.substring(0,16)}}
			</template>
			
			<template #slot-detail="{ scope }">
				<el-button type="text" size="mini" @click="detail(scope.row)">详情</el-button>
			</template>
			<template #slot-del="{ scope }">
				<block v-if="scope.row.status ==-1">
					<el-button type="text" size="mini" @click="del(scope.row)">删除</el-button>
				</block>
			</template>
			<template #slot-report="{ scope }">
				<block v-if="scope.row.status ==4">
					<el-button type="text" size="mini" @click="report(scope.row)">审核报告</el-button>
				</block>
			</template>
			</cl-table>
		</el-row>

		<el-row type="flex">
			<cl-flex1 />
			<cl-pagination />
		</el-row>
		<cl-form ref="dept-move"> </cl-form>
	</cl-crud>
	
</template>

<script>
	
import { mapGetters } from "vuex";
import { getLable } from "@/config/dict";
import { kmlSt, kmlGrade } from "@/cool/utils/dict"
import { checkPerm } from "@/cool/permission";
import { openWin } from "@/cool/utils"

export default {
	data() {
		return {
			grade: kmlGrade,
			onGrade: '',
			st: kmlSt,
			onStatus: '',
			name: '',
			selected:[],
			dept: getLable(),
			loading:false
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
					type:9,
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
				type: 9
			});
		},
		deptExpand(e){
			this.$emit('update:expand',!this.expand)
		},
		check(e) {
			uni.setStorageSync('collect_check', e._id)
			this.$router.push('/pages/zts/map/map')
		},
		detail(e){
			console.log(e);
			this.check(e)
		},
		report(e){
			uni.setStorageSync('collect_report', e._id)
			openWin("/#/pages/zts/collect/report")
		},
		del(e){
			if(!this.userInfo.admin && this.userInfo._id!=e.userId) return this.$message.error("没有权限（删除数据必须由采集员本人操作）！")
			this.$confirm("此操作将永久删除选中数据，是否继续？", "高风险提示", {
				type: "warning"
			}).then((res) => {
				if (res === "confirm") {
					this.loading = true
					this.$service.zts.kml.kill({ ids: [e._id] })
						.then((res) => {
							this.$message.success("删除成功");
							this.refresh()
							this.loading = false
						}).catch((err) => {
							this.$message.error(err);
						});
				}
			}).catch(() => null);
		},
		onSelect(e){
			this.selected = e
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
		
		
		toMove(e) {
			// console.log(e)
			let kmlId = [],
				dept = this.list
		
			if (!e) {
				kmlId = this.selected[0]._id
			} else {
				kmlId = e._id
			}
		
			this.$refs["dept-move"].open({
				props: {
					title: "部门转移",
					width: "600px",
					"label-width": "80px"
				},
				items: [
					{
						label: "选择部门",
						prop: "dept",
						component: {
							name: "system-user__dept-move",
		
							methods: {
								selectRow(e) {
									this.$emit("input", e);
								}
							},
		
							render() {
								return (
									<div
										style={{
											border: "1px solid #eee",
											"border-radius": "3px",
											padding: " 2px"
										}}>
										<el-tree
											data={dept}
											{...{
												props: {
													props: {
														label: "name"
													}
												}
											}}
											node-key="id"
											highlight-current
											on-node-click={this.selectRow}></el-tree>
									</div>
								);
							}
						}
					}
				],
				on: {
					submit: (data, { done, close }) => {
						if (!data.dept) {
							this.$message.warning("请选择部门");
							return done();
						}
						console.log('data',data,kmlId)
		
						const { name, id } = data.dept;
		
						this.$confirm(`是否将数据转移到部门 ${name} 下`, "提示", {
							type: "warning"
						}).then(() => {
							this.$service.zts.kml.update({   // 更新状态
								departmentId: id,
								_id: kmlId
							}).then(() => {
								this.$message.success("转移成功");
								close();
								this.refresh();
							}).catch((err) => {
								this.$message.error(err);
								done();
							});
						}).catch(() => {});
					}
				}
			});
		}
	}
};
</script>
