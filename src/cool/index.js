import Vue from "vue";

import { PermissionDirective, checkPerm } from "./permission";
import { Service, Permission } from "./decorator/service";
import { BaseService } from "./request/service";
import { LoadService } from "./request";
import * as utils from "./utils";

import "./common";
import "./components";
import "./directive/clipboard";
// import "./icons/iconfont.scss";
// import "./icons/cuIcon.scss";

Vue.use(PermissionDirective);

export { Service, Permission, BaseService, LoadService, checkPerm, utils };
