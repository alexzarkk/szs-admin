<template>
	<cl-layout>
		<cl-crud ref="crud" @load="onCrudLoad" :on-refresh="onRefresh">
			<el-row type="flex">
				<cl-refresh-btn />
			</el-row>

			<el-row>
				<cl-table
					ref="table"
					:props="{
						'row-key': 'id'
					}"
					:on="{
						'row-click': this.onRowClick,
						'row-contextmenu': this.onRowContextMenu
					}"
					:columns="[
						{
							prop: 'name',
							label: '名称',
							align: 'left',
							width: 260
						},
						{
							prop: 'sn',
							label: '编号',
							align: 'center',
							width: 90
						},
						{
							prop: 'num',
							label: '岗位人数',
							align: 'center',
							width: 90
						},
						{
							prop: 'desc',
							label: '说明',
							'header-align': 'center',
							'min-width': 300
						},
						{
							label: '操作',
							align: 'center',
							type: 'op',
							buttons: ['slot-add', 'edit', 'delete']
						}
					]"
				>
					<!-- 名称 -->
					<template #column-name="{ scope }">
						<text :class="'text-'+(scope.row._id?'black':'grey')">{{ scope.row.name }}</text>
					</template>
					<!-- 名称 -->
					<template #column-sn="{ scope }">
						{{  scope.row.sn? (scope.row.prefix + scope.row.sn) : '' }}
					</template>
					

					<!-- 图标 -->
					<!-- <template #column-icon="{ scope }">
						<el-avatar v-if="scope.row.t1==2" size="small" shape="square" :fit="'contain'" :src="scope.row.prop.icon.iconUrl"></el-avatar>
					</template> -->


					<!-- 行新增 -->
					<template #slot-add="{ scope }">
						<el-button
							type="text"
							size="mini"
							@click="upsertAppend(scope.row)"
							v-if="scope.row.type != 2"
							>新增</el-button
						>
					</template>
				</cl-table>
			</el-row>

			<!-- 编辑 -->
			<cl-upsert
				ref="upsert"
				:props="{
					width: '800px'
				}"
				:items="[
					{
						prop: 'type',
						value: 0,
						label: '节点类型',
						span: 24,
						component: {
							name: 'el-radio-group',
							options: [
								{
									label: '目录',
									value: 0
								},
								{
									label: '菜单',
									value: 1
								},
								{
									label: '权限',
									value: 2
								}
							],
							on: {
								change: (index) => {
									this.changeType(index);
								}
							}
						}
					},
					{
						prop: 'name',
						label: '节点名称',
						span: 24,
						component: {
							name: 'el-input',
							attrs: {
								placeholder: '请输入节点名称'
							}
						},

						rules: {
							required: true,
							message: '名称不能为空'
						}
					},
					{
						prop: 'parentId',
						label: '上级节点',
						span: 24,
						component: {
							name: 'cl-menu-tree'
						}
					},
					{
						prop: 'router',
						label: '节点路由',
						span: 24,
						hidden: true,
						component: {
							name: 'el-input',
							attrs: {
								placeholder: '请输入节点路由'
							}
						}
					},
					{
						prop: 'isShow',
						label: '是否显示',
						span: 24,
						value: true,
						hidden: false,
						component: {
							name: 'el-switch'
						}
					},
					{
						prop: 'icon',
						label: '节点图标',
						span: 24,
						component: {
							name: 'cl-menu-icons'
						}
					},
					{
						prop: 'orderNum',
						label: '排序号',
						span: 24,
						component: {
							name: 'el-input-number',
							props: {
								placeholder: '请填写排序号',
								min: 0,
								max: 99,
								'controls-position': 'right'
							}
						}
					},
					{
						prop: 'perms',
						label: '权限',
						span: 24,
						hidden: true,
						component: {
							name: 'cl-menu-perms'
						}
					}
				]"
				@open="onUpsertOpen"
			></cl-upsert>
		</cl-crud>

		<!-- 右键菜单 -->
		<cl-context-menu ref="context-menu"></cl-context-menu>
	</cl-layout>
</template>

<script>
// import { table, setChild } from '@/cool/utils/dict.js';
// import { deepTree } from "@/cool/utils";

export default {
	filters: {
		router_link(url = "") {
			if (typeof url === "string") {
				if (url.includes("http")) {
					return url;
				} else {
					return `#${url}`;
				}
			} else {
				return "/";
			}
		}
	},

	methods: {
		onCrudLoad({ ctx, app }) {
			ctx.service(this.$service.szs.placemark).set("dict", {
					api: {
						page: "list"
					}
				}).done(e=>{
					console.log(e)
				});
			this.kml = uni.getStorageSync('kml')
			app.refresh();
		},

		onRefresh(params, { next, render }) {
			this.$service.szs.placemark.list({pid: this.kml.id}).then((res) => {
				this.list = setChild(res, false);
				console.log(this.list);
				render(deepTree(this.list));
			});
		},

		onRowClick(row, column) {
			// console.log(row)
			if (column.property && row.children) {
				this.$refs["table"].toggleRowExpansion(row);
			}
		},

		onRowContextMenu(row, column, event) {
			const { rowEdit, rowDelete } = this.$refs["crud"];

			let list = [
				{
					label: "编辑",
					callback: (e, close) => {
						rowEdit(row);
						close();
					}
				},
				{
					label: "删除",
					callback: (e, close) => {
						rowDelete(row);
						close();
					}
				}
			];

			if (row.type != 2) {
				list.unshift({
					label: "新增",
					callback: (e, close) => {
						this.upsertAppend(row);
						close();
					}
				});
			}

			if (row.type == 1) {
				list.push({
					label: "权限",
					callback: (e, close) => {
						this.setPermission(row);
						close();
					}
				});
			}

			this.$refs["context-menu"].open(event, {
				list
			});

			event.preventDefault();
		},

		onUpsertOpen(isEdit, data) {
			this.changeType(data ? data.type : 0);
		},

		upsertAppend({ type, id }) {
			this.$refs["crud"].rowAppend({
				parentId: id,
				type: type + 1
			});
		},

		changeType(index) {
			const { toggleItem } = this.$refs["upsert"];
			toggleItem("router", index == 1);
			toggleItem("icon", index != 2);
			toggleItem("perms", index == 2);
			toggleItem("isShow", index != 2);
		},

		setPermission({ id }) {
			this.$refs["crud"].rowAppend({
				parentId: id,
				type: 2
			});
		},

		toUrl(url) {
			this.$router.push(url);
		}
	}
};
</script>
