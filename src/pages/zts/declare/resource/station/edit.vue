<template>
	<cl-layout>
		<div class="container">
			<div class="scroller">
				
				<el-form ref="form" :rules="rules" :model="form" label-width="100px" v-loading="loading">
					<el-form-item label="名称" prop="name">
						<el-input size="small" v-model="form.name" placeholder="请输入标题名称"></el-input>
					</el-form-item>
					<block v-if="userInfo.deptChild.length>1">
						<el-form-item label="属地" prop="deptId">
							<cl-dept-cascader :value="[form.deptId]" @input="setRegion"/>
						</el-form-item>
					</block>
					<el-row>
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
							<block v-for="(t, index) in serveCfg" :key="index">
								<el-checkbox :label="t.value">{{t.label}}</el-checkbox>
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
					<block v-if="form.curSt==1">
						<el-row>
							<el-col :span="8">
								<el-form-item size="small" label="拟建面积" prop="size">
									<el-input-number v-model="form.size" :min="10" :max="10000"></el-input-number>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item size="small" label="拟投资(万元)" prop="invest">
									<el-input-number v-model="form.invest" :min="1" :max="1000"></el-input-number>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="建设周期" prop="desc">
									<el-date-picker placeholder="选择时间" v-model="form.ondate" type="daterange" size="small"
													value-format="yyyy-MM-dd"
													start-placeholder="开建日期"
													end-placeholder="完成日期"></el-date-picker>
								</el-form-item>
							</el-col>
						</el-row>
						
						
					</block>
					
					<el-form-item label="封面照片" prop="cover">
						<cl-upload :value="form.cover" @input="onUpload" :limit="1"></cl-upload>
					</el-form-item>
					
					<el-form-item label="视频">
						<cl-upload :value="form.video.url" @input="setVideo" :limit="1" :fileType="'video'"></cl-upload>
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
				serveCfg: this.$store.getters.dict.serveCfg,
				
				refKml: [],
				visible: false,
				center: [120.15, 30.28],
				region: [],
				loading: true,
				timTimer: null,
				updateTime: '',
				
				tar: [{text: '驿站',type:'primary',value: 4004}, {text: '户外营地',type:'success',value: 4006}],
				curSt: [{text: '已建成',type:'success', value: 2}, {text: '拟投建',type:'info',value: 1}],
				grade: [{text: '一级',value: 1}, {text: '二级',value: 2}, {text: '三级',value: 3}],
				form: {video:{}},
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
					coord: [{
						required: true,
						message: '请选择坐标位置',
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
					level: 4004,
					grade: 1,
					cfg: [],

					phone: '',
					addr: '',
					coord: [121,30],

					cover: '',
					video:{},
					desc: '',
					curSt: 1,
					content: '',
					status: 1
				}
				if (this.userInfo.deptChild.length == 1) {
					this.setRegion(this.userInfo.deptChild)
				}
				this.loading = true
				let id = uni.getStorageSync('station_edit')
				if (!id) {
					await this.$service.zts.station.page({ userId: this.userInfo._id, status: 1 }).then(res => {
						if (res.list.length) { 
							Object.assign(this.form, res.list[0])
						}
					})
					if (!this.form._id) {
						this.$service.zts.station.add({
							...this.form
						}).then(e => {
							this.form._id = e.id
						})
					}
				} else {
					Object.assign(this.form, await this.$service.zts.station.info({id}))
				}
				this.getRegions(this.form.deptId)
				this.autoUpdate()
				this.loading = false
				console.log('.........autoUpdate', this.form);
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
					// this.center = await this.zz.req({$url:'/admin/zz/geoGon', code: pid, center:1})
					window.geoCoder.getPoint(this.dept[pid].name, e => {
						// console.log(this.dept[pid].name,[e.location.lon, e.location.lat, 0], e);
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
				console.log("获取到的当前属地的信息.onNear",e.line)
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
			onUpload(e) {
				this.form.cover = e
			},
			setVideo(e) { 
				this.form.video.url = e
			},
				
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
				
				await this.$service.zts.station.update({ ...this.form })
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
