<template>
	<cl-layout>
		<div class="container">
			<div class="scroller">
				
				<el-form ref="form" :rules="rules" :model="form" label-width="100px" v-loading="loading">
					<el-row>
						<el-col :span="12">
							<el-form-item label="名称" prop="name">
								<el-input size="small" v-model="form.name" placeholder="请输入标题名称"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="属地" prop="region">
						<block v-if="cid.length>1">
							<cl-dept-cascader2 v-if="timTimer" :id="cur.deptId" @input="setRegion"></cl-dept-cascader2>
						</block>
						<el-checkbox-group v-model="form.region" @change="regionChange">
							<el-checkbox name="region" v-for="(item, index) in region" :key="index" :label="item._id">
								{{ item.name }}
							</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-row v-if="form.deptId">
						<el-col :span="12">
							<el-form-item label="电话" prop="phone">
								<el-input size="small" v-model="form.phone" placeholder="如有请输入"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="地址" prop="coord">
								<view  @click="visible = true">
									<el-tooltip effect="dark" content="点击地图选择" placement="top">
										<el-input size="small" v-model="form.addr" disabled placeholder="请选择..."></el-input>
									</el-tooltip>
								</view>
							</el-form-item>
						</el-col>
					</el-row>

					<el-form-item label="类型" prop="level">
						<el-radio-group size="small" v-model="form.level" @change="setLevel">
							<block v-for="(t, index) in poi.level" :key="index">
								<el-radio-button :label="t.value">{{t.text}}</el-radio-button>
							</block>
						</el-radio-group>
					</el-form-item>

					<el-form-item label="类别" prop="type">
						<el-checkbox-group size="small" v-model="form.type">
							<block v-for="(t, index) in poi[form.level]" :key="index">
								<el-checkbox :label="t.value">{{t.text}}</el-checkbox>
							</block>
						</el-checkbox-group>
					</el-form-item>

					<el-form-item label="封面照片" prop="cover">
						<cl-upload :value="form.cover" @input="onUpload"></cl-upload>
					</el-form-item>
					
					<tool-tip></tool-tip>
					
					<el-form-item label="视频">
						<cl-upload :value="form.video.url" @input="setVideo" :fileType="'video'" is-space></cl-upload>
						<view v-if="form.video.url">
							<video id="myVideo" :src="form.video.url" controls></video>
						</view>
						<el-input size="small" v-model="form.video.desc" placeholder="视频说明"></el-input>
					</el-form-item>

					<el-form-item label="简介" prop="desc">
						<el-input type="textarea" v-model="form.desc" placeholder="请输入6-200个字的简介信息"></el-input>
					</el-form-item>

					<el-form-item label="详情" prop="content">
						<cl-editor-tinymce v-if="timTimer" v-model="form.content" :options="{height:600}"></cl-editor-tinymce>
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
					<el-button type="info" @click="back('view')">返 回</el-button>
					<el-button type="success" @click="submitForm('view')">预 览</el-button>
					<el-button type="primary" @click="submitForm('save')">保 存</el-button>
				</view>
			</view>
		</div>
		<cl-dialog :title="form.addr||'位置坐标'" :height="'600px'" :width="'880px'" :controls="['close']" :visible.sync="visible">
			<!-- <tdt-map :center="form.coord||center" :zoom="13" @init="initTdt">
				<block v-if="form.coord">
					<tdt-marker :position="form.coord" :dragging="true" :edit="true" @dragend="marked"></tdt-marker>
				</block>
				<block v-for="(pm, idx) of refKml" :key="idx + '0000'">
					<tdt-polyline
						:path="pm.coord"
						:weight="pm.prop.weight"
						:color="pm.prop.color"
						:opacity="pm.prop.opacity"
						:extData="pm"
					></tdt-polyline>
				</block>
				<tdt-mousetool ref="mousetool" :markTool="{follow:true}" :polygonTool="{showLabel:true}"
					:polylineTool="{showLabel:true, color:'#d80000'}" @markend="marked" @polyline-draw="lineDrawed"
					@polygon-draw="gonDrawed">
				</tdt-mousetool>
			</tdt-map> -->
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
				refKml: [],
				region: [],
				loading: true,
				timTimer: null,
				updateTime: '',
				preview: false,
				svg: 'https://zts.5618.co/static/loadding.gif',
				cur:{},
				form: {
					region: [],
					type: [],
					video:{},
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
					coord: [{
						required: true,
						message: '请选择坐标位置',
						trigger: 'blur'
					}],
					level: [{
						required: true,
						message: '请选择资源类型',
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
			// this.gd = new T.Geocoder()
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
					coord: [121,30],

					cover: '',
					video:{},
					desc: '',
					content: '',
					status: 1,
					userId: this.userInfo._id
				}
				if (this.cid.length == 1) {
					this.setRegion(this.cid)
				}
				this.loading = true
				let id = this.$route.query._id
				if (!id) {
					await this.$service.zts.poi.page({ userId: this.userInfo._id, status: 1 }).then(res => {
						if (res.list.length) { 
							this.form = res.list[0]
						}
					})
					if (!this.form._id) {
						this.$service.zts.poi.add({
							...this.form
						}).then(e => {
							this.form._id = e.id
						})
					}
					if (this.form.deptId) {
						this.getRegions(this.form.deptId)
					}
					
				} else {
					this.cur = await this.$service.zts.poi.info({id})
					this.form = this.cur
				}
				this.autoUpdate()
				this.loading = false
			},
			autoUpdate() {
				return console.log('.........autoUpdate');
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
				if (e.length) {
					let id = e[e.length - 1]
					if(this.form.deptId != id) {
						this.form.region = []
					}
					this.getRegions(id)
				}
			},
			async getRegions(pid) {
				if (pid) {
					this.form.deptId = pid + ''
					this.region = await this.$service.system.dept.list({pid})
					this.gd.getPoint(getLable(pid), e => {
						console.log(getLable(pid),[e.location.lon, e.location.lat, 0], e);
						this.center = [e.location.lon, e.location.lat, 0]
						this.onNear()
					})
				}
			},
			regionChange(e) {
				// console.log("属地单选",e)
				if (e.length) {
					for (let s of this.region) {
						if (s.id == e[e.length - 1]) {
							this.gd.getPoint(s.name, x => {
								this.center = [x.location.lon, x.location.lat, 0]
							})
						}
					}
				}
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
				// console.log("获取到的当前属地的信息.onNear",e.line)
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
			setVideo(e) {
				console.log('setVideo:', e);
				this.form.video.url = e },
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
									content: "https://zts.5618.co/build/#/pages/share?path=/pages/planning/poi?id=" +
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
							this.$message.success("保存成功");
							// uni.removeStorageSync('zts_poi_edit')
							// setTimeout(() => {
							// 	// this.$router.back();
							// 	this.$router.push({
							// 		path:'/pages/zts/poi/list',
							// 		query:{
							// 			refresh:true
							// 		}
							// 	})
							// }, 500)
						}
					});
				}
			},
			back(){
				this.$router.back();
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
