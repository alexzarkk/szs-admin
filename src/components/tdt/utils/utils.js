/**
 * 生成uuid
 */
export const guid = () => {
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
};

/**
 * 首字母大写
 * @param {String} 字符串
 */
export const capitalize = ([first, ...rest]) => {
  return first.toUpperCase() + rest.join("");
};

/**
 * 过滤掉对象中undefined的属性
 * @param {Object} obj 对象
 */
export const objectFilter = obj => {
  let res = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      res[key] = obj[key];
    }
  });
  return res;
};

export const styles = [
        {
          url: "../../../static/cluster0.png",
          size: [30, 30], //图片大小
          offset: [0, 0], //显示图片的偏移量
          textColor: "#000000", //显示数字的颜色
          textSize: 8, //显示文字的大小
          range: [0, 50] //显示该图标的范围
        },
        {
          url: "../../../static/cluster1.png",
          size: [40, 40],
          offset: [0, 0],
          textColor: "#000000",
          textSize: 10,
          range: [50, 400]
        },
        {
          url: "../../../static/cluster2.png",
          size: [50, 50],
          offset: [0, 0],
          textColor: "#000000",
          textSize: 12,
          range: [400, 500]
        }
      ]