// pages/chat/chatMain.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgs: [],// 信息列表,仅读取前二十条
    uid: "", // 用户uid
    users: [], // 好友列表
    booSearch: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 数据初始化
    that.setData({
      uid: wx.getStorageSync('information').uid
    })
    that.getMsgs();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      value: "",
      users:[],
      boolSearch:false
    })
    that.getMsgs();
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
   * 获取最近消息
   */
  getMsgs: function () {
    let that = this;
    wx.request({
      url: 'http://localhost:8080/message/recent',
      header: {
        "Content-Type": "application/json"
      },
      method: "GET",
      data: {
        'uid': that.data.uid
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            msgs: res.data.msgs
          })
          //console.log(res.data.msgs);
        } else {
          wx.showToast({
            title: "获取最近消息失败，请重试！",
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
  },

  /**
   * 获取输入框的值
   */
  inputValue: function (e) {
    this.setData({
      value: e.detail.value
    })
  },

  /**
   * 查找
   */
  search: function () {
    let that = this;
    if (that.data.value.length == 0) {
      wx.showToast({
        title: '搜索内容不能为空',
        duration: 1500,
        icon: 'none'
      })
    } else {
      wx.request({
        url: 'http://localhost:8080/fanfollow/searchFansFollows',
        header: {
          "Content-Type": "application/json"
        },
        method: "GET",
        data: {
          'uid': that.data.uid,
          'keyword': that.data.value
        },
        success: function (res) {
          if (res.data.code == 0) {
            if (res.data.users.length == 0) {
              wx.showToast({
                title: '没有检索到相关内容',
                duration: 1500,
                icon: 'none'
              })
            } else {
              that.setData({
                users: res.data.users,
                boolSearch: true
              })
            }
          } else {
            wx.showToast({
              title: "检索失败，请重试！",
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
   * 进入详细聊天界面
   */
  msgToChat:function(e){
    console.log(e);
    let that=this;
    // 找到聊天对象的uid
    let oid = e.currentTarget.dataset.touid;
    if(oid == that.data.uid){
      oid = e.currentTarget.dataset.fromuid
    }
    //console.log(oid);
    wx.navigateTo({
      url: 'chating/chating?toUid=' + oid,
    })
  },

  friendToChat: function (e) {
    //console.log(e);
    let that = this;
    //清空数据
    that.setData({
      users: [],
      boolSearch: false
    })
    //console.log(e.currentTarget.dataset.touid);
    wx.navigateTo({
      url: 'chating/chating?toUid=' + e.currentTarget.dataset.touid,
    })
  }
})