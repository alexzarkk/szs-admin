<template>
	<div class="sales-rank">
		<div class="sales-rank__header">
			<span>门店销售额排名</span>
		</div>

		<div class="sales-rank__container">
			<div class="sales-rank__filter">
				<ul>
					<li
						v-for="(item, index) in options.date"
						:key="index"
						:class="{
							active: item.value == selects.date
						}"
						@click="changeDate(item)"
					>
						{{ item.label }}
					</li>
				</ul>

				<el-date-picker
					v-model="selects.date"
					type="datetimerange"
					size="mini"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
				>
				</el-date-picker>
			</div>

			<ul class="sales-rank__list">
				<li>
					<span>1</span>
					<span>北京市朝阳区三里屯路</span>
					<span>323201</span>
				</li>
				<li>
					<span>2</span>
					<span>北京市朝阳区建国路-华贸购物中心</span>
					<span>278442</span>
				</li>
				<li>
					<span>3</span>
					<span>北京市朝阳区朝阳北路</span>
					<span>202368</span>
				</li>
				<li>
					<span>4</span>
					<span>北京市东城区王府井大街</span>
					<span>156320</span>
				</li>
				<li>
					<span>5</span>
					<span>北京市西城区西单北大街-大悦城</span>
					<span>98852</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			selects: {
				date: "day"
			},
			options: {
				date: [
					{
						label: "今日",
						value: "day"
					},
					{
						label: "本周",
						value: "week"
					},
					{
						label: "本月",
						value: "month"
					},
					{
						label: "全年",
						value: "year"
					}
				]
			}
		};
	},

	methods: {
		changeDate(item) {
			this.selects.date = item.value;
		}
	}
};
</script>

<style lang="scss" scoped>
@import "@/static/css/common.scss";

.sales-rank {
	&__header {
		display: flex;
		align-items: center;
		height: 50px;
		font-size: 15px;
		font-weight: bold;
		color: $uni-color-main;
		padding: 0 20px;
	}

	&__container {
		padding: 0 20px;
	}

	&__filter {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 40px;

		ul {
			display: flex;
			flex: 1;
			margin-right: 10px;

			li {
				list-style: none;
				font-size: 14px;
				flex: 1;
				cursor: pointer;
				color: #d8d8d8;

				&.active {
					color: $uni-color-main;
				}

				&:not(.active):hover {
					color: #999;
				}
			}
		}
	}

	&__list {
		height: 260px;

		li {
			display: flex;
			align-items: center;
			height: 52px;
			list-style: none;
			font-size: 13px;
			cursor: pointer;

			span {
				&:first-child {
					display: inline-block;
					height: 14px;
					width: 14px;
					border-radius: 14px;
					text-align: center;
					line-height: 14px;
					font-size: 12px;
				}

				&:nth-child(2) {
					flex: 1;
					margin: 0 10px;
					letter-spacing: 0.5px;
					color: #222;
					@include text_ellipsis();
				}
			}

			&:nth-last-child(n + 3) {
				span {
					&:first-child {
						background-color: $uni-color-main;
						color: #fff;
					}
				}
			}

			&:hover {
				span:nth-child(2) {
					text-decoration: underline;
				}
			}
		}
	}
}
</style>
