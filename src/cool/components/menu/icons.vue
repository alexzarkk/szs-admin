<template>
	<div class="cl-menu-icons">
		<el-popover ref="iconPopover" placement="bottom-start" trigger="click" popper-class="popper-menu-icon">
			<div class="list">
				<el-button v-for="(item, index) in list" :key="'cl-icon' + index" size="mini" :class="{ 'is-active': item === value }" @click="onSelect(item, 'cl-icon')">
					<icon-svg :name="item" :size="20"></icon-svg>
				</el-button>
				<el-button v-for="(item, index) in cuIconList" :key="'_' + index" size="mini" :class="{ 'is-active': item === value }" @click="onSelect(item, 'zts')">
					<icon-svg :name="item" type="zts" :size="20"></icon-svg>
				</el-button>
			</div>
		</el-popover>

		<el-input v-model="icon" @change="onSelect" v-popover:iconPopover placeholder="请选择"></el-input>
	</div>
</template>

<script>
export default {
	name: 'cl-menu-icons',

	props: {
		value: String
		// iconType:String
	},

	data() {
		return {
			list: [],
			icon: {},
			cuIconList: [
				'bugaoban',
				"product",
				"close",
				"scan",
				"fangxiang",
				"luxian",
				"contract2",
				"jurassic_nav",
				"jurassic_nav1",
				"xianxingfangxiang",
				"zz",
				"zts",
				"huizhishezhi",
				"mylocation",
				"locationdingwei",
				"maplocation",
				"map-location",
				"location",
				"location1",
				"location2",
				"import_location",
				"a-signallocation-line",
				"map",
				"guijitu",
				"locus-full",
				"wuliuguiji",
				"huizhiguiji",
				"zhi",
				"branch",
				"guo",
				"qu",
				"sheng",
				"xian",
				"shi",
				"didian",
				"sanjiao",
				"sanjiao2",
				"dianhua",
				"shuben",
				"xiuxiqu",
				"tingchewei",
				"medalfill",
				"redpacket_fill",
				"calendar",
				"like",
				"notice",
				"peoplelist",
				"selection",
				"upstage",
				"edit",
				"evaluate",
				"SOS",
				"sun",
				"night",
				"search",
				"direction",
				"icon4",
				"sheji",
				"sign",
				"layout",
				"meeting-board",
				"trail-sign-outline",
				"zhangpeng",
				"camping",
				"hubo",
				"yuanlin",
				"zhuzi",
				"fengjing",
				"chaye",
				"mingsheng",
				"xiuxi",
				"w_cunzhuang",
				"w_fengjing",
				"shuiku",
				"21shouye3x",
				"senlin",
				"ancientpaviliong",
				"gushu",
				"qiao",
				"ting",
				"a-ziyuan48",
				"dengshan",
				"targetcircle",
				"signin",
				"tutor2",
				"climbing",
				"tutor",
				"volunteer",
				"runway",
				"hike",
				"bycle",
				"1th",
				"cup",
				"finish",
				"peak",
				"rush",
				"scoreboard",
				"skee",
				"medicpack",
				"org",
				"123_",
				"map2",
				"peak2",
				"route",
				"running",
				"appointment",
				"maploc",
				"taiji",
				"reward",
				"rankstar",
				"123",
				"love",
				"onservice",
				"shoudong",
				"confirm",
				"apps",
				"ticai",
				"idcard",
				"zhengjian",
				"yichayue",
				"yuedu",
				"kaoherenwujihua",
				"richeng",
				"jihua"
			]
		};
	},

	watch: {
		value: {
			immediate: true,
			handler(val) {
				this.icon = val;
			}
		}
	},

	mounted() {
		this.list = [
			'comment',
			'community',
			'order',
			'2bei',
			'vip',
			'trend',
			'cycle',
			'role',
			'schedule',
			'cpu',
			'network',
			'storage',
			'system',
			'menu',
			'user',
			'log',
			'workbench',
			'common',
			'friend',
			'clock',
			'app',
			'safe',
			'hotel',
			'feedback'
		];
	},

	methods: {
		onSelect(icon, type) {
			this.$emit('input', icon); // 提交图标名称
			this.$emit('changeType', type); // 图标类型
		}
	}
};
</script>

<style lang="scss">
.popper-menu-icon {
	box-sizing: border-box;

	.list {
		display: flex;
		flex-wrap: wrap;
		max-height: 250px;
		width: 490px;
		overflow-y: auto;
	}

	.el-button {
		margin-bottom: 10px;
		height: 40px;
		width: 40px;
		padding: 0;

		&:nth-child(10n + 1) {
			margin-left: 0;
		}

		.icon-svg {
			color: #000;
		}
	}
}
</style>
