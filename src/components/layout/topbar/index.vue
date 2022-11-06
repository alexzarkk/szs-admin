<template>
	<div class="layout-topbar">
		<div class="layout-topbar__collapse" @click="collapse">
			<icon-svg name="menu"></icon-svg>
		</div>

		<!-- 路由导航 -->
		<div class="layout-topbar__route-nav">
			<route-nav />
		</div>

		<!-- 一级菜单 -->
		<div class="layout-topbar__menu">
			<a-menu />
		</div>

		<div class="flex1"></div>

		<!-- 工具栏 -->
		<ul class="layout-topbar__tools"></ul>

		<!-- 用户信息 -->
		<div class="layout-topbar__user" v-if="userInfo">
			<div class="dept" style="cursor: default;">{{ userInfo.dept.name }}</div>
			<el-dropdown trigger="click" :hide-on-click="false" @command="onCommand">
				<span class="el-dropdown-link">
					<span class="name">{{ userInfo.nickName | default_name }}</span>
					<img class="avatar" :src="userInfo.headImg | default_avatar" alt />
				</span>

				<el-dropdown-menu slot="dropdown" class="popper-dropdown-menu-user">
					<el-dropdown-item command="my">个人中心</el-dropdown-item>
					<el-dropdown-item command="exit">退出</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import AMenu from "./menu";
import RouteNav from "./route-nav";

import { clone } from '@/cool/utils';
export default {
	components: {
		AMenu,
		RouteNav
	},
	computed: {
		...mapGetters(["userInfo", "menuCollapse", "lay"])
	},
	methods: {
		...mapMutations(["COLLAPSE_MENU"]),

		onCommand(name) {
			switch (name) {
				case "my":
					this.$router.push("/pages/my/info");
					break;
				case "exit":
					this.$store.dispatch("userLogout").done(() => {
						uni.clearStorageSync();
						uni.redirectTo({
							url: "/pages/login/index"
						})
					});
					break;
			}
		},

		collapse() {
			this.COLLAPSE_MENU(!this.menuCollapse);
			let t = clone(this.lay)
			this.$store.commit("UPDATE_LAY", {width: this.menuCollapse? t.width+160:t.width-160, height: t.height});
		}
	}
};
</script>

<style lang="scss" scoped>
.popper-dropdown-menu-user {
	width: 120px;
}

.layout-topbar {
	display: flex;
	align-items: center;
	height: 50px;
	padding: 0 10px;
	background-color: #fff;

	&__collapse {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 40px;
		width: 40px;
		cursor: pointer;
	}

	.flex1 {
		flex: 1;
	}

	&__tools {
		margin-right: 20px;

		::v-deep li {
			list-style: none;
			height: 45px;
			width: 45px;
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;

			i {
				font-size: 16px;

				&:hover {
					opacity: 0.8;
				}
			}
		}
	}

	&__user {
		
		display: flex;
		align-items: center;
		margin-right: 10px;
		cursor: pointer;
		.dept {
			white-space: nowrap;
			margin-right: 15px;
			font-size: 12px;
		}
		.el-dropdown-link {
			display: flex;
			align-items: center;
		}

		.avatar {
			height: 32px;
			width: 32px;
			border-radius: 32px;
		}

		.name {
			white-space: nowrap;
			margin-right: 15px;
		}

		.el-icon-arrow-down {
			margin-left: 10px;
		}
	}
}
</style>
