<template>
	<div class="app-topbar-menu" v-if="app.conf.showAMenu">
		<el-menu :default-active="index" mode="horizontal" @select="onSelect">
			<el-menu-item v-for="(item, index) in menuGroup" :index="`${index}`" :key="index">
				<icon-svg :name="item.icon" :type="item.iconType"></icon-svg>
				<span>{{ item.name }}</span>
			</el-menu-item>
		</el-menu>
	</div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import { firstMenu } from "@/cool/utils";

export default {
	data() {
		return {
			index: "0"
		};
	},

	computed: {
		...mapGetters(["menuGroup", "app"])
	},

	mounted() {
		this.menuGroup.forEach((e, i) => {
			if (this.$route.path.includes(e.path) && e.path != "/") {
				this.index = String(i);
				this.SET_MENU_LIST(i);
			}
		});
		
		// console.log("获取到的左边的侧边栏",this.menuGroup)
		// menuGroup
		
	},

	methods: {
		...mapMutations(["SET_MENU_LIST"]),

		onSelect(index) {
			this.SET_MENU_LIST(index);

			const url = firstMenu(this.menuGroup[index].children);
			this.$router.push(url);
		}
	}
};
</script>

<style lang="scss" scoped>
.app-topbar-menu {
	::v-deep .el-menu {
		height: 50px;
		background: transparent;
		border-bottom: 0;
		overflow: hidden;

		.el-menu-item {
			height: 50px;
			display: flex;
			align-items: center;
			background: transparent;
			border-bottom: 0;
			padding: 0 30px;

			span {
				font-size: 12px;
				margin-left: 3px;
				line-height: normal;
			}

			&.is-active {
				background: rgba(255, 255, 255, 0.13);
			}

			::v-deep .icon-svg {
				height: 18px;
				width: 18px;
				margin-right: 5px;
			}
		}
	}
}
</style>
