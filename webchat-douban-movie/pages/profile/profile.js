//获取全局应用程序实例对象
var app = getApp()
console.log(app.globalData)

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: 'About',
    userInfo: {
      wechat: 'WEDN-NET',
      nickName: '点击图片获取头像',
      avatarUrl: '../../images/xwz.jpg'
    }
  },

  getUserInfo () {
    const that = this
    app.wechat.getUserInfo()
      .then(res => that.setData({ userInfo: res.userInfo }))
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.wechat.login()
      .then(res => {
        if (res.code) {
          console.log('登录成功！' + res.code)
        } else {
          console.error('获取用户登录态失败！' + res.errMsg)
        }
      })
  }

  })