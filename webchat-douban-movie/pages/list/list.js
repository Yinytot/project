// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    subtitle: '加载中...',
    type: 'in_theaters',
    loading: true,
    hasMore: true,
    page: 1,
    size: 20,
    movies: []
  },

  loadMore () {
    if (!this.data.hasMore) return
    // setData 函数用于将数据从逻辑层发送到视图层，同时改变对应的 this.data 的值。
    /** 注意：直接修改 this.data 无效，无法改变页面的状态，还会造成数据不一致。
      * 注意：单次设置的数据不能超过1024kB，请尽量避免一次设置过多的数据。
      * setData() 参数格式
      * 接受一个对象，以 key，value 的形式表示将 this.data 中的 key 对应的值改变成 value。
      * 其中 key 可以非常灵活，以数据路径的形式给出，如 array[2].message，a.b.c.d，并且不需要在 this.data 中预先定义。
    */
    this.setData({ subtitle: '加载中...', loading: true })
    //app.douban.find()函数是在utils/douban.js中定义的函数
    return app.douban.find(this.data.type, this.data.page++, this.data.size)
      .then(d => {
        if (d.subjects.length) {
          this.setData({ subtitle: d.title, movies: this.data.movies.concat(d.subjects), loading: false })
        } else {
          this.setData({ subtitle: d.title, hasMore: false, loading: false })
        }
      })
      .catch(e => {
        this.setData({ subtitle: '获取数据异常', loading: false })
        console.error(e)
      })
  },

  /**
   * 生命周期函数--监听页面加载
   * this.data.title和this.data.type都是从board.wxml中url？后面的参数中传过来的
   */
  onLoad (params) {
    this.data.title = params.title || this.data.title

    // 类型： in_theaters  coming_soon  us_box
    this.data.type = params.type || this.data.type

    this.loadMore()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    //用微信提供的API 设置当前页面标题
    wx.setNavigationBarTitle({ title: this.data.title + ' « 电影 « 豆瓣' })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉刷新onPullDownRefresh ()和上拉加载onReachBottom ()动作
   * app.wechat.original是封装好的，在ulit/wechat.js和app.js中
   */
  onPullDownRefresh () {
    this.setData({ movies: [], page: 1, hasMore: true })
    this.loadMore()
      .then(() => app.wechat.original.stopPullDownRefresh())
  },

  onReachBottom () {
    this.loadMore()
  }
})