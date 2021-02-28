// pages/user/updateIntro/updateIntro.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: "",
    intro: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 数据初始化
    this.setData({
      uid: wx.getStorageSync('information').uid,
      intro: wx.getStorageSync('information').intro
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //
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
   * 输入intro
   */
  inputIntro:function(e){
    this.setData({
      intro:e.detail.value
    })
  },

  /**
   * 返回上一界面
   */
  cancel: function () {
    wx.navigateBack({
      complete: (res) => { },
    })
  },

  /**
   * 提交修改信息
   */
  submit: function () {
    let that = this;
    let value = that.data.intro
    if (value.length == 0) { 
      wx.showToast({
        title: '信息不能为空',
        icon: 'none',
        duration: 1500
      })
    } else {
      wx.request({
        url: 'http://localhost:8080/user/update',
        header: {
          "Content-Type": "application/json"
        },
        method: "POST",
        data: {
          'uid':that.data.uid,
          'intro':value
        },
        success: function (res) {
          if (res.data.code == 0) {
            // 修改本地缓存信息，每次更新app.globalData都需修改
            let info = wx.getStorageSync('information');
            info.intro = value;
            wx.setStorageSync("information", info);
            wx.showToast({
              title: '信息修改成功！',
              icon: 'success',
              duration: 1000
            });
          } else {
            wx.showToast({
              title: "信息修改失败，请重试！",
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
  }
})