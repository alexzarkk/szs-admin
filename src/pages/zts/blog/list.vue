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
                            <!-- <el-button size="mini" type="primary" @click="edit(false)">新增</el-button> -->
                            <cl-multi-delete-btn />
                            <cl-flex1 />
                            <cl-filter label="状态">
                            	<el-select size="mini" v-model="status" @change="refresh()">
                            		<el-option :value="0" label="全部"></el-option>
                            		<block v-for="(t, idx) in $store.getters.dictObj.commSt" :key="idx">
                            			<el-option :value="t.value" :label="t.label"></el-option>
                            		</block>
                            	</el-select>
                            </cl-filter>
                            <cl-search-key />
                        </el-row>

                        <el-row type="flex">
                            <cl-table :props="{
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
											label: '用户',
											align: 'center'
										},
										{
											prop: 'content',
											label: '内容',
											align: 'center'
										},
										{
											prop: 'tt',
											label: '对象',
											align: 'center',
											dict: $store.getters.dict.ue.tt
										},
										{
											prop: 'createTime',
											label: '创建时间',
											align: 'center',
											sortable: 'custom'
										},
										{
											prop: 'status',
											label: '状态',
											align: 'center',
											dict: $store.getters.dict.commSt
										},
										{
											label: '操作',
											align: 'center',
											type: 'op',
											buttons: ['slot-btn']
										}
									]">
                                <!-- 时间 -->
                                <template #column-createTime="{ scope }">
                                    {{ scope.row.createTime.substring(0, 16) }}
                                </template>
								<template #column-user="{ scope }">
									{{ scope.row.userInfo.name || scope.row.userInfo.nickName }}
								</template>
								<template #slot-btn="{ scope }">
									<block v-if="scope.row.status>0&&scope.row.status<10">
										<el-button v-if="scope.row.status<6" type="text" size="mini" @click="edit(scope.row)">编辑</el-button>
										<el-button type="text" size="mini" v-if="scope.row.status<6" @click="toSubmit(scope.row,6)">递交审核</el-button>
										<el-button type="text" size="mini" v-else @click="toSubmit(scope.row,4)">撤回审核</el-button>
										<el-button type="text" size="mini" v-if="scope.row.status==6" @click="toAudit(scope.row)" 
											v-permission="$service.zts.kml.permission.verify">审核</el-button>
									</block>
									<el-button type="text" size="mini" @click="preview(scope.row)">预览</el-button>
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

		<zts-audit :tt="'blog'" :cur="cur" @refresh="refresh()"></zts-audit>

    </cl-layout>
</template>

<script>

export default {
    data() {
        return {
            status: '',  // 文章审核状态筛选
            cur: {}  // 当前正在审核的部分
        };
    },
    mounted() { },
    methods: {
        refresh() {
            this.$refs['crud'].refresh({
                page: 1,
                dpids: this.dpids,
                type: this.type,
                status: this.status
            })
        },
        onCrudLoad({ ctx, app }) {
            ctx.service(this.$service.zts.blog).done()
            app.refresh({
                pc: 1,
                page: 1,
                isoDept: true
            })
        },
		async edit(e) {
			if(await this.$store.dispatch('hasPerm', {obj: e, perms: [this.$service.zts.kml.permission.superEdit]})) {
				uni.setStorageSync('article_edit', e?e._id:0)
				this.$router.push('/pages/zts/article/edit')
			}
		},
		async toSubmit(e,status){
			if(await this.$store.dispatch('hasPerm', {obj:e})) {
				let load = this.$loading()
				await this.$service.zts.blog.update({ _id: e._id, status })
				load.close()
				this.refresh()
			}
		},
        preview(e) {
			console.log(e);
			this.zz.preview(e.preview)
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