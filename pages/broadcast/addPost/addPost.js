// pages/broadcast/addPost/addPost.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: [     // 活动种类
      "演出赛事",
      "结伴旅游",
      "拼车出行",
      "其他频道"
    ],
    index: 0,    // 默认种类
    location: "",  // 默认位置
    content:"",   // 具体内容
    uid: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 初始化数据
    that.setData({
      uid: wx.getStorageSync('information').uid,
      location: wx.getStorageSync('location')   
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.submit();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
        return {
            title: '稀音-寻觅稀世知音',
            path: '/pages/login/login',
            imageUrl: '/icons/logo.png'
          }
  },


  /**
   * 内容选择
   */
  bindPickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  /**
   * 地区选择器
   */
  bindLocationChange: function (e) {
    let that = this;
    that.setData({
      location: e.detail.value
    })
  },

  /**
   * 输入内容
   */
  inputContent: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  /**
   * 发布
   */
  submit: function () {
    let that = this;
    let idx = that.data.index + 1;
    if (that.data.content.length == 0) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 1500
      })
    } else {
      wx.request({
        url: 'http://localhost:8080/post/addPost',
        header: {
          "Content-Type": "application/json"
        },
        method: "POST",
        data: {
          'uid': that.data.uid,
          'postTypeId': idx, // id加1
          'location': that.data.location.join("|"),
          'content': that.data.content
        },
        success: function (res) {
          if (res.data.code == 0) {
            wx.showToast({
              title: '发布成功！',
              icon: 'success',
              duration: 1000
            });
            setTimeout(function () {
              wx.navigateBack({ //返回上一页面或多级页面
                delta: 1
              })
            }, 1000);
          } else {
            wx.showToast({
              title: "发布失败，请重试！",
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