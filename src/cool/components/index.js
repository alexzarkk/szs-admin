import Vue from "vue";

Vue.component("cl-editor-tinymce", () => import("./editor/tinymce/index.vue"));
Vue.component("cl-pics", () => import("./upload/pics.vue"));
Vue.component("cl-upload", () => import("./upload/index.vue"));
Vue.component("cl-upload-space", () => import("./upload/space.vue"));
Vue.component("cl-avatar", () => import("./avatar/index.vue"));
Vue.component("cl-menu-icons", () => import("./menu/icons.vue"));
Vue.component("cl-menu-tree", () => import("./menu/tree.vue"));
Vue.component("cl-menu-perms", () => import("./menu/perms.vue"));
Vue.component("cl-menu-file-path", () => import("./menu/file-path.vue"));
Vue.component("cl-role-tree", () => import("./role/tree.vue"));
Vue.component("cl-role-select", () => import("./role/select.vue"));

// Vue.component("cl-dept-check", () => import("./dept/check.vue"));
Vue.component("cl-dept-tree", () => import("./dept/tree.vue"));
Vue.component("cl-dept-move", () => import("./dept/move.vue"));
Vue.component("cl-dept-cascader", () => import("./dept/cascader.vue"));

Vue.component("zts-track-chart", () => import("./track/index.vue"));
// Vue.component("zts-direction", () => import("./direction/direction.vue"));


Vue.component("cl-scroll", () => import("./scroll/index.vue"));
Vue.component("cl-context-menu", () => import("./context-menu/index.js"));
Vue.component("icon-svg", () => import("./icon-svg/index.vue"));

Vue.component("tool-tip", () => import("./tool-tip/index.vue"));
Vue.component("zts-audit", () => import("./zts-audit/index.vue"));