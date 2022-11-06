<template>
	<cl-layout>
		<div class="system-user">
			<div class="pane">
				<!-- 部门区域 -->
				<!-- <div class="dept" :class="[!expand ? '_expand' : '_collapse']">
					<cl-dept-tree :deptId="$store.getters.userInfo.dept.id" @check="deptSet"></cl-dept-tree>
				</div> -->
				<!-- 资源列表 -->
				<div class="user">
					<cl-crud ref="crud" @load="onCrudLoad" boder>
						<el-row type="flex">
							<!-- <view class="flex align-center">
								<div class="icon padding-lr-xs" @click="deptExpand">
									<i class="cursor el-icon-arrow-right" v-if="expand"></i>
									<i class="cursor el-icon-arrow-left" v-else></i>
								</div>
							</view> -->
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
							<cl-filter label="类型">
								<el-select size="mini" v-model="type" @change="refresh()">
									<el-option :value="0" label="全部"></el-option>
									<block v-for="(t, index) in article" :key="index">
										<el-option :value="t.value" :label="t.label"></el-option>
									</block>
								</el-select>
							</cl-filter>
							<cl-search-key />
						</el-row>

						<el-row>
							<cl-table :contextMenu="[]"
								:props="{
										'default-sort': {
											prop: 'createTime',
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
											dict: depts
										},
										{
											prop: 'author',
											label: '作者/来源',
											align: 'center'
										},
										{
											prop: 'title',
											label: '标题',
											align: 'center'
										},
										{
											prop: 'cover',
											label: '封面',
											align: 'center'
										},
										{
											prop: 'type',
											label: '分类',
											align: 'center'
										},
										
										{
											prop: 'status',
											label: '状态',
											align: 'center'
										},
										{
											prop: 'createTime',
											label: '创建时间',
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
								<template #column-createTime="{ scope }">
									{{ scope.row.updateTime }}
								</template>
								<template #column-type="{ scope }">
									<block v-for="(i, idx) of scope.row.type" :key="idx">
										<el-tag size="mini" style="margin-left: 4px;" :class="'bg-'+articleO[i].color" effect="plain">
											{{ articleO[i].label }}
										</el-tag>
									</block>
								</template>

								<template #column-cover="{ scope }">
									<template v-if="scope.row.cover">
										<el-image style="width: 100px; height: 100px" fit="cover"
										    :src="scope.row.cover.url"
										    :preview-src-list="[scope.row.cover.url]">
										</el-image>
									</template>
									
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
									<el-button v-if="scope.row.status!==4&&scope.row.status!==10"
										type="text" size="mini" @click="toAudit(scope.row)" v-permission="$service.zts.article.permission.audit"
										>审核</el-button>
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

		<!-- <cl-dialog :title="'扫码预览'" :height="'200px'" :width="'240px'" :controls="['close']" :visible.sync="preview">
			<image style="width: 200px; height: 200px;" mode="aspectFill" :src="svg"></image>
		</cl-dialog> -->
		<el-dialog title="提示" center :visible.sync="preview" :width="'240px'">
		  <div id="qrcodez" style="width: 200px;height:200px;position: relative;"></div>
		</el-dialog>
		
		<zts-audit :tar="'poi'" :cur="cur"></zts-audit>
		
	</cl-layout>
</template>

<script>
	import UQRCode from 'uqrcodejs';
	import { dept, article, poi } from "@/comm/dict"
	import { checkPerm } from "@/cool/permission"

	export default {
		data() {
			return {
				article,
				articleO: this.zz.toObj(article),
				depts: dept.getLabel(),
				st: poi.st,
				type: '',
				status: '',
				expand: this.$store.getters.userInfo.isLeaf,
				preview: false,
				svg: '',
				epxorting: false,
				cur: {}
			};
		},
		mounted() { },
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
					type: this.type,
					status: this.status,
				});
			},
			onCrudLoad({ ctx, app }) {
				ctx.service(this.$service.zts.article).done();
				app.refresh({
					page: 1,
					isoDept: true
				});
			},
			edit(e) {
				if(e && e.userId != this.$store.getters.userInfo._id && (!checkPerm(this.$service.zts.kml.permission.superEdit))) return this.$message.error(`无法更新他人数据！`);
				this.$router.push({
					path: '/pages/zts/article/edit',
					query: {_id:e? e._id:0}
				});
			},
			
			async detail(e) {
				console.log(e);
				
				this.preview = true
				setTimeout(()=>{
					var qr = new UQRCode();
					// 设置二维码内容
					qr.data = "https://zts.5618.co/h5/#/pages/share?path=/pages/planning/article&id=" + e._id
					// 设置二维码大小，必须与canvas设置的宽高一致
					qr.size = 200;
					// 设置二维码前景图，可以是路径
					// qr.foregroundImageSrc = ''
					// 调用制作二维码方法
					qr.make();
									
					// 遍历drawModules创建dom元素
					var qrHtml = '';
					for (var i = 0; i < qr.drawModules.length; i++) {
					    var drawModule = qr.drawModules[i];
					    switch (drawModule.type) {
					    case 'block':
					        /* 绘制小块 */
					        qrHtml += `<div style="position: absolute;left: ${drawModule.x}px;top: ${drawModule.y}px;width: ${drawModule.width}px;height: ${drawModule.height}px;background: ${drawModule.color};"></div>`;
					        break;
					    case 'image':
					        /* 绘制图像 */
					        qrHtml += `<img style="position: absolute;left: ${drawModule.x}px;top: ${drawModule.y}px;width: ${drawModule.width}px;height: ${drawModule.height}px;" src="${drawModule.imageSrc}" />`;
					        break;
					    }
					}
					document.getElementById('qrcodez').innerHTML = qrHtml;
				}, 300);
				 // var UQRCode = window.UQRCode;
				    // 获取uQRCode实例
				    
					
				// var qr = new UQRCode();
				// // 设置二维码内容
				// qr.data = "https://zts.5618.co/h5/#/pages/share?path=/pages/planning/article&id=" + e._id
				// // 设置二维码大小，必须与canvas设置的宽高一致
				// qr.size = 200;
				// // 调用制作二维码方法
				// qr.make();
				// // 获取canvas元素
				// var canvas = document.getElementById("qrcodez");
				// // 获取canvas上下文
				// var canvasContext = canvas.getContext("2d");
				// // 设置uQRCode实例的canvas上下文
				// qr.canvasContext = canvasContext;
				// // 调用绘制方法将二维码图案绘制到canvas上
				// qr.drawCanvas();
				
				// if (!this.preview) {
				// 	this.preview = true
				// 	let qrcode = new QRCode({
				// 		content: "https://zts.5618.co/h5/#/pages/share?path=/pages/planning/article&id=" + e._id,
				// 		join: true
				// 	});
				// 	let svg = qrcode.svg();

				// 	// await this.$service.zts.poi.preview({
				// 	// 	file: svg
				// 	// }).then(e => {
				// 	// 	this.svg = e
				// 	// })
				// 	let t = this
				// 	setTimeout(function() {
				// 		t.$service.space.info.delete({ url: t.svg })
				// 	}, 3000)
				// }
				
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
