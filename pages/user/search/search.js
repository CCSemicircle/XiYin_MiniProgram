// pages/user/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    users: [],// 用户列表
    value:"", // 输入框内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.search();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '稀音-寻觅稀世知音',
      path: '/pages/login/login',
      imageUrl: '/icons/logo.png'
    }
  },

  /**
   * 输入查找内容
   */
  inputValue:function(e){
    this.setData({
      value:e.detail.value
    })
  },

  /**
   * 查找
   */
  search: function () {
    let that = this;
    //console.log(that.data.value);
    if (that.data.value.length == 0) {
      wx.showToast({
        title: '搜索内容不能为空',
        duration: 1500,
        icon: 'none'
      })
    } else {
      wx.request({
        url: 'http://localhost:8080/user/search',
        header: {
          "Content-Type": "application/json"
        },
        method: "GET",
        data: {
          'keyword': that.data.value
        },
        success: function (res) {
          if (res.data.users.length != 0) {
            that.setData({
              users: res.data.users
            })
          } else {
            wx.showToast({
              title: "没有找到任何用户",
              icon: "none",
              duration: 1500
            })
          }
        },
        fail: function (err) {
          console.log(err);
          wx.showToast({
            title: "未连接到服务器！",
            icon: "none",
            duration: 1500
          })
        }
      })
    }
  },

  /**
   * 查看其他人信息
   */
  seeOther: function (e) {
    //console.log(e.currentTarget.dataset.uid);
    wx.navigateTo({
      url: '../../OtherInfo/OtherInfo?oid=' + e.currentTarget.dataset.uid,
    })
  }
})