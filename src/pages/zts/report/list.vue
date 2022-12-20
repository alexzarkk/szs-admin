<template>
	<div>
		<view class="flex justify-between padding-bottom-xs">
			<el-select v-model="grade" clearable size="mini" @change="doFilter">
				<block v-for="(g, i) of kmlGrade" :key="i">
					<el-option :label="g.label" :value="g.value"></el-option>
				</block>
			</el-select>

			<el-button :loading="epxorting" size="mini" type="primary" icon="el-icon-download" @click="download">导出 Excel</el-button>
		</view>

		<el-table v-loading="loading" :data="listed" border fit highlight-current-row style="width: 100%;" @sort-change="sortChange">
			<!-- <el-table-column label="编号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')"> -->
			<el-table-column label="编号" align="center" min-width="40px">
				<template slot-scope="{ row }">
					<span>{{ row.sn }}</span>
				</template>
			</el-table-column>
			<el-table-column label="类型" align="center">
				<template slot-scope="{ row }">
					<!-- <span>{{ gradename(row.grade) }}</span> -->
					<block v-for="(g, i) of kmlGrade" :key="i">
						<el-tag v-if="g.value==row.grade" :type="g.type" size="mini">{{g.label}}</el-tag>
					</block>
					
				</template>
			</el-table-column>
			<el-table-column label="属地" align="center" min-width="60px">
				<template slot-scope="{ row }">
					
					<span>{{ deptname(row.deptId) }}</span>
				</template>
			</el-table-column>
			<el-table-column label="名称" min-width="120px">
				<template slot-scope="{ row }">
					{{ row.name }}
				</template>
			</el-table-column>
			<el-table-column label="采集时间" align="center">
				<template slot-scope="{ row }">
					<span>{{ row.createTime.substring(0,16)}}</span>
				</template>
			</el-table-column>
			<el-table-column label="轨迹数" align="center">
				<template slot-scope="{ row }">
					<span>{{ row.line.num }}</span>
				</template>
			</el-table-column>
			<el-table-column label="长度(km)" align="center">
				<template slot-scope="{ row }">
					<span>{{ row.line.len /1000 }}</span>
				</template>
			</el-table-column>
			
			<el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
				<template slot-scope="{ row, $index }">
					<el-button plain type="primary" size="mini" @click="detail(row.id)">详情</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="page"
			:page-sizes="[10, 20, 40, 100, 200]"
			:page-size="pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="total"
		></el-pagination>
	</div>
</template>

<script>
import { kmlGrade, clone } from '@/cool/utils/dict.js';
import { getLable } from '@/config/dict.js';


export default {
	data() {
		return {
			kmlGrade: clone(kmlGrade),
			grade: 0,
			list:[],
			listed: [],
			page: 1,
			pageSize:10,
			total: 0,
			
			
			

			sn: 0,
			curId: -1,
			tOption: [],
			filterOption: [],

			loading: false,
			
			epxorting: false

		};
	},
	props: {
		data: { type: Array }
	},
	mounted() {
		this.kmlGrade.unshift({ label: '全部', value: 0 });
		this.doFilter()
	},
	methods: {
		doFilter(e){
			if(e) {
				let arr = []
				for (let s of this.data) {
					if(s.grade==e) arr.push(s)
				}
				this.list = arr
			}else {
				this.list = clone(this.data)
			}
			this.total = this.list.length
			this.pageCur()
		},
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
			this.pageSize = val
			this.pageCur()
		},
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`);
			this.page = val
			this.pageCur()
		},
		pageCur() {
			let arr = []
			for (var i = (this.page-1) * this.pageSize; i < this.page*this.pageSize && i<this.total; i++) {
				arr.push(this.list[i])
			}
			this.listed = arr
			console.log(this.listed);
		},

		
		deptname(e) {return getLable(e)},
		gradename(e) {
			for (let s of this.kmlGrade) {
				if(s.value == e) return s.label
			}
		},
		
		detail(id) {
			uni.setStorageSync('collect_check', id)
			this.$router.push('/pages/zts/map/map')
		},
		
		sortChange(data) {
			const { prop, order } = data;
			if (prop === 'id') {
				this.sortByID(order);
			}
		},
		getSortClass: function(key) {
			const sort = this.listQuery.sort;
			return sort === `+${key}` ? 'ascending' : 'descending';
		},
		
		
		download: async function() {
			this.epxorting = true;
			let tHeader = ['属地','等级','编号','名称','采集员','采集时间','轨迹数','长度'];
			let filterVal = ['deptId','grade','sn','name','collector','createTime','lineNum','lineLen'];
			
			// import('@/cool/utils/ExportExcel').then(excel => {
			// 	let data = this.formatJson(this.list, filterVal);
			// 	excel.export_json_to_excel({
			// 		header: tHeader,
			// 		data,
			// 		filename: '数据采集详情'
			// 	});
			// 	this.epxorting = false;
			// });
		},
		formatJson(list, filterVal) {
			return list.map(v =>
				filterVal.map(j => {
					if (j == 'deptId') return getLable(v[j])
					if (j == 'grade') return this.gradename(v[j])
					if (j == 'lineNum') return v.line.num
					if (j == 'lineLen') return v.line.len
					return v[j]
				})
			);
		}
	}
};
</script>
