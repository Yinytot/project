/**
 * 抓取远端API的结构
 * https://developers.douban.com/wiki/?title=movie_v2
 * @param  {String} api    api 根地址
 * @param  {String} path   请求路径
 * @param  {Objece} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */
 //本服务用于把微信发起网络请求的wx.request()原生API封装成封装IE6的Promise请求
 //Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。Object.assign(target, ...sources),target:目标对象。sources:源对象。
 //params指函数调用时，传递过来的所有参数的数组，可以在不同页面传递参数
 module.exports = function(api, path, params) {
 	return new Promise(function(resolve, reject) {
 		wx.request({
 			url:`${api}/${path}`,
 			data: Object.assign({},params),
 			header: { 'content-Type':'json'},
 			success: resolve,
 			fail: reject
 		})
 	})
 }