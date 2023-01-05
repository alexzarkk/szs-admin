<template>
	<view>
		<view class="solid flex align-center justify-start" style="height: 36px;" v-loading="loading">
			
			<el-tooltip class="item" effect="dark" content="清理缓存并刷新" placement="top">
				<el-button type="warning" size="mini" icon="el-icon-refresh" circle @click="kmlRefresh(2)"></el-button>
			</el-tooltip>
			
			<el-tooltip class="item" effect="dark" content="统计信息" placement="top">
				<el-button type="success" size="mini" icon="el-icon-finished" circle @click="reCount"></el-button>
			</el-tooltip>
			
			<el-tooltip class="item" effect="dark" content="下载轨迹(防止误操作,下载以作备份)" placement="top">
				<el-button type="info" size="mini" icon="el-icon-download" circle @click="download"></el-button>
			</el-tooltip>
			
			<!-- 采集 -->
			<block v-if="kml.type == 9">
				<block v-if="kml.status == -1">
					<el-tooltip class="item" effect="dark" content="恢复" placement="top">
						<el-button type="success" size="mini" icon="el-icon-refresh-right" circle @click="setStatus(2)"></el-button>
					</el-tooltip>
				</block>
				<block v-else>
					<block v-if="kml.status < 6">
						<el-tooltip class="item" effect="dark" content="复核" placement="top">
							<el-button type="success" size="mini" icon="el-icon-check" circle @click="check"></el-button>
						</el-tooltip>
					</block>
					<block v-if="kml.status == 6">
						<el-tooltip class="item" effect="dark" content="审核" placement="top">
							<el-button v-permission="$service.zts.kml.permission.verify" icon="el-icon-s-check" size="mini" circle type="success" @click="veryfy"></el-button>
						</el-tooltip>
					</block>
					<block v-if="kml.status >= 10">
						<el-tooltip class="item" effect="dark" content="详情统计/更新" placement="top">
							<el-button type="success" size="mini" icon="el-icon-finished" circle @click="reCount"></el-button>
						</el-tooltip>
					</block>

					<block v-if="kml.status >= 10">
						<el-tooltip v-permission="$service.zts.kml.permission.veriBack" class="item" effect="dark" content="退审" placement="top">
							<el-button type="warning" size="mini" icon="el-icon-refresh-left" circle @click="setStatus(kml.status==10?4:10)"></el-button>
						</el-tooltip>
						
						<!-- <el-tooltip class="item" effect="dark" content="上传轨迹" placement="top">
							<el-button type="info" size="mini" icon="el-icon-upload2" circle @click="upload"></el-button>
						</el-tooltip> -->
					</block>
				
					<block v-else>
						<el-tooltip class="item" effect="dark" content="上传轨迹" placement="top">
							<el-button type="info" size="mini" icon="el-icon-upload2" circle @click="upload"></el-button>
						</el-tooltip>
					</block>

					
					<el-tooltip class="item" effect="dark" content="编辑" placement="top">
						<el-button type="primary" size="mini" icon="el-icon-edit" circle :disabled="!cur.coord" @click="edit"></el-button>
					</el-tooltip>
					<el-tooltip class="item" effect="dark" content="删除" placement="top">
						<el-button type="danger" size="mini" icon="el-icon-delete" circle :disabled="!cur.coord" @click="del"></el-button>
					</el-tooltip>
					
					
					<span class="padding-left-xs" v-if="kml.status <= 4">
						<el-tooltip class="item" effect="dark" content="还原默认轨迹" placement="top">
							<el-button type="primary" size="mini" icon="el-icon-refresh-right" circle @click="backDef"></el-button>
						</el-tooltip>
					</span>
				</block>
			</block>
			
			<!-- 完工巡线 -->
			<block v-else-if="kml.type == 40">
				
				<block v-if="kml.status == 6">
					<el-tooltip class="item" effect="dark" content="审核" placement="top">
						<el-button v-permission="$service.zts.kml.permission.verify" icon="el-icon-s-check" size="mini" circle type="success" @click="veryfy"></el-button>
					</el-tooltip>
				</block>
		
				<block v-if="kml.status > 6">
					<el-tooltip v-permission="$service.zts.kml.permission.veriBack" class="item" effect="dark" content="退审" placement="top">
						<el-button type="warning" size="mini" icon="el-icon-refresh-left" circle @click="setStatus(kml.status==10?4:10)"></el-button>
					</el-tooltip>
				</block>
				
				<block v-if="!cur.lock">
					<el-tooltip class="item" effect="dark" content="编辑" placement="top">
						<el-button type="primary" size="mini" icon="el-icon-edit" circle :disabled="!cur.coord" @click="edit"></el-button>
					</el-tooltip>
					<el-tooltip class="item" effect="dark" content="删除" placement="top">
						<el-button type="danger" size="mini" icon="el-icon-delete" circle :disabled="!cur.coord" @click="del"></el-button>
					</el-tooltip>
				</block>
			</block>
			
			<!-- 其他绘制 -->
			<block v-else>
				
				<el-tooltip class="item" effect="dark" content="上传轨迹" placement="top">
					<el-button type="info" size="mini" icon="el-icon-upload2" circle @click="upload"></el-button>
				</el-tooltip>
				
				<block v-if="!cur.lock">
					<el-tooltip class="item" effect="dark" content="编辑" placement="top">
						<el-button type="primary" size="mini" icon="el-icon-edit" circle :disabled="!cur.coord" @click="edit"></el-button>
					</el-tooltip>
					<el-tooltip class="item" effect="dark" content="删除" placement="top">
						<el-button type="danger" size="mini" icon="el-icon-delete" circle :disabled="!cur.coord" @click="del"></el-button>
					</el-tooltip>
				</block>
				
			</block>
			
		</view>
		
		<!-- 线路详情统计/更新 -->
		<cl-dialog :width="'60%'" :height="lay.height - 42 + 'px'" :props="{ fullscreen: false, top: '0vh' }" :title="kml.name" :visible.sync="checking">
			<checking :kml="kml" :height="lay.height" @checked="checked"></checking>
		</cl-dialog>
		<!-- 指引柱的详细信息 -->
		<cl-dialog :width="'100%'" :props="{ top: '0vh', fullscreen: true }" title="指引柱" :visible.sync="directionChart">
			<block v-if="t29 && directionChart">
				<!-- <direction :t29="t29" :refKml="refKml" :directPoi.sync="directPoi" :height="lay.height" :t10="t10" @refresh="kmlRefresh"></direction> -->
			</block>
		</cl-dialog>
		
	</view>
</template>

<script>
import { mapGetters } from 'vuex'
import { upload } from '@/cool/utils/uploadKml'
import { open, merge, veryfy, del, veri } from '@/cool/utils/pmCurd'

export default {
	props: {
		kml: { type: Object },
		cur: { type: Object }
	},
	data() {
		return {
			loading: false,
			checking: false,
			directionChart: false,
			checking: false,
			directPoi: {},
			t29: null
		}
	},
	computed: { ...mapGetters(['lay','userInfo']) },
	mounted() {
		console.log(this.kml);
	},
	methods: {
		kmlRefresh(init) {
			this.$emit('refresh', init)
		},
		upload() {
			if (veri.call(this, {})) {
				upload.call(this, {
					kml: null,
					e: { coord: false },
					kt: this.kml.type,
					fn: async (pms,data) => {
						for (let s of pms) {
							// return console.log({...s, ...data, kmlId: this.kml.cur._id});
							this.loading = true
							await this.$service.zts.placemark.add({...s, ...data, kmlId: this.kml._id})
							this.loading = false
						}
						this.kmlRefresh(1)
						if (this.kml.status >= 10) {
							this.$service.zts.kml.createChart({ _id: this.kml._id })
						}
					}
				})
			}
		},
		setStatus(e) {
			if (veri.call(this, {})) {
				this.$confirm('确定' + (e == 2 ? '撤销删除' : '退回审核') + '？', '提示', {
					type: 'warning'
				}).then(res => {
					if (res === 'confirm') {
						this.$service.zts.kml.update({
							status: e,
							_id: this.kml.cur._id
						}).then(e => {
							if (e == 4) this.$service.zts.chart.delete({ ids: [this.kml.cur._id] })
	
							this.kml.cur.status = e
							this.kmlRefresh(1)
						})
					}
				})
			}
		},
		download() {
			let kml = clone(this.kml.cur)
			kml.children = clone(this.kml.list)
			this.zz.expKml(kml)
		},
		async reCount() {
			// this.kml.loading = true;
			// this.chart = await this.$service.zts.chart.get({ id: this.kml.cur._id })
			// this.kml.loading = false;
			this.check();
		},
		async backDef() {
			this.loading = true
			await this.$service.zts.placemark.backDef({kmlId: this.kml._id})
			this.loading = false
			this.kmlRefresh(1)
		},
		check() {
			this.checking = true
		},
		checked(e) {
			// console.log('checked',e);
			this.kml.cur = e
			this.checking = false
		},
		veryfy() {
			//完工巡线
			if(this.kml.type==40) {
				uni.setStorageSync('constr_kml', this.kml._id)
			}
			this.zz.openWin({url: 'pc/#/pages/zts/constr/verify'})
		},
		edit() {
			open({ thiz: this, act: 'edit', pm: this.cur })
		},
		del() {
			del.call(this,{ pm: this.cur })
		}
	}
};
</script>
