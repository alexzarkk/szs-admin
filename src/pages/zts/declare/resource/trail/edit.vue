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
						<el-col :span="12"/>
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
					
					<el-row>
						<el-col>
							<el-form-item label="线路轨迹" prop="kml">
								<el-button size="small" type="warning" @click="showKml = true">选取</el-button>
								<block v-if="form.kml">
									<i class="header-icon el-icon-info"></i>
									【{{ form.kml.name }}】
									<text class="padding-left-xs text-grey">长度：</text>
									<text class="text-orange text-bold">{{ form.kml.len }}m</text>
									
									<text class="padding-left-xs text-grey">
										海拔：
										<text class="cuIcon-top"></text>
									</text>
									<text class="text-orange text-bold">{{ form.kml.top }}m</text>
									<text class="text-grey"><text class="cuIcon-down"></text></text>
									<text class="text-orange text-bold">{{ form.kml.bottom }}m</text>
									
									<text class="padding-left-xs text-grey">
										累计：
										<i class="header-icon el-icon-top"></i>
									</text>
									<text class="text-orange text-bold">{{ form.kml.up }}m</text>
									<text class="text-grey"><i class="header-icon el-icon-bottom"></i></text>
									<text class="text-orange text-bold">{{ form.kml.down }}m</text>
								</block>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col>
							<el-form-item label="途径地" prop="path">
								<block :key="idx" v-for="(tag, idx) in form.path">
									<el-tag size="mini" closable :disable-transitions="false" @close="form.path.splice(idx,1)">
									  {{tag}}
									</el-tag>
									<text class="margin-left-xs"></text>
								</block>
								
								<el-input ref="saveTagInput"
								  v-if="pathVisible"
								  v-model="pathValue"
								  size="mini"
								  @keyup.enter.native="handleInputConfirm"
								  @blur="handleInputConfirm"
								>
								</el-input>
								<el-button v-else class="button-new-tag" size="mini" @click="showInput">+ 地名</el-button>
							</el-form-item>
						</el-col>
					</el-row>
					
					<el-divider><i class="el-icon-collection-tag" ></i></el-divider>
				
					<el-form-item label="线路类型" prop="type">
						<el-checkbox-group size="small" v-model="form.type">
							<el-checkbox name="type" v-for="(item, idx) in trail.type" :key="idx" @change="haveCondition" :label="item.value">
								{{ item.label }}
							</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-divider></el-divider>
					
					<block v-if="conditionble">
						<el-form-item :label="'路况结构 '+ (form.condition[0]+form.condition[1]+form.condition[2]+form.condition[3])">
							<el-col :span="6" v-for="(item, idx) in condition" :key="idx">
								<el-progress type="dashboard" :percentage="form.condition[idx]" :format="()=>{
										return `${form.condition[idx]}%\r${condition[idx]}`
									}" :color="colors">
								</el-progress>
								<view>
									<el-button-group>
										<el-button :disabled="form.condition[0]+form.condition[1]+form.condition[2]+form.condition[3]<=0"
											icon="el-icon-minus" @click="decrease(idx)"></el-button>
										<el-button :disabled="form.condition[0]+form.condition[1]+form.condition[2]+form.condition[3]>=100"
											icon="el-icon-plus" @click="increase(idx)"></el-button>
									</el-button-group>
								</view>
							</el-col>
						</el-form-item>
					</block>
					
					<el-divider><i class="el-icon-collection-tag" ></i></el-divider>
					
					<el-form-item label="风格类型" prop="tag">
						<el-checkbox-group size="small" v-model="form.tag">
							<el-checkbox v-for="(item, idx) in trail.tag" :key="idx" :label="item.value">
								{{ item.text }}
							</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item label="景观元素" prop="element">
						<el-checkbox-group size="small" v-model="form.element">
							<el-checkbox v-for="(item, idx) in trail.element" :key="idx" :label="item.value">
								{{ item.label }}
							</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item label="基础设施" prop="serve">
						<el-checkbox-group size="small" v-model="form.serve">
							<el-checkbox v-for="(item, idx) in trail.serverPoi" :key="idx" :label="item.value">
								{{ item.label }}
							</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					
					<el-row>
						<el-col>
							<el-form-item label="印象评分">
								<el-descriptions title="" :column="2"  border>
									<block v-for="(k, i) of trail.ip" :key="i">
										<el-descriptions-item :label="k.label">
											<el-rate v-model="form.ip[i]" :colors="ipcolor"></el-rate>
										</el-descriptions-item>
									</block>
								</el-descriptions>
							</el-form-item>
						</el-col>
					</el-row>
					
					<el-form-item label="封面照片" prop="cover">
						<cl-upload :value="form.cover" @input="onUpload" :limit="1"></cl-upload>
					</el-form-item>
					
					<el-row>
						<el-col>
							<el-form-item label="轮播照片" prop="imgs">
								<cl-upload v-model="form.imgs" is-space :limit="12"></cl-upload>
								<cl-pics :pics="form.imgs" @updatePic="updatePic"></cl-pics>
							</el-form-item>
						</el-col>
					</el-row>
						
					<el-row>
						<el-col :span="form.video.url?16:8">
							<el-form-item label="视频">
								<cl-upload :value="form.video.url" @input="setVideo" :limit="1" :fileType="'video'"></cl-upload>
								<view v-if="form.video.url">
									<el-input size="small" v-model="form.video.desc" placeholder="视频说明"></el-input>
								</view>
							</el-form-item>
						</el-col>
						<el-col v-if="!form.video.url" :span="form.video.url?8:16">
							<view class="flex align-center">
								<text class="text-red">*</text>
								<text class="text-gray text-sm">照片或视频请在本地进行压缩后再上传
									<text class="padding-left-xs"></text>
									<el-link type="primary" href="https://zts.5618.co/repo/JPEGResizer.zip" target="_blank">照片压缩工具下载</el-link>
									<text class="padding-left-xs"></text>
									<el-link type="primary" href="https://zts.5618.co/repo/HandBrake-1.3.3-x86_64-Win_GUI.exe" target="_blank">视频压缩工具下载</el-link>
									<text class="padding-left-xs"></text>
									<el-link type="primary" href="https://vvideo.vip" target="_blank">视频网站搬运解码</el-link>
								</text>
							</view>
						</el-col>
					</el-row>
					
					
					<el-form-item label="简介" prop="desc">
						<el-input type="textarea" v-model="form.desc" placeholder="请输入6-200个字的简介信息"></el-input>
					</el-form-item>

					<el-form-item label="详情" prop="content">
						<cl-editor-tinymce v-if="timTimer" v-model="form.content" :options="{height:600}"></cl-editor-tinymce>
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
		
		<!-- 添加路线 -->
		<cl-dialog title="选取轨迹" :width="'80%'" :props="{fullscreen:false,top: '0vh'}" :height="lay.height - 42 + 'px'" :visible.sync="showKml">
			<cList :height="lay.height" :kmlId="form.kmlId" @add="addKml"></cList>
		</cl-dialog>
	</cl-layout>
</template>

<script>
	import {dist} from '@/comm/geotools.js'
	
	import { mapGetters } from 'vuex';
	import cList from './t10.vue';

	export default {
		components: { cList },
		data() {
			return {
				dept: this.$store.getters.dictObj.deps,
				trail: this.$store.getters.dict.trail,
				visible: false,
				center: [120.15, 30.28],
				region: [],
				loading: true,
				timTimer: null,
				updateTime: '',
				
				showKml: false,
				preview: false,
				pathVisible: false,
				pathValue: '',
				svg: 'https://zts.5618.co/static/loadding.gif',
				conditionble: false,
				condition: ['古道石阶','原土步道', '机耕路', '硬化道'],
				ipcolor: ['#ffaa7f', '#ffa14f', '#ff5500'],
				colors: [
				          {color: '#f56c6c', percentage: 20},
				          {color: '#e6a23c', percentage: 40},
				          {color: '#5cb87a', percentage: 60},
				          {color: '#1989fa', percentage: 80},
				          {color: '#6f7ad3', percentage: 100}
				        ],
				cur: {},
				form: {
					region: [],
					path: [],
					tag: [],
					type: [],
					element:[],
					serve: [],
					imgs: [],
					video:{},
					ip:[0,0,0,0,0,0],
					condition:[0,0,0,0]
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
					kml: [{
						required: true,
						message: '请选择线路轨迹',
						trigger: 'blur'
					}],
					path: [{
						required: true,
						message: '请填写途径地',
						trigger: 'blur'
					}],
					cover: [{
						required: true,
						message: '请上传封面照片',
						trigger: 'blur'
					}],
					imgs: [{
						required: true,
						message: '请选择轮播照片',
						trigger: 'blur'
					}],
					region: [{
						required: true,
						message: '请选择属地',
						trigger: 'blur'
					}],
					type: [{
						required: true,
						message: '请选择线路类型',
						trigger: 'blur'
					}],
					tag: [{
						required: true,
						message: '请选择风格类型',
						trigger: 'blur'
					}],
					element: [{
						required: true,
						message: '请选择景观类型',
						trigger: 'blur'
					}],
					serve: [{
						required: true,
						message: '请选基础设施',
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
					path: [],
					tag: [],
					type: [],
					element:[],
					serve:[],
					condition:[0,0,0,0],
					ip:[0,0,0,0,0,0],

					phone: '',
					addr: '',
					
					cover: '',
					video: {},
					desc: '',
					content: '',
					status: 1,
					imgs: []
				}
				this.kml = null
				if (this.userInfo.deptChild.length == 1) {
					this.setRegion(this.userInfo.deptChild)
				}
				this.loading = true
				let id = uni.getStorageSync('trail_edit')
				if (!id) {
					await this.$service.zts.trail.page({ userId: this.userInfo._id, status: 1 }).then(res => {
						if (res.list.length) { 
							Object.assign(this.form, res.list[0])
						}
					})
					if (!this.form._id) {
						await this.$service.zts.trail.add({
							...this.form
						}).then(e => {
							this.form._id = e.id
						})
					}
				} else {
					Object.assign(this.form, await this.$service.zts.trail.info({id}))
					if(this.form.kmlId) {
						this.addKml(this.form.kmlId)
					}
				}
				this.getRegions(this.form.deptId)
				this.haveCondition()
				this.autoUpdate()
				this.loading = false;
			},
			autoUpdate() {
				if (this.timTimer) this.clearTim()
				this.timTimer = setInterval(() => {
					this.save()
				}, 40000);
			},
			clearTim() {
				clearInterval(this.timTimer)
				this.timTimer = null
				this.updateTime = ''
			},
			addKml(id){
				console.log('addKml ------->', id);
				this.$service.zts.kml.info({id, plain:true, info:true}).then(e=>{
					let t10 = e.children.find(x=>x.t2==10),
						start = t10.coord[0],
						end = t10.coord[t10.coord.length-1]
						
					this.form.kml = {
						name: e.name,
						loop: dist(start, end),
						start,
						end,
						...t10.info
					}
					this.form.kmlId = id
					this.showKml = false
				})
			},
			setRegion(e) {
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
					})
				}
			},
			regionChange(e) {
				if (e.length) {
					for (let s of this.region) {
						if (s.id == e[e.length - 1]) {
							window.geoCoder.getPoint(s.name, (e) => {
								this.center = [e.location.lon, e.location.lat, 0]
							})
						}
					}
				}
			},
			
			
			haveCondition(){
				this.conditionble = false
				for (let s of this.form.type) {
					if(s<=120) return this.conditionble = true
				}
			},
			increase(idx) {
				this.form.condition[idx] += 2
				this.form = this.zz.clone(this.form)
			},
			decrease(idx) {
				this.form.condition[idx] -= 2
				this.form = this.zz.clone(this.form)
			},
			showInput() {
				this.pathVisible = true
				this.$nextTick(_ => {
				  this.$refs.saveTagInput.$refs.input.focus()
				});
			},
			handleInputConfirm() {
				let pathValue = this.pathValue
				if (pathValue) {
					this.form.path.push(pathValue)
				}
				this.pathVisible = false
				this.pathValue = ''
			},
			onUpload(e) {
				this.form.cover = e
			},
			setVideo(e) { this.form.video.url = e },
			updatePic(picData){
				this.form.imgs = picData.pic
			},
			
			async save(){
				await this.$service.zts.trail.update({ ...this.form })
				this.updateTime = this.zz.time2Date()
			},
			async submitForm(tar) {
				let veri = await this.$refs.form.validate()
				if (veri) {
					if(this.conditionble) {
						let c = this.form.condition
						if((c[0]+c[1]+c[2]+c[3])!=100) return this.$message.error("请设置路况！")
					}
					this.loading = true
					await this.save()
					this.loading = false
					
					//预览
					if (tar == 'view') {
						this.zz.preview({path:'/pages/planning/detail', id: this.form._id})
					}
					// 保存
					if (tar == 'save') { 
						this.$message.success("保存成功")
					}
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
	.pathTag {
		padding: 10px;
	}
</style>
