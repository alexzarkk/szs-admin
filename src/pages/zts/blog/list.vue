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
                                    <el-option :value="0" label="待审核"></el-option>
                                    <el-option :value="4" label="未通过"></el-option>
                                    <el-option :value="10" label="已通过"></el-option>
                                </el-select>
                            </cl-filter>
                            <!-- <cl-filter label="类型">
                                <el-select size="mini" v-model="type" @change="refresh()">
                                    <el-option :value="0" label="全部"></el-option>
                                    <block v-for="(t, index) in article" :key="index">
                                        <el-option :value="t.value" :label="t.label"></el-option>
                                    </block>
                                </el-select>
                            </cl-filter> -->
                            <cl-search-key />
                        </el-row>

                        <el-row type="flex">
                            <cl-table style="width:80%;" :props="{
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
											prop: 'createTime',
											label: '评论时间',
											align: 'center',
                                            width: '160'
										},
                                        {
											prop: 'tt',
											label: '评论内容类型',
											align: 'center',
                                            width: '140'
										},
										{
											prop: 'content',
											label: '评论内容',
											align: 'center'
										},
                                        {
											prop: 'img',
											label: '评论图片',
											align: 'center'
										},
                                        {
											prop: 'status',
											label: '评论状态',
											align: 'center'
										},
										{
											label: '操作',
											align: 'center',
											type: 'op',
                                            
											buttons: [ 'slot-detail', 'slot-veri']
										}
									]">
                                <!-- 'slot-edit', -->
                                <!-- 时间 -->
                                <template #column-createTime="{ scope }">
                                    {{ scope.row.updateTime }}
                                </template>
                                <template #column-tt="{ scope }">
                                    {{getContentTypeText(scope.row.tt)}}
                                    <!-- <block v-for="(i, idx) of scope.row.type" :key="idx">
                                        <el-tag size="mini" style="margin-left: 4px;" :class="'bg-'+articleO[i].color" effect="plain">
                                            {{ articleO[i].label }}
                                        </el-tag>
                                    </block> -->
                                </template>

                                <template #column-img="{ scope }">
                                    <template v-if="scope.row.imgs && scope.row.imgs.length>0">
                                        <el-image v-for="(item,index) in scope.row.imgs" :key="index" style="width: 100px; height: 100px" fit="cover" :src="item" :preview-src-list="scope.row.imgs">
                                        </el-image>
                                    </template>
                                </template>
                                <template #column-status="{ scope }">
                                    <!-- :type="st[scope.row.status].type|| 'primary'" -->
                                    <el-tag v-if="scope.row.status!==null&&scope.row.status!==undefined" size="small" effect="dark" :type="st[scope.row.status].type">
                                        <!-- {{scope.row.status}} -->
                                        {{ st[scope.row.status].text }}
                                    </el-tag>
                                    <el-tag v-else size="small" effect="dark">
                                        待审核
                                        <!-- {{scope.row.status}} -->
                                        <!-- {{ st[scope.row.status].text }} -->
                                    </el-tag>
                                </template>

                                <template #slot-edit="{ scope }">
                                    <el-button type="text" size="mini" @click="edit(scope.row)">编辑</el-button>
                                </template>
                                <template #slot-detail="{ scope }">
                                    <el-button type="text" size="mini" @click="detail(scope.row)">预览内容</el-button>
                                </template>
                                <template #slot-veri="{ scope }">
                                    <el-button v-if="scope.row.status!==4&&scope.row.status!==10" type="text" size="mini" @click="toAudit(scope.row)" v-permission="$service.zts.article.permission.audit">审核</el-button>
                                </template>
                            </cl-table>
                            <zz-iframe :iframeLink="iframeLink"></zz-iframe>
                        </el-row>

                        <el-row type="flex">
                            <cl-flex1 />
                            <cl-pagination />
                        </el-row>

                    </cl-crud>

                </div>
            </div>
        </div>
        <!-- 
		<el-dialog title="扫码预览" center :visible.sync="preview" :width="'240px'">
			<zz-qrcode :url="shareUrl"></zz-qrcode>
		</el-dialog> -->
        <!-- 审核组件 -->
        <zts-audit tar="blog" :cur="cur" :tt="2" @refresh="refresh"></zts-audit>

    </cl-layout>
</template>

<script>
import { dept, article, commSt } from "@/comm/dict"
import { checkPerm } from "@/cool/permission"
export default {
    data() {
        return {
            // iframeLink: '', // H5显示的内容的链接
            iframeLink: 'https://zts.5618.co/h5/#/pages/planning/article?deptId=&id=63082d66971f250001f891a9', // H5显示的内容的链接
            article,
            articleO: this.zz.toObj(article),
            depts: dept.getLabel(),
            st: commSt,
            type: '',
            status: '',
            expand: this.$store.getters.userInfo.isLeaf,

            preview: false,
            shareUrl: '',

            cur: {},
            ttMap: null
        };
    },
    created() {
        console.log("blog=====list=====created", this.st)
    },
    mounted() {
        console.log("blog=========list======")
        let map = new Map()
        map.set(2, {
            title: '评论',
            path: '/pages/my/social/commentDetails'
        })
        map.set(10, {
            title: '文章',
            path: '/pages/planning/article' // 有无article 然后去跳转  '/pages/my/social/pushDetails'
        })
        map.set(20, {
            title: '兴趣点',
            path: '/pages/planning/poi'
        })
        map.set(40, {
            title: '路线',
            path: '/pages/planning/detail'
        })
        map.set(42, {
            title: '路线',
            path: '/pages/nav/rec/lineDetail'
        })
        map.set(44, {
            title: '兴趣点',
            path: '/pages/planning/poi'
        })
        map.set(70, {
            title: '动态、帖子',
            path: ''
        })
        map.set(100, {
            title: '路线',
            path: '/pages/comm/kml'
        })
        this.ttMap = map
    },
    methods: {

        // 获取tt对应的文字
        getContentTypeText(tt) {
            const obj = this.ttMap.get(Number(tt))
            if (obj) {
                return obj.title
            } else {
                return tt
            }


        },
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
            ctx.service(this.$service.zts.blog).done();
            app.refresh({
                page: 1,
                isoDept: true
            });
        },
        edit(e) {
            if (e && e.userId != this.$store.getters.userInfo._id && (!checkPerm(this.$service.zts.kml.permission.superEdit))) return this.$message.error(`无法更新他人数据！`);
            this.$router.push({
                path: '/pages/zts/article/edit',
                query: { _id: e ? e._id : 0 }
            });
        },

        detail(e) {
            console.log("更新iframe==", e)
            const obj = this.ttMap.get(Number(e.tt))
            // obj.path
            if (e.tt == 2) {  // 当前评论是对 评论的回复
                let v = encodeURI(JSON.stringify({
                    tid: e.tid,  // 内容id，必传
                    commentId: e.pid // 主评论的id
                }))

                console.log('vue 环境变量==============', process.env.NODE_ENV === "development")
                if (process.env.NODE_ENV === "development") {
                    this.iframeLink = `http://localhost:8081/h5/#${obj.path}?v=${v}`
                } else {
                    this.iframeLink = `https://zts.5618.co/h5/#${obj.path}?v=${v}`
                }
            } else {
                if (process.env.NODE_ENV === "development") {
                    this.iframeLink = `http://localhost:8081/h5/#${obj.path}?id=${e.tid}&_id=${e.tid}`
                } else {
                    this.iframeLink = `https://zts.5618.co/h5/#${obj.path}?id=${e.tid}&_id=${e.tid}`
                }
            }
            console.log("更新iframeLink", this.iframeLink)
        },
        toAudit(e) {
            this.cur = {}
            setTimeout(() => { this.cur = e }, 10)
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

// .demo-model {
//     width: 300px;
//     height: 545px;
//     .model-content {
//         width: 100%;
//         height: 100%;

//     }
// }
</style>
