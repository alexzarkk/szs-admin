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
					
					<el-row>
						<el-form-item label="属地" prop="region">
							<block v-if="userInfo.deptChild.length>1">
								<cl-dept-cascader v-if="timTimer" :value="form.deptId" @input="setRegion"/>
							</block>
							<el-checkbox-group v-model="form.region" @change="regionChange">
								<el-checkbox name="region" v-for="(item, index) in region" :key="index" :label="item._id">
									{{ item.name }}
								</el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-row>
					
					<el-row v-if="form.deptId">
						<el-col :span="12">
							<el-form-item label="地址" prop="coord">
								<view  @click="visible = true">
									<el-tooltip effect="dark" content="点击地图选择" placement="top">
										<el-input size="small" v-model="form.addr" disabled placeholder="请选择..."></el-input>
									</el-tooltip>
								</view>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="电话" prop="phone">
								<el-input size="small" v-model="form.phone" placeholder="如有请输入"></el-input>
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
						<cl-upload :value="form.cover" @input="onUpload" :limit="1"></cl-upload>
					</el-form-item>
					
					
					<el-form-item label="视频">
						<cl-upload :value="form.video.url" @input="setVideo" :limit="1" :fileType="'video'"></cl-upload>
						<!-- <cl-upload :value="form.video.url" @input="setVideo" :fileType="'video'" is-space></cl-upload> -->
						<view v-if="form.video.url">
							<el-input size="small" v-model="form.video.desc" placeholder="视频说明"></el-input>
						</view>
						
					</el-form-item>

					<el-form-item label="简介" prop="desc">
						<el-input type="textarea" v-model="form.desc" placeholder="请输入6-200个字的简介信息"></el-input>
					</el-form-item>

					<el-form-item label="详情" prop="content">
						<!-- <view class="sticky-box" style="top: 160px;"> -->
						<cl-editor-tinymce v-if="timTimer" v-model="form.content" :options="{height:600}"></cl-editor-tinymce>
						<!-- </view> -->
					</el-form-item>

				</el-form>
			</div>
			<view class="flex justify-center align-center">
				<view class="flex-twice">
					<el-link v-if="updateTime" type="info">自动保存：{{updateTime}}</el-link>
				</view>
				<view class="flex-twice padding-top-xs">
					<el-button size="small" type="info" @click="back('view')">返 回</el-button>
					<el-button size="small" type="success" @click="submitForm('view')">预 览</el-button>
					<el-button size="small" type="primary" @click="submitForm('save')">保 存</el-button>
					<!-- <el-button size="small" type="warning" @click="submitForm('audit')">递交审核</el-button> -->
				</view>
			</view>
		</div>
		<cl-dialog :title="form.addr||'位置坐标'" :props="{fullscreen:false}" :width="'800px'" :height="'600px'" :controls="['close']" :visible.sync="visible">
			<tdt-map :center="form.coord||center" :zoom="13" @init="initTdt">
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
				<tdt-mousetool ref="mousetool" :markTool="{follow:true}" @markend="marked"/>
				
			</tdt-map>
		</cl-dialog>
	</cl-layout>
</template>

<script>

	export default {
		data() {
			return {
				poi: this.$store.getters.dict.poi,
				dept: this.$store.getters.dictObj.deps,
				userInfo: this.$store.getters.userInfo,
				refKml: [],
				visible: false,
				center: [120.15, 30.28],
				region: [],
				loading: true,
				timTimer: null,
				updateTime: '',
				form: {
					region: [],
					type: [],
					video:{},
					content:''
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
		activated() {
			this.init()
		},
		deactivated() {
			this.clearTim()
		},
		mounted() {
			this.init()
		},
		methods: {
			async init() {
				this.form = {
					name: '',
					userId: this.userInfo._id,
					deptId: this.userInfo.departmentId,
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
					status: 1
				}
				if (this.userInfo.deptChild.length == 1) {
					this.setRegion(this.userInfo.deptChild)
				}
				this.loading = true
				let id = uni.getStorageSync('poi_edit')
				if (!id) {
					await this.$service.zts.poi.page({ userId: this.userInfo._id, status: 1 }).then(res => {
						if (res.list.length) { 
							Object.assign(this.form, res.list[0])
						}
					})
					if (!this.form._id) {
						this.$service.zts.poi.add({
							...this.form
						}).then(e => {
							this.form._id = e.id
						})
					}
				} else {
					Object.assign(this.form, await this.$service.zts.poi.info({id}))
				}
				this.getRegions(this.form.deptId)
				this.autoUpdate()
				this.loading = false
				// this.form.content.split('img src=').forEach((s,i)=>{
				// 	if(i>0) this.imgs.push(s.split('"')[1])
				// })
				// console.log(this.imgs)
			},
			autoUpdate() {
				// this.timTimer = true
				// return console.log('.........autoUpdate', this.form);
				if (this.timTimer) this.clearTim()
				this.timTimer = setInterval(() => {
					this.save()
				}, 40000)
			},
			clearTim() {
				console.log('clearTim .............',this.timTimer);
				clearInterval(this.timTimer)
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
					window.geoCoder.getPoint(this.dept[pid].name, e => {
						this.center = [e.location.lon, e.location.lat, 0]
						this.onNear()
					})
				}
			},
			regionChange(e) {
				if (e.length) {
					for (let s of this.region) {
						if (s.id == e[e.length - 1]) {
							window.geoCoder.getPoint(s.name, x => {
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
				window.geoCoder.getLocation(new T.LngLat(coord[0], coord[1]), searchResult);
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
				
			// uploaded(e){ this.imgs.push(e) },
			async save(){
				
				// let img = []
				// this.form.content.split('img src=').forEach((s,i)=>{
				// 	if(i>0) img.push(s.split('"')[1])
				// })
				// for (let s of this.imgs) {
				// 	if(img.findIndex(p=>p==s)==-1) {
				// 		await this.$service.space.info.delete({url: s})
				// 	}
				// }
				// this.imgs = img
				
				await this.$service.zts.poi.update({ ...this.form })
				this.updateTime = this.zz.time2Date()
			},
			async submitForm(tar) {
				let veri = await this.$refs.form.validate()
				if (veri) {
					
					this.loading = true
					await this.save()
					this.loading = false
					
					//预览
					if (tar == 'view') {
						this.zz.preview({path:'/pages/planning/poi', id: this.form._id})
					}
					// 保存
					if (tar == 'save') { 
						this.$message.success("保存成功")
					}
				}
			},
			back(){
				this.$router.back()
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
			height: calc(100% - 46px);
		}

		height: calc(100%);
	}
</style>
