<script>
import componentMixin from '../mixins/component-mixin';
import { toLngLat } from '../utils/converter';

export default {
	name: 'tdt-geojson',
	mixins: [componentMixin],
	props: {
		geojson: { type: Object }
	},

	// props: {
	//   color: { type: String }, //折线颜色。
	//   weight: { type: Number }, //折线的宽度，以像素为单位。
	//   opacity: { type: Number }, //折线的透明度（范围0-1 之间）。
	//   lineStyle: { type: String }, //折线的样式（solid或dashed）。
	//   path: { type: Array }, //坐标数组。
	//   edit: { type: Boolean, default: false }, //是否可编辑
	//   extData: { type: [Object, String, Number], default: undefined } //自定义属性
	// },
	// marker
	// props: {
	//   icon: { type: [Object, String] }, //图标类用来表达注记。默认设置为new L.Icon.Default()。
	//   dragging: { type: Boolean, default: false }, //决定注记是否可被鼠标或触摸拖动。
	//   title: { type: String }, //	默认情况下，注记图片的叠置顺序由纬度自动设置。如果你想将某一注记放置于其他之上可用这个选项，设置一个较大的值即可，比如1000（或是相反地设置一个较大的负值）。
	//   zIndexOffset: { type: Number }, //设置z-index。
	//   opacity: { type: Number }, //设置透明度。
	//   position: { type: Array }, //标点的坐标
	//   edit: { type: Boolean, default: false }, //是否可编辑
	//   extData: { type: [Object, String, Number], default: undefined } //自定义属性
	// },
	data() {
		return {
			qr:{},
		}
	},
	watch: {
		geojson(val) {
			if (val?.length) {
				if (this.$tdtComponent) {
					this.clear();
				}
				this.register();
			}
		}
	},
	methods: {
		initComponent(option) {
			const paths = this.path.map(item => toLngLat(item));
			this.$tdtComponent = new T.Polyline(paths, option);

			this.$tdtComponent = new T.Marker(toLngLat(this.position), option);
		}
	}
};
</script>
