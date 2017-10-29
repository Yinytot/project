//获取全局应用程序实例对象
var app = getApp()
console.log(app.globalData)

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   * 豆瓣开发文档：https://developers.douban.com/wiki/?title=movie_v2#in_theaters
   * 正在上映 Resources URI:"/v2/movie/in_theaters"
   * 即将上映 Resources URI:"/v2/movie/coming_soon"
   * 新片榜 Resources URI:"/v2/movie/new_movies"
   */
  data: {
    boards: [
      { key: 'in_theaters' },
      { key: 'coming_soon' },
      { key: 'top250' },
      // { key: 'weekly' },
      // { key: 'new_movies' },
      // { key: 'us_box', name: '北美票房榜' }
    ],
    loading: true,
    autoplay: true,
    iterval: 2000,
    indicatorDots: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    const promises = this.data.boards.map(board => {
      return app.douban.find(board.key, 1, 10)
      .then(d => {
        board.title = d.title
        board.movies = d.subjects
        return board
      })
    })
    //Promise.all 是当所有给定的可迭代完成时执行 resolve，或者任何  promises 失败时执行 reject
    Promise.all(promises).then(boards => this.setData({ boards: boards, loading: false}))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    // TODO: onReady
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    // TODO: onShow
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    // TODO: onHide
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
    // TODO: onUnload
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // TODO: onPullDownRefresh
  }
})