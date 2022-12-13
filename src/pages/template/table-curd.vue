<template>
    <cl-layout>
        <div class="system-user">
            <div class="pane">
                <div class="user">
                    <cl-crud ref="crud" @load="onCrudLoad" boder>
                        <el-row type="flex">
                            <cl-table :columns="columns">
                                <!-- 时间 -->
                                <template #column-createTime="{ scope }">
                                    {{ scope.row.updateTime }}
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
                    prop: 'deptId',
                    label: '部门',
                    align: 'center',
                    dict: depts
                },
                {
                    label: '操作',
                    align: 'center',
                    type: 'op',
                    buttons: ['slot-edit', 'slot-detail', 'slot-veri']
                }
            ]
        }
    },
    watch: {},
    mounted() {
    },
    methods: {
    }
};
</script>

<style lang="scss" scoped>
</style>

