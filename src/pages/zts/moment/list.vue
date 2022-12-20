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
                            <cl-refresh-btn />
                            <el-button size="mini" type="primary" @click="edit(false)">新增</el-button>
                            <cl-multi-delete-btn />
                            <cl-flex1 />
                            <cl-filter label="状态">
                                <el-select size="mini" v-model="status" @change="refresh()">
                                    <el-option value="" label="全部"></el-option>
                                    <el-option :value="1" label="草稿"></el-option>
                                    <el-option :value="2" label="待审核"></el-option>
                                    <el-option :value="10" label="已审核"></el-option>
                                </el-select>
                            </cl-filter>
                            <cl-filter label="类型">
                                <el-select size="mini" v-model="type" @change="refresh()">
                                    <el-option :value="0" label="全部"></el-option>
                                    <block v-for="(t, index) in article" :key="index">
                                        <el-option :value="t.value" :label="t.label"></el-option>
                                    </block>
                                </el-select>
                            </cl-filter>
                            <cl-search-key />
                        </el-row>

                        <el-row>
                            <cl-table :contextMenu="[]" :props="{
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
											prop: 'user',
											label: '作者/来源',
											align: 'center'
										},
										{
											prop: 'content',
											label: '内容',
											align: 'center'
										},
										{
											prop: 'imgs',
											label: '照片',
											align: 'center'
										},
										{
											prop: 'type',
											label: '分类',
											align: 'center'
										},
										
										{
											prop: 'status',
											label: '状态',
											align: 'center'
										},
										{
											prop: 'createTime',
											label: '创建时间',
											align: 'center',
											sortable: 'custom'
										},
										{
											label: '操作',
											align: 'center',
											type: 'op',
											buttons: ['slot-edit', 'slot-detail', 'slot-veri']
										}
									]">
                                <!-- 时间 -->
                                <template #column-createTime="{ scope }">
                                    {{ scope.row.updateTime }}
                                </template>
                                <template #column-user="{ scope }">
                                    <view class="flex align-center justify-center">
                                        <el-image style="width: 30px; height: 30px" fit="cover" :src="scope.row.userInfo.headImg" :preview-src-list="[scope.row.userInfo.headImg]" />
                                        <text class="margin-left-xs">{{ scope.row.userInfo.name }}</text>
                                    </view>
                                </template>
                                <template #column-type="{ scope }">
                                    <block v-for="(i, idx) of scope.row.type" :key="idx">
                                        <el-tag size="mini" style="margin-left: 4px;" :class="'bg-'+articleO[i].color" effect="plain">
                                            {{ articleO[i].label }}
                                        </el-tag>
                                    </block>
                                </template>

                                <template #column-imgs="{ scope }">
                                    <template v-if="scope.row.imgs.length">
                                        <block v-for="(i, idx) of scope.row.imgs" :key="idx">
                                            <el-image style="width: 60px; height: 60px" fit="cover" :src="i" :preview-src-list="scope.row.imgs" />
                                        </block>
                                    </template>
                                </template>
                                <template #column-status="{ scope }">
                                    <el-tag size="small" effect="dark" :type="st[scope.row.status].type">
                                        {{ st[scope.row.status].text }}
                                    </el-tag>
                                </template>

                                <template #slot-edit="{ scope }">
                                    <el-button type="text" size="mini" @click="edit(scope.row)">编辑</el-button>
                                </template>
                                <template #slot-detail="{ scope }">
                                    <el-button type="text" size="mini" @click="detail(scope.row)">预览</el-button>
                                </template>
                                <template #slot-veri="{ scope }">
                                    <el-button v-if="scope.row.status!==4&&scope.row.status!==10" type="text" size="mini" @click="toAudit(scope.row)" v-permission="$service.zts.article.permission.audit">审核</el-button>
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

        <!-- <el-dialog title="扫码预览" center :visible.sync="preview" :width="'240px'">
            <zz-qrcode :url="shareUrl"></zz-qrcode>
        </el-dialog> -->

        <zts-audit :tt="10" :cur="cur" @refresh="refresh()"></zts-audit>

    </cl-layout>
</template>

<script>
import { dept, article, commSt } from "@/comm/dict"
import { checkPerm } from "@/cool/permission"

export default {
    data() {
        return {
            article,
            articleO: this.zz.toObj(article),
            depts: dept.getLabel(),
            st: commSt,
            type: '',
            status: '',
            expand: this.$store.getters.userInfo.isLeaf,

            preview: false,
            shareUrl: '',

            cur: {}
        };
    },
    mounted() { },
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
                dpids: this.dpids,
                type: this.type,
                status: this.status

            });
        },
        onCrudLoad({ ctx, app }) {
            ctx.service(this.$service.zts.article).done();
            app.refresh({
                ui: 1,
                app: 1,
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

        // detail(e) {
        // 	console.log(e);
        //     this.preview = true
        //     this.shareUrl = 'path=/pages/planning/article&id=' + e._id
        // },
        detail(e) {
            this.zz.openWin({
                url: 'https://' + (this.zz.isDev ? 'test' : 'zts') + '.5618.co/h5/#/pages/share?path=/pages/my/social/pushDetails&id=' + e._id,
                w: 380,
                h: 780
            })
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
</style>
