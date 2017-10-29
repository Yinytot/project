const URL = 'https://api.map.baidu.com'
const fetch = require('./fetch')

function fetchApi (type, params) {
	return fetch(URL, type, params)
}

/**
 * 根据经纬度获取城市
 * @param  {Number} latitude   经度
 * @param  {Number} longitude  纬度
 * @return {Promise}       包含抓取任务的Promise
 */
 //latitude = 39.90403, longitude = 116.407526,给定义了默认参数，如果没有传参就是用默认的参数
 //ak是百度地图秘匙，可以到百度地图API上申请：http://www.cnblogs.com/0201zcr/p/4675028.html
 //params指函数调用时，传递过来的所有参数的数组，可以在不同页面传递参数
 function getCityName (latitude = 39.90403, longitude = 116.407526) {
 	const params = { location: `${latitude},${longitude}`, output:'json', ak:'B61195334f65b9e4d02ae75d24fa2c53'}
 	return fetchApi('geocoder/v2/', params)
 	.then(res => res.data.result.addressComponent.city)
 }

 module.exports = { getCityName }