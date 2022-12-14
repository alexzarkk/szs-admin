<template>
    <!-- 首页 - 轮播图管理 -->
    <!-- 
        当前部门 + 




     -->
    <cl-layout>
        <!-- @load="onCrudLoad" -->
        <cl-crud ref="crud" boder @load="onCrudLoad">
            <el-row type="flex">
                <cl-refresh-btn />
                <cl-add-btn></cl-add-btn>
                <!-- <el-button size="mini" type="primary">新增</el-button> -->
                <cl-multi-delete-btn />
            </el-row>
            <el-row type="flex">
                <cl-table :columns="columns">
                    <!-- 时间 -->
                    <template #column-isShow="{ scope }">
                        {{ scope.row.isShow?'显示':'不显示' }}
                    </template>
                </cl-table>
            </el-row>

            <el-row type="flex">
                <cl-flex1 />
                <cl-pagination />
            </el-row>
            <!-- 轮播图编辑表单 -->
            <cl-upsert ref="upsert" v-bind="upsert.props" :items="upsert.items"></cl-upsert>
        </cl-crud>
    </cl-layout>
</template>

<script>

import { paramsService } from './paramsHelp'

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
                    prop: 'id',
                    label: '编号',
                    align: 'center'
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
                    prop: 'isShow',
                    label: '是否加入轮播图展示',
                    align: 'center'
                },
                {
                    prop: 'cover',
                    label: '封面图/展示的图片',
                    align: 'center'
                },
                {
                    prop: 'pagePath',
                    label: '目标类型',  // 文章  /  专题 / 赛事  / 活动
                    align: 'center'
                },
                {
                    prop: 'pageParams',
                    label: '指定编号',
                    align: 'center'
                },
                {
                    label: '操作',
                    align: 'center',
                    type: 'op',
                    buttons: ['edit']
                }
            ],
            upsert: {
                props: {
                    props: {
                        width: "1000px",
                        // "label-position": "top",
                        "label-width": "15em"
                    },
                    onOpen: (isEdit, data, { done, submit, close }) => {
                        console.log("cl-upsert 打开钩子", isEdit, data);
                        this.$refs["upsert"].setProps("props", {
                            disabled: isEdit
                        });
                    },

                    onClose(done) {
                        console.log("cl-upsert 关闭钩子");
                        done();
                    },

                    onInfo(data, { next, done, close }) {
                        console.log("cl-upsert 详情钩子", data);
                        next(data);
                    },

                    onSubmit(isEdit, data, { next, close, done }) {
                        console.log("cl-upsert 提交钩子", `是否编辑 ${isEdit}`, data);
                        next(data);
                    },
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
                            // required: true
                        }
                    },
                    {
                        prop: "coverUrl",
                        label: "封面图地址",
                        span: 24,
                        component: {
                            name: "el-input"
                        },
                        rules: {
                            // required: true
                        }
                    },
                    {
                        label: "轮播图类型",
                        prop: "pagePath",
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
                        prop: "pageParams",
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
        onCrudLoad({ ctx, app }) {
            ctx.service(paramsService)
                .permission(() => {
                    return {
                        add: true,
                        update: true,
                        delete: true
                    };
                })
                .done();
            app.refresh({ size: 5 });
        }
    }
};
</script>

<style lang="scss" scoped>
</style>

