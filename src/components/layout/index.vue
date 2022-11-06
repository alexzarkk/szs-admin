<template>
	<div class="page-layout" :class="{ collapse: menuCollapse }">
		<div class="page-layout__mask" @click="COLLAPSE_MENU(true)"></div>

		<div class="page-layout__left"><app-slider></app-slider></div>

		<div class="page-layout__right">
			<div class="page-layout__topbar"><app-topbar></app-topbar></div>

			<div class="page-layout__process" v-if="app.conf.showProcess"><app-process></app-process></div>

			<div class="page-layout__container">
				<div class="page-layout__view" id="layoutView"><slot></slot></div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import Topbar from './topbar';
import Slider from './slider';
import Process from './process/index.js';

export default {
	components: {
		'app-topbar': Topbar,
		'app-slider': Slider,
		'app-process': Process
	},

	computed: {
		...mapGetters(['menuCollapse', 'app', 'token', 'routes'])
	},

	watch: {
		$route() {
			if (!this.token && this.$route.path != '/pages/login/index') {
				this.$store.dispatch('userRemove');
				uni.redirectTo({
					url: '/pages/login/index'
				});
			}
		}
	},
	data() {
		return {
			resize: null
		};
	},
	mounted() {
		this.$store.commit('COLLAPSE_MENU', false);
		this.resize = () => {
			this.$store.commit('SET_BROWSER');
			let layoutView = document.getElementById('layoutView');
			this.$store.commit('UPDATE_LAY', {
				width: layoutView.clientWidth,
				height: layoutView.clientHeight
			});

			if (document.body.clientWidth < 1000) {
				this.$store.commit('COLLAPSE_MENU', true)
				this.$store.commit('UPDATE_APP', {
					conf: {
						showAMenu: false
					}
				});
			}
		};
		this.resize();
		window.addEventListener('resize', this.resize)
	},
	methods: {
		...mapMutations(['COLLAPSE_MENU'])
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.resize);
	}
};
</script>

<style lang="scss">
.page-layout {
	display: flex;
	height: 100vh;
	width: 100vw;
	overflow: hidden;
	background-color: #f7f7f7;

	&__left {
		background-color: $uni-color-main;
		overflow: hidden;
		height: 100%;
		width: 220px;
		transition: left 0.2s;
	}

	&__right {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: calc(100% - 220px);
	}

	&__topbar {
		margin-bottom: 10px;
	}

	&__process {
		margin-bottom: 10px;
		padding: 0 10px;
	}

	&__container {
		width: 100%;
		box-sizing: border-box;
		flex: 1;
		overflow: hidden;
		// margin-bottom: 4px;
	}

	&__mask {
		position: fixed;
		left: 0;
		top: 0;
		background-color: rgba(0, 0, 0, 0.5);
		height: 100%;
		width: 100%;
		z-index: 999;
	}

	&__view {
		height: 100%;
		width: 100%;
		// border: 1px solid #dcdfe6;
		box-sizing: border-box;
		padding: 6px;
		border-radius: 3px;

		& > div {
			height: 100%;
		}
	}

	&.collapse {
		.page-layout__left {
			width: 64px;
		}

		.page-layout__right {
			width: calc(100% - 64px);
		}
	}

	@media only screen and (max-width: 768px) {
		.page-layout__left {
			position: absolute;
			left: 0;
			z-index: 9999;
			transition: transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1), box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
		}

		.page-layout__right {
			width: 100% !important;
		}

		&.collapse {
			.page-layout__left {
				transform: translateX(-100%);
			}

			.page-layout__mask {
				display: none;
			}
		}
	}

	@media only screen and (min-width: 768px) {
		.page-layout__left,
		.page-layout__right {
			transition: width 0.2s;
		}

		.page-layout__mask {
			display: none;
		}

		&.collapse {
			.page-layout__left {
				width: 64px;
			}

			.page-layout__right {
				width: calc(100% - 64px);
			}
		}
	}
}
</style>
