<template>
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
							<el-button size="mini" type="primary" @click="edit({})">新增</el-button>
							<!-- <el-button size="mini" :loading="loading" class="filter-item" type="primary" icon="el-icon-download" @click="download">
									导出 Excel
								</el-button> -->
							<cl-multi-delete-btn />
							<cl-flex1 />
							<!-- <cl-filter label="状态">
								<el-select size="mini" v-model="status" @change="refresh()">
									<el-option value="" label="全部"></el-option>
									<el-option :value="1" label="草稿"></el-option>
									<el-option :value="2" label="待审核"></el-option>
									<el-option :value="10" label="已审核"></el-option>
								</el-select>
							</cl-filter> -->
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
											label: '状态',
											align: 'center'
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
										<el-tag size="mini" style="margin-left: 4px;" effect="plain">{{ cfgO[i].text }}</el-tag>
									</block>
								</template>
								<template #column-curSt="{ scope }">
									<block v-for="(i, idx) of curSt" :key="idx">
										<el-tag v-if="i.value==scope.row.curSt" :type="i.type" size="mini" style="margin-left: 4px;" effect="plain">{{ i.text }}</el-tag>
									</block>
								</template>
								<template #slot-edit="{ scope }">
									<el-button type="text" size="mini" @click="edit(scope.row)">编辑</el-button>
								</template>
								<!-- <template #slot-detail="{ scope }">
									<el-button type="text" size="mini" @click="detail(scope.row)">预览</el-button>
								</template> -->
								<template #slot-veri="{ scope }">
									<el-button 
									v-if="scope.row.status!==4&&scope.row.status!==10"
									type="text" size="mini" @click="toAudit(scope.row)"
										v-permission="$service.zts.kml.permission.verify"
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
		
		<el-dialog :title="form._id?'编辑':'新增'" :visible.sync="t.open" :append-to-body="true" width="800px" center>
			<el-form ref="form" :rules="rules" :model="form" label-width="100px" v-loading="loading">
				<el-form-item label="名称" prop="name">
					<el-input size="small" v-model="form.name" placeholder="请输入标题名称"></el-input>
				</el-form-item>
				<block v-if="cid.length>1 && t.open">
					<el-form-item label="属地" prop="deptId">
						<cl-dept-cascader2 :id="form.deptId" @input="setRegion"></cl-dept-cascader2>
					</el-form-item>
				</block>
				<el-form-item label="地址" prop="addr">
					<view @click="t.tdt = true">
						<el-tooltip effect="dark" content="点击地图选择" placement="top">
							<el-input size="small" v-model="form.addr" disabled placeholder="请选择..."></el-input>
						</el-tooltip>
					</view>
				</el-form-item>
			
				<el-form-item label="类型" prop="level">
					<el-radio-group size="small" v-model="form.level">
						<block v-for="(t, idx) in tar" :key="idx">
							<el-radio-button :label="t.value">{{t.text}}</el-radio-button>
						</block>
					</el-radio-group>
				</el-form-item>
				
				<el-form-item label="建设等级" prop="grade">
					<el-radio-group size="small" v-model="form.grade">
						<block v-for="(t, idx) in grade" :key="idx">
							<el-radio-button :label="t.value">{{t.text}}</el-radio-button>
						</block>
					</el-radio-group>
				</el-form-item>
							
				<el-form-item label="设施配置" prop="cfg">
					<el-checkbox-group v-model="form.cfg">
						<block v-for="(t, index) in cfg" :key="index">
							<el-checkbox :label="t.value">{{t.text}}</el-checkbox>
						</block>
					</el-checkbox-group>
				</el-form-item>
				
				<el-form-item label="状态" prop="curSt">
					<el-radio-group size="small" v-model="form.curSt">
						<block v-for="(t, idx) in curSt" :key="idx">
							<el-radio-button :label="t.value">{{t.text}}</el-radio-button>
						</block>
					</el-radio-group>
				</el-form-item>
				
				<el-form-item label="照片" prop="cover">
					<cl-upload :value="form.imgs||[]" @input="onUpload" :limit="4"></cl-upload>
				</el-form-item>
				
				<block v-if="form.curSt==1">
					<el-row>
						<el-col :span="12">
							<el-form-item size="small" label="拟建面积" prop="size">
								<el-input-number v-model="form.size" :min="10" :max="10000"></el-input-number>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item size="small" label="拟投资(万元)" prop="invest">
								<el-input-number v-model="form.invest" :min="1" :max="1000"></el-input-number>
							</el-form-item>
						</el-col>
					</el-row>
					
					<el-form-item label="建设周期" prop="desc">
						<el-date-picker placeholder="选择时间" v-model="form.ondate" type="daterange" size="small"
										value-format="yyyy-MM-dd"
										start-placeholder="开建日期"
										end-placeholder="完成日期"></el-date-picker>
					</el-form-item>
				</block>
				<el-form-item label="说明" prop="desc">
					<el-input type="textarea" v-model="form.desc"></el-input>
				</el-form-item>
				<view class="flex justify-end">
					<el-button size="small" @click="t.open = false">取消</el-button>
					<el-button size="small" type="success" @click="onSubmit">保存</el-button>
				</view>
				
			</el-form>
		</el-dialog>
		

		<cl-dialog :title="form.addr||'位置坐标'" :height="'600px'" :width="'880px'" :controls="['close']" :visible.sync="t.tdt">
			<tdt-map :center="form.coord||center" :zoom="13" @init="initTdt">
				<block v-if="form.coord">
					<tdt-marker :position="form.coord" :dragging="true" :edit="true" @dragend="marked"></tdt-marker>
				</block>
				<block v-for="(pm, idx) of refKml" :key="idx">
					<tdt-polyline :path="pm.coord" :weight="pm.prop.weight" :color="pm.prop.color" :opacity="pm.prop.opacity" :extData="pm"></tdt-polyline>
				</block>
				<tdt-mousetool ref="mousetool" :markTool="{follow:true}" :polygonTool="{showLabel:true}"
					:polylineTool="{showLabel:true, color:'#d80000'}" @markend="marked" @polyline-draw="lineDrawed"
					@polygon-draw="gonDrawed">
				</tdt-mousetool>
			</tdt-map>
		</cl-dialog>

		<cl-dialog :title="'扫码预览'" :height="'200px'" :width="'240px'" :controls="['close']" :visible.sync="preview">
			<image style="width: 200px; height: 200px;" mode="aspectFill" :src="svg"></image>
		</cl-dialog>
		
		<zts-audit :tar="'poi'" :type="'驿站信息'" :cur="cur" @refresh="refresh"></zts-audit>
		
	</cl-layout>
</template>

<script>
	//var QRCode = require("qrcode-svg");
	import { mapGetters } from "vuex";
	import { getLable, getCids } from "@/config/dict";
	import { poi } from "@/cool/utils/dict.js"
	import { checkPerm } from "@/cool/permission"

	export default {
		data() {
			return {
				poi,
				cid: [],
				poiObj: poi.toObj(),
				st: poi.st,
				level: 0,
				status: '',
				winStyle: '',
				refKml: [],
				center: [121,29],
				expand: this.$store.getters.userInfo.isLeaf,
				dept: getLable(),
				preview: false,
				svg: 'https://zts.5618.co/static/loadding.gif',
				
				loading: false,
				
				tar: [{text: '驿站',type:'primary',value: 4004}, {text: '户外营地',type:'success',value: 4006}],
				curSt: [{text: '已建成',type:'success', value: 2}, {text: '拟投建',type:'info',value: 1}],
				grade: [{text: '一级',value: 1}, {text: '二级',value: 2}, {text: '三级',value: 3}],
				cfg: [
						{ text: '接待服务', value: 10 },
						{ text: '租赁服务', value: 12 },
						{ text: '补给服务', value: 14 },
						
						{ text: '纸质地图',	value: 30 },
						{ text: '路书', 		value: 32 },
						{ text: '医疗用品',	value: 34 },
						{ text: 'AED', 		value: 36 },
						{ text: '担架', 		value: 38 },
						
						{ text: '休憩设施',	value: 50 },
						{ text: '露营地', 	value: 52 },
						{ text: '停车场', 	value: 54 },
						{ text: '充电桩', 	value: 56 },
						{ text: '公交站', 	value: 58 },
						
						{ text: '公厕', 		value: 70 },
						{ text: '垃圾处理',	value: 72 },
						{ text: '给排水', 	value: 74 },
						{ text: '照明设施',	value: 76 },
						{ text: '通讯系统',	value: 78 },
						{ text: '充电设施',	value: 80 },
						{ text: '电子导览',	value: 82 }
					],
				rules: {
					name: [{
						required: true,
						message: '请输入名称',
						trigger: 'blur'
					}, {
						min: 2,
						max: 20,
						message: '长度在 2 到 20 个字符',
						trigger: 'blur'
					}],
					level: [{
						required: true,
						message: '请选择类型',
						trigger: 'blur'
					}],
					curSt: [{
						required: true,
						message: '请选择状态',
						trigger: 'blur'
					}],
					grade: [{
						required: true,
						message: '请选择等级',
						trigger: 'blur'
					}],
					addr: [{
						required: true,
						message: '请选择地址',
						trigger: 'blur'
					}],
					cfg: [{
						required: true,
						message: '请选择配置',
						trigger: 'blur'
					}],
					size: [{
						required: true,
						message: '请填写拟建面积',
						trigger: 'blur'
					}]
				},
				t:{open:false,tdt:false},
				form: {cfg:[]},
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
		computed: {
			...mapGetters(['userInfo'])
		},
		mounted() {
			this.cfgO = this.zz.toObj(this.cfg)
			this.gd = new T.Geocoder()
			this.cid = getCids(this.userInfo.departmentId)
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
					level: this.level? this.level: [4004,4006],
					dpids: this.dpids,
					status: this.status
				});
			},
			onCrudLoad({ ctx, app }) {
				ctx.service(this.$service.zts.poi).done();
				app.refresh({
					level: [4004,4006],
					isoDept: true,
					page: 1
				});
			},
			edit(e) {
				console.log(e);
				// if(e._id && e.userId != this.userInfo._id) return this.$message.error(`无法更新他人数据！`);
				if(!e._id) {
					if(this.dpids.length==1) e.deptId=this.dpids[0]
					e.status = 2
					e.cfg = []
					e.userId = this.userInfo._id
				}
				this.form = e
				this.t.open = true
			},
			initTdt(e) {
				this.map = e
				if (!this.form.coord) this.$refs.mousetool.open('markTool')
			},
			async onNear(){
				let e = await this.$service.zts.layout.around({deptId:this.form.deptId, coord:[this.center]}),
					prop = {
						1:['#ff5500',5],
						2:['#aa0000',4],
						3:['#ff3dff',3],
						4:['#aa557f',3]
					}
				for (let s of e.line) {
					s.prop = {
								opacity: 0.9,
								width: prop[s.level][1],
								color: prop[s.level][0]
							}
				}
				this.refKml = e.line
			},
			marked(e) {
				let coord
				if (e.type && e.type == 'dragend') {
					coord = [e.lnglat.getLng(), e.lnglat.getLat(), 0]
				} else {
					coord = [e.currentLnglat.getLng(), e.currentLnglat.getLat(), 0]
				}
				this.form.coord = coord
				const searchResult = (e) => {
					var addressComponent = e.getAddressComponent();
					this.form.addr = addressComponent.address
				}
				this.gd.getLocation(new T.LngLat(coord[0], coord[1]), searchResult);
			},
			setRegion(e) {
				this.form.deptId = e[e.length - 1]
				this.gd.getPoint(getLable(this.form.deptId), e => {
					this.center = [e.location.lon, e.location.lat, 0]
					this.onNear()
				})
			},
			onUpload(e) {
				if(!this.form.imgs) {
					this.form.imgs = []
				}this.imgs=[]
				console.log('onUpload',e);
				this.form.imgs.push(e)
			},
			async onSubmit() {
				let veri = false
				this.$refs.form.validate((valid) => {
					if (valid) {
						veri = true
					} else {
						console.log('error submit!!');
						return false;
					}
				});
				if(this.cid.length>1&&!this.form.deptId) return this.$message.error(`请选择属地！`);
				if (veri) {
					this.loading = true
					await this.$service.zts.poi[this.form._id?'update':'add']({
						...this.form
					}).done(() => {
						this.$message.success("保存成功");
						this.loading = false;
						this.t.open = false
					});
				}
			},
			async detail(e) {
				if (!this.preview) {
					this.preview = true
					let qrcode = new QRCode({
						content: "https://zts.5618.co/h5/#/resource?id=" + e._id,
						join: true
					});
					let svg = qrcode.svg();

					await this.$service.zts.poi.preview({
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
