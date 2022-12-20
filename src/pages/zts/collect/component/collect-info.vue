<template>
	<div>
		<el-descriptions title="采集信息" direction="vertical" :column="3" border>
			<el-descriptions-item label="采集开始">{{kml.startTime.substring(0,16)}}</el-descriptions-item>
			<el-descriptions-item label="采集结束">{{kml.endTime.substring(0,16)}}</el-descriptions-item>
			<el-descriptions-item label="上传时间">{{kml.createTime.substring(0,16)}}</el-descriptions-item>
			
			<el-descriptions-item label="名称">{{kml.name}}</el-descriptions-item>
			<el-descriptions-item label="路段编号">{{kml.sn}}</el-descriptions-item>
			<el-descriptions-item label="途径地">{{kml.ways}}</el-descriptions-item>
			
			<el-descriptions-item label="部门"><el-tag>{{kml.dept}}</el-tag></el-descriptions-item>
			<el-descriptions-item label="采集员">{{kml.collectorname}}</el-descriptions-item>
			<el-descriptions-item label="手机号">{{kml.collectortel}}</el-descriptions-item>
			<el-descriptions-item label="备注">{{kml.desc}}</el-descriptions-item>
		</el-descriptions>
		<el-descriptions class="margin-top-sm" title="冲突项" border>
			<el-descriptions-item label="项目">
				<block v-if="kml.conflict.length">
					<block v-for="(k, idx) of kml.conflict" :key="idx">
						<el-tag class="margin-xs" size="small" type="warning">{{ getText('conflict',k) }}</el-tag>
					</block>
				</block>
				<block v-else>
					无
				</block>
			</el-descriptions-item>
		</el-descriptions>
		
		<el-descriptions class="margin-top-sm" title="景观元素" border>
			<el-descriptions-item label="内容">
				<block v-if="kml.element.length">
					<block v-for="(k, idx) of kml.element" :key="idx">
						
						<el-tag class="margin-left-xs" size="small" type="success">{{ getText('viewElement',k) }}</el-tag>
					</block>
				</block>
				<block v-else>
					无
				</block>
			</el-descriptions-item>
		</el-descriptions>
		
		<el-descriptions class="margin-top-sm" title="印象评分" :column="2"  border>
			<block v-for="(k, i) of ip" :key="i">
				<el-descriptions-item :label="k.name">
					<el-rate disabled :value="kml.score[i]" :colors="colors"></el-rate>
				</el-descriptions-item>
			</block>
		</el-descriptions>
	</div>
</template>

<script>
import { getText,impression } from "@/cool/utils/dict.js"
export default {
	data() {
		return {
			ip: impression,
			colors: ['#ffaa7f', '#ffa14f', '#ff5500']
		}
	},
	props: {
		kml: {
			type: Object,
			default: ()=>{
				return { list:[] }
			}
		}
	},
	methods: {
		getText(n,v){
			let t = getText(n,v)
			return t.label||t.text
		}
	}
};
</script>