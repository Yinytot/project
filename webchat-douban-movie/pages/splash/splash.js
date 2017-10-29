//获取全局应用程序实例对象
var app = getApp()
console.log(app.globalData)

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    movies: [],
    loading: true,
    indicatorDots: true
  },

  getCache() {
    return new Promise(resolve => {
      app.wechat.getStorage('last_splash_data')
        .then(res => {
          //有缓存，判断是否过期
          if(res.data.expires < Date.now()) {
            //已经过期
            console.log('storage expired')
            return resolve(null)
          }
          return resolve(res.data)
        })
        .catch(err => resolve(null))
    })
  },

  handleStart () {
    // TODO: 访问历史的问题
    wx.switchTab({
      url: '../board/board'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   * 豆瓣电影获取需要结合豆瓣开发者网站来做：https://developers.douban.com/wiki/?title=movie_v2#search
   */
  onLoad () {
    this.getCache()
      .then(cache => {
        if (cache) {
          return this.setData({ movies: cache.movies, loading: false })
        }
        //第一次进入的时候先执行下面的函数，第二次之后进入小程序才会执行上面的判断是否有缓存的函数
        app.douban.find('coming_soon', 1, 3)
          .then(d => {
            this.setData({ movies: d.subjects, loading: false })
            return app.wechat.setStorage('last_splash_data', {
              movies: d.subjects,
              expires: Date.now() + 1 * 24 * 60 * 60 * 1000
            })
          })
          .then(() => console.log('storage last_splash_data'))
      })
}
})