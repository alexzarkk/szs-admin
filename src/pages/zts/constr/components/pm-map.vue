<template>
	<div class="minimap flex flex-direction justify-center margin-xs">
		<!-- <text>{{pm.name}}</text> -->
		<tdt-map :center="pm.coord" :mid="guid()" :zoom="16.5" :controls="[]">
			<tdt-marker :position="pm.coord"></tdt-marker>
			<tdt-polyline :path="line.coord" :weight="2" :color="'#00ff00'" :opacity="0.8" :extData="line"></tdt-polyline>
		</tdt-map>
		<text>{{addr}}</text>
	</div>
</template>

<script>

export default {
	props: {
		pm: { type: Object },
		line: { type: Object },
	},
	data() {
		return {
			loading: true,
			addr:'...'
		}
	},
	mounted(){
		uni.request({
			url:'https://api.tianditu.gov.cn/geocoder?postStr='+JSON.stringify({lon:this.pm.coord[0],lat:this.pm.coord[1],ver:1})+'&type=geocode&tk=70ede380913047ef13bc4dc92ff4f75b'
		}).then(tdt=>{
			this.addr = tdt[1].data.result.formatted_address
		})
	},
	methods: {
		guid(){
		  let s = [];
		  let hexDigits = "0123456789abcdef";
		  for (var i = 0; i < 36; i++) {
		    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		  }
		  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
		  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
		  s[8] = s[13] = s[18] = s[23] = "-";
		
		  var uuid = s.join("");
		  return uuid;
		}
		
	}
};
</script>

<style lang="scss" scoped>
.minimap{
	justify-content: center;
	align-items: center;
	width: 280px;
	height: 20px;
}
</style>
