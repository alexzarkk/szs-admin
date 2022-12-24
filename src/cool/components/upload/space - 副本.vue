<template>
    <div class="cl-upload-space__wrap">
        <slot>
            <el-button v-if="btn" size="mini" @click="open">点击上传</el-button>
        </slot>

        <!-- 弹框 -->
        <cl-dialog :visible.sync="visible" :props="dialogProps">
            <div class="cl-upload-space">
                <!-- 类目 -->
                <div class="cl-upload-space__category">
                    <div class="cl-upload-space__category-search">
                        <el-button type="primary" size="mini" @click="editCategory()">添加分类</el-button>

                        <el-input v-model="category.keyword" placeholder="输入关键字过滤" size="mini"></el-input>
                    </div>

                    <div class="cl-upload-space__category-list">
                        <category-list :list="categoryList" :current="category.current.id" />
                    </div>
                </div>

                <!-- 内容 -->
                <div class="cl-upload-space__content">
                    <!-- 操作栏 -->
                    <div class="cl-upload-space__opbar">
                        <el-button size="mini" @click="refreshFile()">刷新</el-button>

                        <el-button type="success" size="mini" :disabled="selection.length === 0" @click="confirmFile()">使用选中文件</el-button>

                        <el-button type="danger" size="mini" :disabled="selection.length === 0" :loading="file.loading.delete" @click="deleteFile()">删除选中文件</el-button>

                        <el-button type="primary" size="mini" @click="chooseImage" :loading="file.loading.uploadImage">选择图片</el-button>

                        <el-button type="primary" size="mini" @click="chooseVideo" :loading="file.loading.uploadVideo">选择视频</el-button>
                    </div>

                    <!-- 文件区域 -->
                    <div class="cl-upload-space__file" v-loading="file.loading.refresh || file.loading.uploadImage || file.loading.uploadVideo" element-loading-text="拼命加载中">
                        <!-- 文件列表 -->
                        <el-row v-if="file.list.length > 0">
                            <el-col :span="6" v-for="(item, index) in file.list" :key="index">
                                <file-item :value="item"></file-item>
                            </el-col>
                        </el-row>

                        <!-- 空态 -->
                        <div class="cl-upload-space__file-empty" v-else>
                            <div @click="chooseImage">
                                <i class="el-icon-upload"></i>
                                <p>暂无内容,点击上传</p>
                            </div>
                        </div>
                    </div>

                    <!-- 分页 -->
                    <el-pagination background :page-size="file.pagination.size" :page-sizes="[10, 20, 40, 60, 80, 100, 200, 400]" :current-page="file.pagination.page" :total="file.pagination.total" layout="total, sizes, prev, pager, next" @current-change="onCurrentChange" @size-change="handleSizeChange"></el-pagination>
                </div>
            </div>
        </cl-dialog>

        <!-- 右键菜单 -->
        <cl-context-menu ref="context-menu"></cl-context-menu>

        <!-- 添加分类 -->
        <cl-form ref="form-category"></cl-form>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { uploadFile } from "@/cool/utils/upload";
export default {
    componentName: "UploadSpace",

    props: {

        limit: {
            type: Number,
            default: 8
        },
        btn: { type: Boolean, default: true }
    },

    components: {
        categoryList: {
            props: {
                list: Array,
                current: String
            },

            computed: {
                parent() {
                    let parent = this;

                    while (parent.$options.componentName != "UploadSpace") {
                        parent = parent.$parent;
                    }

                    return parent;
                }
            },

            methods: {
                onSelect(item) {
                    this.parent.selectCategory(item);
                },

                onContextMenu(e, item) {
                    this.parent.openCategoryContextMenu(e, item);
                    e.stopPropagation();
                    e.preventDefault();
                }
            },

            render() {
                return (
                    <view class='solid flex flex-direction'>
                        {this.list.map((item) => {
                            return (
                                <view class={{
                                    'margin-left-sm padding-top-xs solid-bottom flex align-center': true,
                                    "bg-blue light": item.id == this.current
                                }}
                                    on-click={() => {
                                        this.onSelect(item);
                                    }}
                                    on-contextmenu={(e) => {
                                        this.onContextMenu(e, item);
                                    }}
                                >
                                    {item.name}
                                </view>
                            )
                        })}
                    </view>
                )
            }
        },

        fileItem: {
            props: {
                value: Object
            },

            computed: {
                parent() {
                    let parent = this;

                    while (parent.$options.componentName != "UploadSpace") {
                        parent = parent.$parent;
                    }

                    return parent;
                }
            },

            methods: {
                onSelect() {
                    this.parent.selectFile(this.value);
                },

                onContextMenu(e) {
                    this.parent.openFileContextMenu(e, this.value);
                    e.stopPropagation();
                    e.preventDefault();
                }
            },

            render() {
                if (!this.value) {
                    return null;
                }

                let itemEl = null;

                const { url, type, selected } = this.value;
                const fileType = (type || "").split("/")[0];
                const fileMask = {}
                switch (fileType) {
                    case "image":
                        itemEl = <el-image fit="cover" src={url} lazy></el-image>;
                        break;

                    case "video":
                        itemEl = (
                            <video
                                controls
                                src={url}
                                style={{
                                    "max-height": "100%",
                                    "max-width": "100%"
                                }}></video>
                        );
                        break;

                    default:
                        itemEl = <span>{url}</span>;
                        break;
                }

                return (
                    <div
                        class={["cl-upload-space__file-item", `is-${fileType}`]}
                        on-click={this.onSelect}
                        on-contextmenu={this.onContextMenu}>
                        {itemEl}
                        <div class="cl-upload-space__file-size"></div>
                        {selected && (
                            // <div class="cl-upload-space__file-mask" style="background-color:red;">
                            <div class="file-mask" style="position: absolute;left: 0;top: 0;height: 100%;width: 100%;height: 160px;width: 160px;background-color: rgba(0, 0, 0, 0.5);display: flex;justify-content: center;align-items: center;">
                                <i class="el-icon-success" style="font-size: 30px;color: #67c23a;"></i>
                            </div>
                        )}
                    </div>
                );
            }
        }
    },

    data() {
        return {
            visible: false,
            dialogProps: {
                fullscreen: false,
                modal: false,
                title: "文件空间",
                props: {
                    "close-on-click-modal": false,
                    width: "1000px"
                }
            },
            category: {
                list: [],
                current: {},
                keyword: ""
            },
            file: {
                list: [],
                pagination: {
                    page: 1,
                    size: 10,
                    total: 0
                },
                loading: {
                    refresh: false,
                    delete: false,
                    uploadImage: false,
                    uploadVideo: false
                }
            }
        };
    },

    computed: {
        ...mapGetters(['8C7D00B_token']),

        categoryList() {
            return this.category.list.filter((e) => e.name.includes(this.category.keyword));
        },
        selection() {
            return this.file.list.filter((e) => e.selected);
        }
    },

    created() {
        this.refreshCategory().then(() => {
            this.category.current = this.category.list[0];
            this.refreshFile();
        });
    },

    methods: {
        open() {
            this.visible = true;
        },

        close() {
            this.visible = false;
        },

        // 选择图片
        chooseImage() {
            uni.chooseImage({
                sizeType: ['compressed'],
                success: (res) => {
                    this.file.loading.uploadImage = true

                    // 批量上传
                    const arr = res.tempFiles.map((e, i) => {
                        return new Promise((resolve, reject) => {
                            uploadFile({
                                filePath: res.tempFilePaths[i],
                                cloudPath: e.name
                            }).then((url) => {
                                this.$service.space.info.add({
                                    url,
                                    type: e.type,
                                    classifyId: this.category.current.id
                                })
                                resolve(url)
                            }).catch((err) => {
                                reject(err)
                            })
                        })
                    })

                    Promise.all(arr).then(() => {
						this.refreshFile()
					}).catch((err) => {
						this.$message.error(err.toString())
					}).done(() => {
						this.file.loading.uploadImage = false
					})
				}
            });
        },

        // 选择视频
        chooseVideo() {
            uni.chooseVideo({
                success: (res) => {
                    this.file.loading.uploadVideo = true;
                    uploadFile({
                        filePath: res.tempFilePath,
                        cloudPath: res.tempFile.name
                    }).then((url) => {
                        this.$service.space.info.add({
                            url,
                            type: res.tempFile.type,
                            classifyId: this.category.current.id
                        }).then(() => {
                            this.refreshFile()
                        })
                    }).catch((err) => {
						this.$message.error(err.toString())
					}).done(() => {
						this.file.loading.uploadVideo = false;
					})
                }
            });
        },

        // 刷新资源文件
        refreshFile(params) {
            this.file.loading.refresh = true
            this.$service.space.info.page({
                ...this.file.pagination,
                ...params,
                classifyId: this.category.current.id
            }).then((res) => {
				this.file.list = res.list
				this.file.pagination = res.pagination;
			}).done(() => {
				this.file.loading.refresh = false;
			});
        },

        // 刷新分类
        refreshCategory() {
            return this.$service.space.type.list().then((res) => {
                res.unshift({
                    name: "全部文件",
                    id: null
                });
                this.category.list = res;
            });
        },

        // 编辑分类
        editCategory(item = {}) {
            this.$refs["form-category"].open({
                props: {
                    title: "添加分类",
                    width: "400px"
                },

                items: [
                    {
                        label: "分类名称",
                        prop: "name",
                        value: item.name,
                        component: {
                            name: "el-input",
                            attrs: {
                                placeholder: "请填写分类名称"
                            }
                        },
                        rules: {
                            required: true,
                            message: "分类名称不能为空"
                        }
                    }
                ],

                on: {
                    submit: (data, { done, close }) => {
                        let next = null;

                        if (!item.id) {
                            next = this.$service.space.type.add(data);
                        } else {
                            next = this.$service.space.type.update({
                                ...data,
                                id: item.id
                            });
                        }

                        next.then(() => {
                            this.refreshCategory();
                            close();
                        }).catch((err) => {
                            this.$message.error(err);
                            done();
                        });
                    }
                }
            });
        },

        // 选择类目
        selectCategory(item) {
            console.log('selectCategory.item', item);
            this.category.current = item;
            this.file.pagination = {
                page: 1,
                size: 12,
                total: 0
            };
            this.refreshFile({
                classifyId: item.id
            });
        },

        // 打开类目列表右键菜单
        openCategoryContextMenu(e, { id, name }) {
            if (!id) {
                return false;
            }

            this.$refs["context-menu"].open(e, {
                list: [
                    {
                        label: "编辑",
                        "suffix-icon": "el-icon-edit",
                        callback: (item, done) => {
                            done();
                            this.editCategory({ id, name });
                        }
                    },
                    {
                        label: "删除",
                        "suffix-icon": "el-icon-delete",
                        callback: (item, done) => {
                            done();

                            this.$confirm(`此操作将删除【${name}】下的文件, 是否继续?`, "提示", {
                                type: "warning"
                            })
                                .then(() => {
                                    this.$service.space.type
                                        .delete({
                                            ids: id
                                        })
                                        .then(() => {
                                            this.$message.success("删除成功");
                                            this.refreshCategory();
                                        })
                                        .catch((err) => {
                                            console.error(err);
                                            this.$message.error(err);
                                        });
                                }).catch(() => { });
                        }
                    }
                ]
            });
        },

        // 打开文件列表右键菜单
        openFileContextMenu(e, data) {
            this.$refs["context-menu"].open(e, {
                list: [
                    {
                        label: data.selected ? "取消选中" : "选中",
                        "suffix-icon": data.selected ? "el-icon-close" : "el-icon-check",
                        callback: (item, done) => {
                            this.selectFile(data);
                            done();
                        }
                    },
                    {
                        label: "删除",
                        "suffix-icon": "el-icon-delete",
                        callback: (item, done) => {
                            this.deleteFile(data);
                            done();
                        }
                    }
                ]
            });
        },

        // 确认选中文件
        confirmFile() {
            const urls = this.selection
                .filter((e, i) => i < this.limit)
                .map((e) => e.url)
                .join(",");

            this.$emit("input", urls);
            this.$emit("confirm", urls);

            this.close();
        },

        // 选择文件
        selectFile(item) {
            this.$set(item, "selected", !item.selected);
        },

        // 删除选中文件
        deleteFile(...selection) {
			
			console.log('deleteFile', selection);
			
            if (_.isEmpty(selection)) {
                selection = this.selection;
            }

            this.$confirm("此操作将删除文件, 是否继续?", "提示", {
                type: "warning"
            }).then(() => {
                    this.file.loading.delete = true;
                    this.$service.space.info.delete({
                        ids: selection.map((e) => e.id).join(",")
                    })
                        .then(() => {
                            this.$message.success("删除成功");
                            this.refreshFile();
                        })
                        .catch((err) => {
                            this.$message.error(err);
                        })
                        .done(() => {
                            this.file.loading.delete = false;
                        });
                })
                .catch(() => { });
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.file.pagination = {
                page: 1,
                size: val
            };
            this.refreshFile({
                page: 1
            });
        },
        // 选择页
        onCurrentChange(i) {
            this.refreshFile({
                page: i
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.file-mask {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    height: 160px;
    width: 160px;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: red !important;

    i {
        font-size: 30px;
        color: #67c23a;
    }
}

.cl-upload-space {
    display: flex;
    height: 560px;

    &__category {
        width: 250px;
        margin-right: 20px;

        &-search {
            display: flex;
            align-items: center;
            margin-bottom: 5px;

            .el-button {
                margin-right: 10px;
            }
        }
    }

    &__content {
        flex: 1;
    }

    &__opbar {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    &__file {
        height: calc(100% - 70px);
        overflow: hidden auto;

        .cl-upload-space__file-item {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 160px;
            width: 160px;
            margin-bottom: 10px;
            cursor: pointer;
            position: relative;
            border-radius: 3px;
            box-sizing: border-box;
            background-color: #f7f7f7;
            // background-color: red;

            // .cl-upload-space__file-mask {
            .file-mask {
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                width: 100%;
                height: 160px;
                width: 160px;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: red !important;

                i {
                    font-size: 30px;
                    color: #67c23a;
                }
            }

            &.is-image {
                img {
                    height: 100%;
                    width: 100%;
                }
            }

            &.is-video {
                video {
                    max-height: 100%;
                    width: 100%;
                }
            }

            .cl-upload-space__file-size {
                position: absolute;
                bottom: 0;
                left: 0;
                background-color: rgba(0, 0, 0, 0.5);
            }
        }

        &-empty {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 100px;

            & > div {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                border: 1px dashed #ccc;
                border-radius: 6px;
                cursor: pointer;
                height: 180px;
                width: 360px;

                i {
                    font-size: 67px;
                    color: #c0c4cc;
                }

                &:hover {
                    border-color: #409eff;
                }
            }
        }
    }
}
</style>
