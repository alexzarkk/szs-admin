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
				<!-- <el-button size="mini" type="success" @click="draw">设计</el-button> -->
				<el-button size="mini" type="primary" @click="edit(false)">新增</el-button>
				<el-button
					size="mini"
					type="success"
					:disabled="selected.length != 1"
					@click="toMove()"
					>转移</el-button
				>
				<cl-multi-delete-btn>作废</cl-multi-delete-btn>
				<cl-flex1 />
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
							prop: 'desc',
							label: '备注',
							align: 'center'
						},
						{
							prop: 'user',
							label: '绘制人',
							align: 'center'
						},
						{
							prop: 'createTime',
							label: '创建时间',
							align: 'center',
							sortable: 'custom'
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
							buttons: ['slot-edit', 'slot-draw','slot-share', 'slot-del']
						}
						
					]"
				>
					<!-- 时间 -->
					<template #column-createTime="{ scope }">
						{{ scope.row.createTime.substring(0, 16) }}
					</template>
					<template #column-updateTime="{ scope }">
						{{ scope.row.updateTime.substring(0, 16) }}
					</template>
				<!-- 	<template #column-type="{ scope }">
						<block v-for="(i, idx) of scope.row.type" :key="idx">
							<el-tag size="mini" style="margin-left: 4px;" effect="plain">{{ tt[i].name }}</el-tag>
						</block>
					</template> -->
					
					<template #slot-edit="{ scope }">
						<el-button type="text" size="mini" @click="edit(scope.row)">编辑</el-button>
					</template>
					<template #slot-draw="{ scope }">
						<el-button type="text" size="mini" @click="draw(scope.row)">绘制</el-button>
					</template>
					<template #slot-detail="{ scope }">
						<el-button type="text" size="mini" @click="detail(scope.row)">详情</el-button>
					</template>
					<!-- <template #slot-desc="{ scope }">
						<el-button type="text" size="mini" @click="desc(scope.row)">介绍</el-button>
					</template> -->
					<!-- <template #slot-share="{ scope }">
						<el-button type="text" size="mini" @click="share(scope.row)">分享</el-button>
					</template> -->
					<template #slot-del="{ scope }">
						<block v-if="scope.row.status == -1">
							<el-button type="danger" size="mini" @click="del(scope.row)">删除</el-button>
						</block>
					</template>
					
				</cl-table>
			</el-row>

			<el-row type="flex">
				<cl-flex1 />
				<cl-pagination />
			</el-row>
			<cl-form ref="dept-move"> </cl-form>
			
			<!-- <cl-dialog :title="'扫码预览'" :height="'200px'" :width="'240px'" :controls="['close']" :visible.sync="preview">
				<image style="width: 200px; height: 200px;" mode="aspectFill" :src="svg"></image>
			</cl-dialog> -->
		</cl-crud>
</template>

<script>
import { mapGetters } from "vuex";
//var QRCode = require("qrcode-svg");
import { upload } from '@/cool/utils/uploadKml.js';
import { getLable, getCids, getDept } from "@/config/dict"
import { prop } from "@/cool/utils/dict"
import { openWin } from "@/cool/utils"

export default {
	data() {
		return {
			dPid: 0,
			dept: getLable(),
			isEdit: false,
			preview: false,
			svg: 'https://zts.5618.co/static/loadding.gif',
			name: '',
			selected:[],
			placemark: null,
			epxorting: false,
			loading:false
		};
	},
	computed: {
		...mapGetters(['userInfo'])
	},
	props: {
		list: { type: Array },
		ids: { type: Array },
		expand: { type: Boolean}
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
		refresh(params) {
			this.$refs['crud'].refresh({
				dpids: this.ids,
				page: 1,
				name: this.name,
				children: false,
				type: 60
			});
		},
		onCrudLoad({ ctx, app }) {
			ctx.service(this.$service.zts.kml).done();
			app.refresh({
				children: false,
				isoDept: true,
				type: 60
			});
		},
		deptExpand(e){
			this.$emit('update:expand',!this.expand)
		},
		onSelect(e){
			this.selected = e
		},
		edit(kml) {
			upload.call(this, { kml , e:{coord:false, ids: getCids(this.userInfo.departmentId)}, kt: [ {label:"推荐路线", value:60}] });
		},
		draw(e) {
			uni.setStorageSync('collect_check', e._id)
			this.$router.push('/pages/zts/map/map')
			// openWin("./draw/index?&id="+e._id)
		},
		detail(e){
			uni.setStorageSync('kml_draw', e._id);
			this.$router.push('/pages/zts/track/detail');
		},
		desc(e){  // 跳转到线路详情编辑  富文本
			this.$router.push({
				path:'/pages/zts/track/draw/desc',
				params:{name:'zhangsan'}
			});
		},
		// async share(e) {
		// 	if (!this.preview) {
		// 		this.preview = true
		// 		let qrcode = new QRCode({
		// 			content: "https://zts.5618.co/h5/#/track/share?id="+ e._id,
		// 			join: true
		// 		});
		// 		let svg = qrcode.svg();
		// 		await this.$service.zts.poi.preview({
		// 			file: svg
		// 		}).then(e => {
		// 			this.svg = e
		// 		})
		// 		let t = this
		// 		setTimeout(function() {
		// 			t.$service.space.info.delete({
		// 				url: t.svg
		// 			})
		// 		}, 3000);
		// 	}
		// },
		del(e){
			if(!this.userInfo.admin && this.userInfo._id!=e.userId) return this.$message.error("没有权限（删除数据必须由数据创建人操作）！")
			this.$confirm("此操作将永久删除选中数据，是否继续？", "高风险提示", {
				type: "warning"
			}).then((res) => {
				if (res === "confirm") {
					this.loading = true
					this.$service.zts.kml.kill({ ids: [e._id] })
						.then((res) => {
							this.$message.success("删除成功");
							this.loading = false
							this.refresh()
						}).catch((err) => {
							this.$message.error(err);
						});
				}
			}).catch(() => null);
		},
		toMove(e) {
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
