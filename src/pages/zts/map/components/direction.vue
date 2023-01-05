<template>
	<!--
			@name:指引柱dialog
			@desc：
			@date：2021-10-14
			@author: 
	 -->
		<div class="home" v-if="pm">
			<el-row :gutter="15">
				<el-col :lg="11" :xs="24">
					
					<el-row :gutter="15">
						<el-col>
							<div class="direct">
								<direct :pm="pm" @refresh="refresh"></direct>
							</div>
						</el-col>
					</el-row>
					
					<el-row :gutter="10">
						<el-col>
							<div class="direct margin-top" >
								<el-form ref="form" :rules="rules" :model="pm" label-width="100px">
									<el-row>
										<el-col :span="12">
											<el-form-item label="名称" prop="name">
												<el-input v-model="pm.name" placeholder="请输入指引柱名称"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="12">
											
										</el-col>
									</el-row>
									
									<el-row>
										<el-col :span="12">
											<el-form-item label="当前位置" prop="curName">
												<el-input v-model="pm.curName" placeholder="所在地名(如有请输入)"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="12">
											<el-form-item label="方位角°" prop="curDrect">
												<el-input-number v-model="pm.curDrect" :min="1" :max="360"></el-input-number>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="23">
											<el-form-item label="备注">
												<el-input v-model="pm.desc" type="textarea" :rows="1" placeholder="请输入内容"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="1"></el-col>
									</el-row>
									
									<el-divider content-position="center"><el-link type="info" disabled>指引方向</el-link></el-divider>
									<block v-for="(d, j) of pm.direction" :key="j">
										<el-row>
											<el-col :span="1">
												<el-tag type="info">{{j+1}}</el-tag>
											</el-col>
											
											<el-col :span="4">
												<el-form-item label="指向角°"></el-form-item>
											</el-col>
											<el-col :span="4">
												<el-input-number class="inum" v-model="d.angle[0]" :min="-1" :max="360" size="small"></el-input-number>
											</el-col>
											<el-col :span="4">
												<el-input-number class="inum" v-model="d.angle[1]" :min="-1" :max="360" size="small"></el-input-number>
											</el-col>
											<el-col :span="10">
												<block v-for="(t, i) of d.target" :key="999+i">
													<el-tooltip :open-delay="999" class="item" effect="dark" content="双击修改地名" placement="top">
														<span @dblclick="editPlace(j,i)">
															<el-tag closable :key="t.name" class="place" @click="tagPlace(t,i)" @close="tagClose(j,i)">
															  {{t.name}}
															</el-tag>
														</span>
													</el-tooltip>
												</block>
												<el-tooltip class="item" effect="dark" content="添加指向地" placement="top">
													<el-button type="success" class="place" icon="el-icon-plus" size="mini" circle @click="addPlace(j)"></el-button>
												</el-tooltip>
												
											</el-col>
											<el-col :span="1">
												<el-tooltip class="item" effect="dark" content="删除指向" placement="top">
													<el-button type="danger" class="place" icon="el-icon-delete" size="mini" circle @click="delTarget(j)"></el-button>
												</el-tooltip>
											</el-col>
										</el-row>
									</block>
									<el-row>
										<el-col :span="24">
											<view class="flex justify-end">
												<!-- <el-button size="small" @click="reset(false)">重置</el-button> -->
												<el-button size="small" @click="addTarget">添加方向</el-button>
												<el-button type="success" size="small" @click="saving" :loading="onSaving">保存修改</el-button>
											</view>
											
										</el-col>
									</el-row>
								</el-form>
							</div>
						</el-col>
					</el-row>
					
				</el-col>
				<el-col :lg="13" :xs="24">
					<el-row :gutter="15">
						<el-col>
							<view class="flex justify-between align-center">
								<view>
									<el-button size="mini" @click="changIdx(-1)" :disabled="idx==0" icon="el-icon-arrow-left">上一个</el-button>
									<el-button size="mini" @click="changIdx(1)" :disabled="idx==t29.length-1">下一个<i class="el-icon-arrow-right el-icon--right"></i></el-button>
									<el-tooltip class="item" effect="dark" content="加载一个外部kml文件用于添加指引地的选择" placement="top">
										<el-button size="mini" type="primary" @click="loadKml">加载</el-button>
									</el-tooltip>
									
								</view>
								<cl-flex1 />
								地图：<el-select v-model="maptype" placeholder="请选择" size="mini" @change='changeMapType'>
										<el-option label="浙江" value="zj"/>
										<el-option label="3D" value="3D"/>
									</el-select>
							</view>
						</el-col>
					</el-row>
					<el-row :gutter="15">
						<el-col>
							<div :style="'margin-top:4px; height: '+(height-66)+'px'">
								<block v-if="maptype=='zj'">
									<mapbox-map
										:editble="false"
										:center="center"
										:zoom="16"
										:bearing="pm.curDrect"
										@mb-rotateend="mbRotate"
										
										@mb-created="init"
										@mb-dragend="mbEvt"
										@mb-click="mbClick"
										@drawEvt="drawEvt">
									
										<block v-if="t.coord">
											<z-marker popup :pm="t"></z-marker>
										</block>
										<block v-if="curDrect">
											<mapbox-marker :element="curDrect" :lng-lat="pm.coord"  popup>
												<template v-slot:popup>
													<p>阅读方向</p>
												</template>
											</mapbox-marker>
										</block>
										
										<!-- 默认轨迹kml -->
										<block v-for="(pm, i) of t10" :key="i+'1'">
											<z-line :pm="pm"></z-line>
										</block>
										
										<!-- 采集时引用的kml -->
										<block v-for="(pm, i) of refPm.line" :key="i+'2'">
											<z-line :pm="pm" :opt="refStyle"></z-line>
										</block>
										<block v-for="(p, i) of refPm.point" :key="i+'3'">
											<z-marker popup :pm="p" :opt="refStyle">
												<template v-slot:popup>
													<marker-info :extData="p" :edit="false">
														<block slot="btn">
															<view class="flex justify-around">
																<block v-for="(x, j) of pm.direction" :key="j+'4'">
																	<el-tooltip class="item" effect="dark" :content="'添加到第'+(j+1)+'个('+(x.angle[0])+'°)指向'" placement="top">
																		<el-link type="primary" @click="addTo(p,j)">添加{{j+1}}</el-link>
																	</el-tooltip>
																</block>
															</view>
														</block>
													</marker-info>
												</template>
											</z-marker>
										</block>
										
										<block v-if="render">
											<z-marker popup :pm="pm">
												<template v-slot:popup>
													<marker-info :extData="pm" :edit="false"></marker-info>
												</template>
											</z-marker>
											<!-- 指向地名 -->
											<block v-for="(d, j) of places" :key="j">
												<z-marker :popup="{anchor:'top'}" :pm="d" draggable @dragend="markerDraged">
													<template v-slot:popup>
														<marker-info :extData="d" :edit="false"></marker-info>
													</template>
												</z-marker>
											</block>
										</block>
									</mapbox-map>
								</block>
								<block v-if="maptype=='3D'">
									<MapboxMap3D
										:editble="false"
										:center="center"
										:zoom="16"
										:pitch="30"
										:bearing="pm.curDrect"
										
										@mb-rotateend="mbRotate"
										@mb-created="init"
										@mb-dragend="mbEvt"
										@mb-click="mbClick"
										@drawEvt="drawEvt">
									
										<block v-if="t.coord">
											<z-marker popup :pm="t"></z-marker>
										</block>
										<block v-if="curDrect">
											<mapbox-marker :element="curDrect" :lng-lat="pm.coord"  popup>
												<template v-slot:popup>
													<p>阅读方向</p>
												</template>
											</mapbox-marker>
										</block>
										
										<!-- 默认轨迹kml -->
										<block v-for="(pm, i) of t10" :key="i+'1'">
											<z-line :pm="pm"></z-line>
										</block>
										
										<!-- 采集时引用的kml -->
										<block v-for="(pm, i) of refPm.line" :key="i+'2'">
											<z-line :pm="pm" :opt="refStyle"></z-line>
										</block>
										<block v-for="(p, i) of refPm.point" :key="i+'3'">
											<z-marker popup :pm="p" :opt="refStyle">
												<template v-slot:popup>
													<marker-info :extData="p" :edit="false">
														<block slot="btn">
															<view class="flex justify-around">
																<block v-for="(x, j) of pm.direction" :key="j+'4'">
																	<el-tooltip class="item" effect="dark" :content="'添加到第'+(j+1)+'个('+(x.angle[0])+'°)指向'" placement="top">
																		<el-link type="primary" @click="addTo(p,j)">添加{{j+1}}</el-link>
																	</el-tooltip>
																</block>
															</view>
														</block>
													</marker-info>
												</template>
											</z-marker>
										</block>
										<block v-if="render">
											<z-marker popup :pm="pm">
												<template v-slot:popup>
													<marker-info :extData="pm" :edit="false"></marker-info>
												</template>
											</z-marker>
										
											<!-- 指向地名 -->
											<block v-for="(d, j) of places" :key="j">
												<z-marker :popup="{anchor:'top'}" :pm="d" draggable @dragend="markerDraged">
													<template v-slot:popup>
														<marker-info :extData="d" :edit="false"></marker-info>
													</template>
												</z-marker>
											</block>
										</block>
										
									</MapboxMap3D>
								</block>
							</div>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
			
			<el-dialog title="新增指引地" :visible.sync="t.open" :append-to-body="true" width="30%" center>
			  <span>
				  <el-input v-model="t.name" placeholder="请输入地名..."></el-input>
			  </span>
			  <span slot="footer" class="dialog-footer">
			    <el-button @click="placeEvt(0)">取 消</el-button>
			    <el-button type="primary" @click="placeEvt(1)">确 定</el-button>
			  </span>
			</el-dialog>
			<el-dialog title="修改指引地名称" :visible.sync="place.open" :append-to-body="true" width="30%" center>
			  <span>
				  <el-input v-model="place.name" placeholder="请输入地名..."></el-input>
			  </span>
			  <span slot="footer" class="dialog-footer">
			    <el-button type="primary" @click="placeSet(1)">确 定</el-button>
			  </span>
			</el-dialog>
		</div>
</template>

<script>
import { mapGetters } from 'vuex';
// import { veri } from '@/cool/utils/pmCurd';
// import { clone } from '@/cool/utils/dict.js';
// import { upload } from "@/cool/utils/uploadKml.js"
// import uniqId from '@/components/mapbox/utils/uniq-id.js';

// var helpers = require('@turf/helpers');
// import { bearing } from '@turf/turf';

// import direct from './direct.vue';
var thiz
export default {
	// components: { direct },
	data() {
		return {
			center:[],
			curDrect: null,
			onSaving: false,
			
			refStyle: {
				color: '#710000',
				width: 2,
				opacity: 0.6,
				cap: 'square',
				icon: './static/png/gray.png',
				fontColor: '#aaffff',
				textSize: 14
			},
			maptype:'3D',
			pm: null,
			render: false,
			cKml: null,
			places: [],
			
			t: {
				idx: -1,
				name: '',
				t2: 200,
				coord: null,
				open: false,
			},
			place: {
				open: false,
				name: '',
			},
			
			rules: {
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }, { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }],
				curDrect: [{ required: true, message: '方位角必须填', trigger: 'blur' }],
			},
			
			refPm:null,
			idx: 0
		};
	},
	props: {
		refKml: { 
			type: Object,
			default: ()=>{
				return { line:[], point:[] }
			}
		},
		directPoi: { type: Object },
		t10: { type: Array },
		t29: { type: Array },
		height: { type: Number }
	},
	computed: {
		... mapGetters(['lay','userInfo'])
	},
	watch: {
		t29: {
			deep: true,
			handler(v1,v2) {
				// console.log(v1,v2);
				if(v1&&v1.length) this.reset(clone(this.t29[this.idx]))
			}
		},
	},
	async mounted() {
		// console.log('mounted=======', this.refKml);
		this.refPm = clone(this.refKml)
		this.render = false
		thiz = this
		let id = uni.getStorageSync('collect_check')
		this.cKml = await this.$service.zts.kml.info({ id, noChild: true })
		this.changIdx()
	},
	methods: {
		refresh(){
			// this.pm = null
			this.changIdx(-9)
			// this.reset(clone(this.t29[this.idx]))
		},
		changIdx(e){
			this.places = []
			this.render = false
			if(!e) {
				for (var i = 0; i < this.t29.length; i++) {
					if(this.t29[i]._id == this.directPoi._id){
						this.idx = i
						break
					}
				}
			} else {
				if(e>-9)this.idx += e
			}
			setTimeout(function() {thiz.reset(clone(thiz.t29[thiz.idx]),true)}, 10);
			// this.reset(clone(this.t29[this.idx]))
		},
		reset(pm,toCenter){
			if(pm){
				this.pm = clone(pm)
			}else {
				this.pm = clone(this.t29[this.idx])
			}
			
			this.pm.name = this.pm.name.replace('(补)','')
			// console.log('this.pm',pm,this.pm);
			
			if(!this.pm.direction) {
				this.pm.curDrect = 0
				this.pm.direction = []
			}
			
			if(toCenter) this.center = this.pm.coord
			
			let places = []
			for (var j = 0; j < this.pm.direction.length; j++) {
				let s = this.pm.direction[j]
				for (var i = 0; i < s.target.length; i++) {
					let _id = '_'+j+'_'+i
					if(this.map&&this.map.getSource(_id)){
						 this.map.removeSource(_id)
					}
					places.push({
						...s.target[i],
						_id,
						i,
						j,
						t1:2,
						t2:200,
						prop: { icon: {iconUrl:'./static/icon/map/t200.png' }}
					})
				}
			}
			this.places = places
			
			let e = document.createElement("img");
			e.src = './static/png/up.png'
			e.style = 'opacity:0.5'
			this.curDrect = e
			this.render = true
		},
		init(e){
			this.map = e.map
		},
		changeMapType(e){
			if(e=='3D'&&!this.notified3D){
				this.$notify({ title: '提示', message: '按住鼠标右键并移动（查看3D地形）', offset: 100 })
				this.notified3D = true
			}
		},
		mbEvt(e){
			// console.log(e);
		},
		mbClick(e){
			if(this.t.idx>-1) {
				this.t._id = uniqId()
				this.t.open = true
				this.t.coord = [Number(e.lngLat.lng.toFixed(6)), Number(e.lngLat.lat.toFixed(6)),0]
				this.t.prop = { icon: {iconUrl:'./static/icon/map/t200.png' }}
			}
		},
		mbRotate(e){
			this.pm.curDrect = helpers.bearingToAzimuth(~~e.target.getBearing())
		},
		drawEvt(e){
			// console.log(e);
		},
		markerDraged(e){
			let pm = e.target.pm,
				c = e.target.getLngLat(),
				coord = [Number(c.lng.toFixed(6)), Number(c.lat.toFixed(6)),0]
			
			this.pm.direction[pm.j].target[pm.i].coord = coord
			this.places = []
			setTimeout(function() {thiz.reset(thiz.pm)}, 1);
		},
		tagPlace(e,i) {
			// this.center = e.coord
			this.map.flyTo({center: e.coord})
		},
		addPlace(j){
			// console.log(this.pm.direction[j]);
			this.t.idx = j
			this.t.name = ''
			this.$notify({
				title: '提示',
				message: '请用鼠标在地图上选取坐标位置',
				position: 'bottom-right'
			});
		},
		placeEvt(e){
			if (e) {
				// console.log(this.t);
				this.pm.direction[this.t.idx].target.push({
					name: this.t.name,
					coord: this.t.coord
				})
				this.places.push({
					...this.t,
					_id: uniqId(),
					t1:2,
					t2:200,
					prop: { icon: {iconUrl:'./static/icon/map/t200.png' }}
				})
			}
			this.t.idx = -1
			this.t.coord = null
			this.t.open = false
		},
		addTarget(){
			this.pm.direction.push({ "angle": [ 0, -1 ], "target": [] })
		},
		delTarget(j){
			this.$confirm("此操作将删除选中数据，是否继续？", "提示", {
				type: "warning"
			}).then((res) => {
				if (res === "confirm") {
					this.pm.direction.splice(j,1)
					console.log(this.pm,j);
					this.reset(this.pm)
					// setTimeout(function() {thiz.reset(thiz.pm)}, 10);
				}
			}).catch(() => null);
		},
		tagClose(j,i){
			console.log(this.pm.direction[j].target[i]);
			let d = this.pm.direction[j]
			this.$confirm("此操作将删除选中数据，是否继续？", "提示", {
				type: "warning"
			}).then((res) => {
				if (res === "confirm") {
					// if(d.target.length==1) return this.$message.error("至少有一个指向地名！")
					d.target.splice(i,1)
					this.reset(this.pm)
					// setTimeout(function() {thiz.reset(thiz.pm)}, 10);
				}
			}).catch(() => null);
		},
		editPlace(j,i) {
			// console.log('editPlace',this.pm.direction[j].target[i].name);
			this.place = {
				idx: [j,i],
				name: this.pm.direction[j].target[i].name,
				open: true
			}
		},
		async placeSet(){
			let p = this.place
			this.pm.direction[p.idx[0]].target[p.idx[1]].name = p.name
			await this.saving()
			p.open = false
		},
		addTo(p,i){
			// console.log('addTo',this.pm.direction[i],p)
			
			// for (let s of this.pm.direction) {
			// 	for (let n of s.target) {
			// 		if(n.name==p.name) return this.$message.error("地名‘"+n.name+"’已经存在，请勿重复指向！")
			// 	}
			// }
			this.pm.direction[i].target.push({
				name:p.name,
				coord:p.coord
			})
			this.places = []
			setTimeout(function() {thiz.reset(thiz.pm)}, 1)
		},
		async saving(){
			if(!veri.call(this,{thiz:this})) return
			
			// console.log('saving',this.pm);
			let ver = false
			this.$refs.form.validate((valid) => { ver = valid })
			if(!this.pm.direction.length) return this.$message.error("至少有一个指向！")
			for (let s of this.pm.direction) {
				if(!s.target.length) return this.$message.error("至少有一个指向地名！")
			}
			if(ver){
				this.onSaving = true
				const {_id, name, desc, curName, curDrect, direction } = this.pm
				await this.$service.zts.placemark.update({ _id, name,desc, curName, curDrect, direction }).catch((err) => {
					this.$message.error(err);
				})
				this.onSaving = false
				this.$message.success("保存成功！")
				// this.reset(clone(this.t29[this.idx]))
				this.$emit('update:directPoi', this.pm)
				this.$emit('refresh');
			}
		},
		loadKml(){
			upload.call(this, { kml:null , e:{coord:false}, kt:null, fn:async (e)=>{
				for (let s of e) {
					s._id = uniqId()
					if(s.t1==1) this.refPm.line.push(s)
					if(s.t1==2){
						this.refPm.point.push(s)
					} 
					console.log(s);
				}
			}});
		}
	}
};
</script>

<style lang="scss" scoped>
.home {
	height: 100%;
	overflow: hidden auto;
	.direct {
		height: 400px;
		width: 100%;
		min-height: 400px;
	}
	._map {
		width: 100%;
		height: 100%;
	}
	.place {
		margin-left: 5px;
		cursor: pointer;
	}
	.inum {
		width: 110px;
	}
}
</style>
