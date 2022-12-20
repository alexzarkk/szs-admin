<template>
	<cl-layout>
		<div class="container">
			<div class="scroller">
				<el-form ref="form" :rules="rules" :model="form" label-width="100px" v-loading="loading">
					<el-row>
						<el-col :span="12">
							<el-form-item label="名称" prop="name">
								<el-input v-model="form.name" placeholder="请输入标题名称"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="属地" prop="region">
						
						<block v-if="cid.length>1">
							<cl-dept-cascader @input="setRegion"></cl-dept-cascader>
						</block>

						<el-checkbox-group v-model="form.region" @change="regionChange">
							<el-checkbox name="region" v-for="(item, index) in region" :key="index" :label="item._id">
								{{ item.name }}
							</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-row>
						<el-col :span="12">
							<el-form-item label="位置" prop="addr">
								<el-input v-model="form.addr" disabled></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<view class="padding-left-sm">
								<el-button @click="visible = true">选取</el-button>
							</view>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="电话" prop="phone">
								<el-input v-model="form.phone" placeholder="如有请输入"></el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<el-form-item label="等级">
						<el-form-item label="">
							<el-radio-group v-model="form.level" @change="setLevel">
								<block v-for="(t, index) in poi.level" :key="index">
									<el-radio-button :label="t.value">{{t.text}}</el-radio-button>
								</block>
							</el-radio-group>
						</el-form-item>
					</el-form-item>

					<el-form-item label="类型" prop="type">
						<el-checkbox-group v-model="form.type">
							<block v-for="(t, index) in poi[form.level]" :key="index">
								<el-checkbox :label="t.value">{{t.text}}</el-checkbox>
							</block>
						</el-checkbox-group>
					</el-form-item>

					<el-form-item label="封面照片" prop="cover">
						<cl-upload :value="form.cover" @input="onUpload"></cl-upload>
					</el-form-item>
					<el-form-item label="简介" prop="desc">
						<el-input type="textarea" v-model="form.desc" placeholder="请输入6-200个字的简介信息"></el-input>
					</el-form-item>

					<el-form-item label="详情" prop="content">
						<cl-editor-tinymce v-model="form.content" :options="{height:600}"></cl-editor-tinymce>
					</el-form-item>

				</el-form>
			</div>
			<view class="flex justify-center align-start">
				<view class="flex-twice">
					<block v-if="updateTime">
						<el-link type="info">自动保存：{{updateTime}}</el-link>
					</block>
				</view>
				<view class="flex-twice padding-tb-xs">
					<el-button type="success" @click="submitForm('view')">预 览</el-button>
					<el-button type="primary" @click="submitForm('save')">保 存</el-button>
				</view>
			</view>
		</div>
		<cl-dialog :title="form.addr||'位置坐标'" :height="'600px'" :width="'800px'" :controls="['close']" :visible.sync="visible">
			<tdt-map :center="form.coord||center" :zoom="13" @init="initTdt">
				<block v-if="form.coord">
					<tdt-marker :position="form.coord" :dragging="true" :edit="true" @dragend="marked"></tdt-marker>
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
	</cl-layout>
</template>

<script>
	//var QRCode = require("qrcode-svg");
	import { mapGetters } from 'vuex';
	import { poi } from "@/cool/utils/dict.js"
	import { getLable, getCids } from "@/config/dict";
	import { timeToDate } from "@/cool/utils/index.js";

	export default {
		data() {
			return {
				cid: [],
				poi: poi,
				visible: false,
				center: [120.15, 30.28],
				region: [],  // 街道列表
				loading: true,
				timTimer: null,
				updateTime: '',
				preview: false,
				svg: 'https://zts.5618.co/static/loadding.gif',
				form: {
					region: [],
					type: []
				},
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
					cover: [{
						required: true,
						message: '请上传封面照片',
						trigger: 'blur'
					}],
					region: [{
						required: true,
						message: '请选择属地',
						trigger: 'blur'
					}],
					addr: [{
						required: true,
						message: '请选择坐标位置',
						trigger: 'blur'
					}],
					type: [{
						required: true,
						message: '请选择资源类型',
						trigger: 'blur'
					}],
					desc: [{
						required: true,
						message: '请输入简介',
						trigger: 'blur'
					}, {
						min: 6,
						max: 200,
						message: '长度在 6 到 200 个字符',
						trigger: 'blur'
					}],
					content: [{
						required: true,
						message: '请输入详情',
						trigger: 'blur'
					}],
				}
			};
		},
		computed: {
			...mapGetters(['lay', 'userInfo'])
		},
		activated() {
			this.init()
		},
		deactivated() {
			this.clearTim()
		},
		mounted() {
			this.gd = new T.Geocoder()
			this.cid = getCids(this.userInfo.departmentId)
			this.init()
		},
		methods: {
			async init() {
				this.form = {  
					name: '',
					deptId: '',
					level: 1,
					region: [],
					type: [],

					phone: '',
					addr: '',
					coord: null,

					cover: '',
					desc: '',
					content: '',
					status: 1,
					userId: this.userInfo._id
				}
				// console.log("获取到的cid",this.cid)
				if (this.cid.length == 1) {
					this.setRegion(this.cid)
				}
				this.loading = true
				let id = this.$route.query._id
				if (!id) {  // 没有前面传过来的数据   新增模式
					try {
						await this.$service.zts.poi.page({  // 获取自动保存的数据
							userId: this.userInfo._id,
							status: 1
						}).then(res => {
							if (res.list.length) { 
								this.form = res.list[0]
							}
						}).catch(e => {
							// console.log("请求发生了error", e)
						})

						if (!this.form._id) {  // 没有id 就添加一个id
							await this.$service.zts.poi.add({
								...this.form
							}).then(e => {
								this.form._id = e.id
							})
						}
					} catch (e) {
						// console.log("发生了error", e)
					}
					
					if (this.form.deptId) {  // 根据deptId获取街道信息
						this.getRegions(this.form.deptId)
					}
					
				} else {
					this.form = await this.$service.zts.poi.info({id})
				}
				this.autoUpdate()
				this.loading = false;
			},
			autoUpdate() {
				if (this.timTimer) this.clearTim()
				this.timTimer = setInterval(() => {
					this.updateTime = timeToDate()
					this.$service.zts.poi.update({ ...this.form })
				}, 40000);
			},
			clearTim() {
				clearInterval(this.timTimer)
				this.timTimer = null
				this.updateTime = ''
			},
			initTdt(e) {
				this.map = e
				if (!this.form.coord) this.$refs.mousetool.open('markTool')
			},
			setRegion(e) {  // 设置 地区信息
				this.region = []
				this.form.region = []
				if (e.length) {
					this.getRegions(e[e.length - 1])
				}
			},
			getRegions(pid) {  // 获取当前的 街道信息，加入默认的departmentId信息
				if (pid) {
					
					this.form.deptId = pid + ''
					// console.log("当前只有一个cid，添加deptId",this.form)
					this.regionLoading = true;
					this.$service.system.dept.list({
						pid
					}).then(res => {
						this.region = res
						// console.log("获取到的街道的信息",this.region)
					}).done(() => {
						this.regionLoading = false;
					});
					this.gd.getPoint(getLable(pid), (e) => {
						this.center = [e.location.lon, e.location.lat, 0]
					})
				}
			},
			regionChange(e) {
				// console.log("属地单选",e)
				if (e.length) {
					for (let s of this.region) {
						if (s.id == e[e.length - 1]) {
							// console.log("获取到的当前属地的信息",s)
							this.gd.getPoint(s.name, (e) => {
								this.center = [e.location.lon, e.location.lat, 0]
							})
						}
					}
				}
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
			setLevel(e) {
				this.form.type = []
			},
			onUpload(e) {
				this.form.cover = e
			},
			async submitForm(tar) {
				let veri = false
				this.$refs.form.validate((valid) => {
					if (valid) {
						// alert('submit!');
						veri = true
					} else {
						console.log('error submit!!');
						return false;
					}
				});
				if (veri) {
					this.loading = true
					if (this.form.status == 1) this.form.status = 2
					// console.log("提交的内容",this.form)
					await this.$service.zts.poi.update({
						...this.form
					}).done(() => {
						this.loading = false;

						if (tar == 'view') {
							// console.log('预览', this.form)
							if (!this.preview) {
								this.preview = true
								let qrcode = new QRCode({
									content: "https://zts.5618.co/h5/#/pages/preview/poiList?id=" +
										this.form._id,
									join: true
								});
								let svg = qrcode.svg();
								this.$service.zts.poi.preview({
									file: svg
								}).then(e => {
									this.svg = e
								})
								let t = this
								setTimeout(function() {
									t.$service.space.info.delete({
										url: t.svg
									})
								}, 3000);
							}
						}
						if (tar == 'save') { // 保存
							this.$message.success("新增成功");
							// uni.removeStorageSync('zts_poi_edit')
							setTimeout(() => {
								// this.$router.back();
								this.$router.push({
									path:'/pages/zts/poi/list',
									query:{
										refresh:true
									}
								})
							}, 500)
						}
					});
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.container {
		.scroller {
			padding: 10px;
			border: 1px solid #dcdfe6;
			border-radius: 3px;

			box-sizing: border-box;
			overflow-x: hidden;
			height: calc(100% - 52px);
		}

		height: calc(100%);
	}
</style>
