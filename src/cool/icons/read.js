var fs = require('fs')
var path = require('path');

var filePath = path.resolve('./cuIcon.scss');

fs.readFile("./cuIcon.scss", "utf-8", function(error, data) {
	// console.log(error);  //如果err为null就说明读取成功了,没有出错
	// console.log(data); // 如果不给第二个参数[读取的文件编码格式]就会以beffer格式输出

	//  用error来判断文件是否读取成功
	if (error) return console.log("读取文件失败,内容是" + error.message);
	// console.log("读取文件成功,内容是" + data);
	let starr = data.split('zts-')
	for (let s of starr) {
		let _ = s.split(':before')[0]
		console.log('"' + _ + '",')
	}
});


let mm = [0,2,1,4,5,6,10,20,30,40,50]

for (let s of mm) {
	console.log((s%10) + '",' +s)
}