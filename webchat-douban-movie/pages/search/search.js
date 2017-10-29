// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    size: 20,
    subtitle: '请在此输入搜索内容',
    movies: [],
    search: '',
    loading: false,
    hasMore: false
  },

  loadMore () {
    if (!this.data.hasMore) return

    this.setData({ subtitle: '加载中...', loading: true })
    // search是豆瓣开发文档中获取列表类型的数据（电影搜索类型），跟coming_soon一样
    return app.douban.find('search', this.data.page++, this.data.size, this.data.search)
      .then(d => {
        if (d.subjects.length) {
          // d.title是你自己输入的搜索内容，concat()方法用于连接两个或多个数组。 该方法不会改变现有的数组,而仅仅会返回被连接数组的一个副本
          this.setData({ subtitle: d.title, movies: this.data.movies.concat(d.subjects), loading: false })
        } else {
          this.setData({ hasMore: false, loading: false })
        }
      })
      .catch(e => {
        this.setData({ subtitle: '获取数据异常', loading: false })
        console.error(e)
      })
  },

  handleSearch (e) {
    if (!e.detail.value) return
    this.setData({ movies: [], page: 1 })
    this.setData({ subtitle: '加载中...', hasMore: true, loading: true, search: e.detail.value })

    this.loadMore()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    this.setData({ movies: [], page: 1 })
    this.loadMore()
      .then(() => app.wechat.original.stopPullDownRefresh())
  },

  onReachBottom () {
    this.loadMore()
  }
})
