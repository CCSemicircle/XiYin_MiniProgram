// pages/chat/chating/chating.js
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;

/**
 * 初始化数据
 */
function initData(that) {
  inputVal = '';

  that.setData({
    msgList,
    inputVal
  })
}

/**
 * 计算msg总高度
 */
function calScrollHeight(that, keyHeight) {
  var query = wx.createSelectorQuery();
  query.select('.scrollMsg').boundingClientRect(function (rect) {
  }).exec();
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {}, // 聊天对象信息
    uid: "", // 当前用户uid
    avatar: "", // 当前用户头像
    toUid: "", // 聊天对象toUid
    scrollHeight: '100vh',
    inputBottom: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    initData(that);
    that.setData({
      uid: wx.getStorageSync('information').uid,
      avatar: wx.getStorageSync('information').avatar,
      toUid: options.toUid,
    });
    that.recept();
    that.getInfo();
    that.getMsgs();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.recept();
    that.getInfo();
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
   * 获取聚焦
   */
  focus: function (e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1)
    })

  },

  /**
   * 读取输入框的值
   */
  inputValue: function (e) {
    inputVal = e.detail.value;
    this.setData({
      inputVal
    });
  },

  /**
   * 发送点击监听
   */
  sendClick: function (e) {
    let that = this;
    wx.request({
      url: 'http://localhost:8080/message/sendMessage',
      header: {
        "Content-Type": "application/json"
      },
      method: "POST",
      data: {
        "fromUid": that.data.uid,
        'toUid': that.data.toUid,
        'msgContent': inputVal,
        'msgTypeId': 1  // 1为文本，2为图片链接
      },
      success: function (res) {
        if (res.data.code == 0) {
          // 发送成功
          msgList.push({
            fromUid: that.data.uid,
            toUid: that.data.toUid,
            msgContent: inputVal,
            msgTypeId: 1
          })
          inputVal = '';
          that.setData({
            msgList,
            inputVal
          });
        } else {
          wx.showToast({
            title: "发送信息失败，请重试！",
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
   * 修改信息状态
   */
  recept: function () {
    let that = this;
    wx.request({
      url: 'http://localhost:8080/message/recept',
      header: {
        "Content-Type": "application/json"
      },
      method: "GET",
      data: {
        'uid': that.data.uid,
        'fromUid': that.data.toUid,
      },
      success: function (res) {
        if (res.data.code == 0 || res.data.code==-1) {
          // 修改成功
        } else {
          wx.showToast({
            title: "读取信息失败，请刷新重试！",
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
   * 获取聊天对象信息
   */
  getInfo: function () {
    let that = this;
    wx.request({
      url: 'http://localhost:8080/user/getInfo',
      header: {
        "Content-Type": "application/json"
      },
      method: "GET",
      data: {
        'uid': that.data.toUid,
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            user: res.data.user
          })
        } else {
          wx.showToast({
            title: "获取对方信息失败，请刷新重试！",
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
   * 获取聊天信息
   */
  getMsgs: function () {
    let that = this;
    wx.request({
      url: 'http://localhost:8080/message/chat',
      header: {
        "Content-Type": "application/json"
      },
      method: "GET",
      data: {
        'fromUid': that.data.uid,
        'toUid': that.data.toUid
      },
      success: function (res) {
        if (res.data.code == 0) {
          msgList = res.data.msgs;
          that.setData({
            msgList
          })
          //console.log(res.data.msgs);
        } else {
          wx.showToast({
            title: "获取消息失败，请刷新重试！",
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
})