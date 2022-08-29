
const time2Date = (time, fmt, utc = 0) => {
		if (!time) time = Date.now() + 1000 * 60 * 60 * utc
		if (typeof time == 'string') time = date2Time(time)
		let n = new Date()
		n.setTime(time)

		let y = n.getFullYear(),
			m = n.getMonth() + 1,
			d = n.getDate(),
			hh = n.getHours(),
			mm = n.getMinutes(),
			ss = n.getSeconds();

		m = m < 10 ? '0' + m : m;
		d = d < 10 ? '0' + d : d;
		hh = hh < 10 ? '0' + hh : hh;
		mm = mm < 10 ? '0' + mm : mm;
		ss = ss < 10 ? '0' + ss : ss;

		if (!fmt) return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
		if (fmt == 'Y-M-D h:m') return y + '-' + m + '-' + d + ' ' + hh + ':' + mm;
		if (fmt == 'Y-M-D h:m:s') return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
		if (fmt == 'M-D h:m') return m + '-' + d + ' ' + hh + ':' + mm;
		if (fmt == 'Y-M-D') return y + '-' + m + '-' + d;
		if (fmt == 'YMD') return y + '' + m + '' + d;
		if (fmt == 'YM') return y + '' + m;
		if (fmt == 'Y') return y;
		if (fmt == 'M') return m;
		if (fmt == 'D') return d;
		if (fmt == 'h:m') return hh + ':' + mm;
		if (fmt == 'h') return hh;
		if (fmt == 'm') return mm
		if (fmt === 'obj') {
			return {
				year: y,
				month: m,
				day: d,
				time: `${hh}:${mm}:${ss}`
			}
		}
		if (fmt == 'CN-ymd') {
			return y + '年' + m + '月' + d + '日'
		}

		if (fmt == 'CN') return y + '年' + m + '月' + d + '日' + ' ' + hh + ':' + mm + ':' + ss + ' ' +
			'星期' + ['日', '一', '二', '三', '四', '五', '六'][n.getDay()];

		return n.getTime()
	}

console.log(time2Date(1661431620000));

console.log(Number.MAX_SAFE_INTEGER);
console.log(Number.MAX_VALUE);