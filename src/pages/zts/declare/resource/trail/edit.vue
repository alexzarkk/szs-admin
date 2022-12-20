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
					<!-- <el-form-item label="预计耗时" prop="desc">
						<el-date-picker placeholder="选择时间" v-model="form.ondate" type="daterange" size="small"
										value-format="yyyy-MM-dd"
										start-placeholder="开建日期"
										end-placeholder="完成日期"></el-date-picker>
					</el-form-item> -->
					
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
							<el-checkbox v-for="(item, idx) in trail.viewElement" :key="idx" :label="item.value">
								{{ item.text }}
							</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item label="基础设施" prop="serve">
						<el-checkbox-group size="small" v-model="form.serve">
							<el-checkbox v-for="(item, idx) in trail.serverPoi" :key="idx" :label="item.value">
								{{ item.text }}
							</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					
					<el-row>
						<el-col>
							<el-form-item label="印象评分">
								<el-descriptions title="" :column="2"  border>
									<block v-for="(k, i) of ip" :key="i">
										<el-descriptions-item :label="k.name">
											<el-rate v-model="form.ip[i]" :colors="ipcolor"></el-rate>
										</el-descriptions-item>
									</block>
								</el-descriptions>
							</el-form-item>
						</el-col>
					</el-row>
					
					<el-row>
						<el-col>
							<el-form-item label="轮播照片" prop="imgs">
								<cl-upload v-model="form.imgs" is-space></cl-upload>
								<cl-pics :pics="form.imgs" @updatePic="updatePic"></cl-pics>
							</el-form-item>
						</el-col>
					</el-row>
						
					<el-form-item label="封面照片" prop="cover">
						<cl-upload :value="form.cover" @input="onUpload"></cl-upload>
					</el-form-item>
					
					<tool-tip></tool-tip>
					
					<el-form-item label="视频">
						<cl-upload :value="form.video.url" @input="setVideo" :fileType="'video'"></cl-upload>
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
		<cl-dialog :title="'扫码预览'" :height="'200px'" :width="'240px'" :controls="['close']" :visible.sync="preview">
			<image style="width: 200px; height: 200px;" mode="aspectFill" :src="svg"></image>
		</cl-dialog>
		
		<!-- 添加路线 -->
		<cl-dialog title="选取轨迹" :width="'80%'" :height="lay.height - 42 + 'px'" :props="{ top: '0vh' }" :visible.sync="showKml">
			<cList :height="lay.height" @add="addKml"></cList>
		</cl-dialog>
	</cl-layout>
</template>

<script>
	//var QRCode = require("qrcode-svg");
	import { mapGetters } from 'vuex';
	import { trail,impression } from "@/cool/utils/dict.js"
	import { getLable, getCids } from "@/config/dict";
	
	import cList from './t10.vue';

	export default {
		components: { cList },
		data() {
			return {
				cid: [],
				ip: impression,
				trail: trail,
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
					condition:[0,0,0,0],
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
					imgs: [],
					userId: this.userInfo._id
				}
				this.kml = null
				if (this.cid.length == 1) {
					this.setRegion(this.cid)
				}
				this.loading = true
				let id = this.$route.query._id
				if (!id) {  // 没有前面传过来的数据   新增模式
					try {
						await this.$service.zts.trail.page({  // 获取自动保存的数据
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
							await this.$service.zts.trail.add({
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
					this.cur = await this.$service.zts.trail.info({id})
					this.form = this.cur
					if(this.cur.kmlId) {
						this.addKml(this.cur.kmlId)
					}
					// this.form.serve = []
					console.log(this.form);
				}
				this.haveCondition()
				this.autoUpdate()
				this.loading = false;
			},
			autoUpdate() {
				if (this.timTimer) this.clearTim()
				this.timTimer = setInterval(() => {
					this.updateTime = this.zz.timeToDate()
					this.$service.zts.trail.update({ ...this.form })
				}, 40000);
			},
			clearTim() {
				clearInterval(this.timTimer)
				this.timTimer = null
				this.updateTime = ''
			},
			addKml(id){
				// console.log('addKml ------->', id);
				this.$service.zts.kml.info({id, plain:true, info:true}).then(e=>{
					let t10 = e.children.find(x=>x.t2==10),
						start = t10.coord[0],
						end = t10.coord[t10.coord.length-1]
						
					// e.info = t10.info
					this.form.kml = {
						name: e.name,
						loop: this.zz.geo.getDist(start[0],start[1], end[0],end[1]),
						start,
						end,
						...t10.info
					}
					this.form.kmlId = id
					this.showKml = false
				})
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
			getRegions(pid) {  // 获取当前的 街道信息，加入默认的departmentId信息
				if (pid) {
					this.form.deptId = pid + ''
					// console.log("当前只有一个cid，添加deptId",this.form)
					this.regionLoading = true;
					this.$service.system.dept.list({
						pid
					}).then(res => {
						this.region = res
						console.log("获取到的街道的信息",this.region)
						// this.form = this.zz.geo.clone(this.form)
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
			
			haveCondition(){
				this.conditionble = false
				for (let s of this.form.type) {
					if(s<=120) return this.conditionble = true
				}
			},
			increase(idx) {
				this.form.condition[idx] += 2
				this.form = this.zz.geo.clone(this.form)
			},
			decrease(idx) {
				this.form.condition[idx] -= 2
				this.form = this.zz.geo.clone(this.form)
			},
			showInput() {
				this.pathVisible = true
				this.$nextTick(_ => {
				  this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			handleInputConfirm() {
				let pathValue = this.pathValue
				if (pathValue) {
				  this.form.path.push(pathValue)
				}
				this.pathVisible = false;
				this.pathValue = ''
			},
			onUpload(e) {
				this.form.cover = e
			},
			setVideo(e) { this.form.video.url = e },
			updatePic(picData){
				console.log('remove.updatePic -------------', picData);
				this.form.imgs = picData.pic
			},
			async submitForm(tar) {
				let veri = false
				this.$refs.form.validate((valid) => {
					if (valid) {
						veri = true
					} else {
						console.log('error submit!!');
						return false;
					}
				});
				if(this.conditionble) {
					let c = this.form.condition
					if((c[0]+c[1]+c[2]+c[3])!=100) this.$message.error("请设置路况！")
				}
				
				if (veri) {
					this.loading = true
					if (this.form.status == 1) this.form.status = 2
					// console.log("提交的内容",this.form)
					await this.$service.zts.trail.update({
						...this.form,
					}).done(() => {
						this.loading = false;

						if (tar == 'view') {
							// console.log('预览', this.form)
							if (!this.preview) {
								this.preview = true
								let qrcode = new QRCode({
									content: "https://zts.5618.co/build/#/pages/share?path=/pages/planning/detail&id=" +
										this.form._id,
									join: true
								});
								let svg = qrcode.svg();
								this.$service.zts.trail.preview({
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
							// uni.removeStorageSync('zts_trail_edit')
							// setTimeout(() => {
							// 	this.$router.back();
							// }, 100)
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
	.pathTag {
		padding: 10px;
	}
</style>
