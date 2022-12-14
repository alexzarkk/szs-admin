<template>
    <!-- 首页 - 宫格管理 -->
    <cl-layout>
        <div class="system-user">
            <div class="pane">
                <div class="user">
                    <cl-crud ref="crud" @load="onCrudLoad" boder>
                        <el-row type="flex">
                            <cl-refresh-btn />
                            <cl-add-btn></cl-add-btn>
                            <cl-multi-delete-btn />
                        </el-row>
                        <el-row type="flex">
                            <cl-table :columns="columns">
                            </cl-table>
                        </el-row>
                        <el-row type="flex">
                            <cl-flex1 />
                            <cl-pagination />
                        </el-row>
                        <!-- 轮播图编辑表单 -->
                        <cl-upsert ref="upsert" v-bind="upsert.props" :items="upsert.items" :on-submit="onUpsertSubmit" @open="onUpsertOpen"></cl-upsert>
                    </cl-crud>
                </div>
            </div>
        </div>
    </cl-layout>
</template>

<script>

export default {
    data() {
        return {
            columns: [
                {
                    type: 'selection',
                    align: 'center',
                    width: '60'
                },
                {
                    prop: 'title',
                    label: '标题',
                    align: 'center'
                },
                {
                    prop: 'remark',
                    label: '备注',
                    align: 'center'
                },
                {
                    prop: 'remark',
                    label: '是否加入轮播图展示',
                    align: 'center'
                },
                {
                    prop: 'cover',
                    label: '封面图/展示的图片',
                    align: 'center'
                },
                {
                    prop: 'cover',
                    label: '目标类型',  // 文章  /  专题 / 赛事  / 活动
                    align: 'center'
                },
                {
                    prop: 'cover',
                    label: '指定编号',
                    align: 'center'
                },
                {
                    label: '操作',
                    align: 'center',
                    type: 'op',
                    buttons: ['']
                }
            ],
            upsert: {
                props: {
                    props: {
                        width: "1000px",
                        // "label-position": "top",
                        "label-width": "15em"
                    }
                },
                items: [
                    {
                        prop: "title",
                        label: "标题",
                        span: 24,
                        component: {
                            name: "el-input",
                            attrs: {
                                placeholder: "请输入轮播图标题"
                            }
                        }
                    },
                    {
                        prop: "remark",
                        label: "备注",
                        span: 24,
                        component: {
                            name: "el-input"
                        }
                    },
                    {
                        prop: "isShow",
                        label: "是否加入轮播图展示",
                        span: 24,
                        component: {
                            name: "el-switch"
                        }
                    },
                    {
                        prop: "cover",
                        label: "封面图",
                        span: 24,
                        component: {
                            name: "cl-upload"
                        },
                        rules: {
                            required: true
                        }
                    },
                    {
                        label: "轮播图类型",
                        prop: "type",
                        component: {
                            name: "el-select",
                            options: [
                                {
                                    label: "专题",
                                    value: 1
                                },
                                {
                                    label: "文章",
                                    value: 2
                                },
                                {
                                    label: "活动",
                                    value: 3
                                }
                            ]
                        }
                    },
                    {
                        label: "传递编号",
                        prop: "contentId",
                        component: {
                            name: "el-input"
                        }
                    }
                ]
            }
        }
    },
    watch: {},
    mounted() {
    },
    methods: {
        onUpsertOpen() {

        },
        onUpsertSubmit() {

        }
    }
};
</script>

<style lang="scss" scoped>
</style>

