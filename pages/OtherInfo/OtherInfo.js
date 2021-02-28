// pages/user/OtherInfo/OtherInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // uid指的是本人ID，oid指的是查看目标的ID
    uid: "",
    oid: "",
    user: "",
    region: "", // 地区,数组
    interest: "", // 兴趣,数组
    followTxt: ["+ 关注", "取消关注"], // 初始化为未关注，显示“+ 关注”
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 数据初始化
    that.setData({
      uid: wx.getStorageSync("information").uid,
      oid: options.oid
    })
    this.getInfo();
    this.checkShip();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //console.log(this.data.oid);
    this.getInfo();
    this.checkShip();
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
   * 获取用户信息
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
        'uid': that.data.oid
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            user: res.data.user,
            region: res.data.user.region==null?"":res.data.user.region.split("|"),
            interests: res.data.user.interests==null?"":res.data.user.interests.split("|")
          })
          //console.log(res.data.user.region);
          //console.log(that.data.region)
        } else {
          wx.showToast({
            title: "获取信息失败，请下拉刷新！",
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
   * 检查两个用户关系
   */
  checkShip: function () {
    let that = this;
    wx.request({
      url: 'http://localhost:8080/fanfollow/isFollow',
      header: {
        "Content-Type": "application/json"
      },
      method: "GET",
      data: {
        'uid': that.data.uid,
        'followUid': that.data.oid
      },
      success: function (res) {
        if (res.data.code == 0 || res.data.code == 1) {
          that.setData({
            index: res.data.code
          })
        } else {
          wx.showToast({
            title: "获取关注信息失败，请下拉刷新！",
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
   * 添加关注/取关
   */
  onTapFollowBtn: function () {
    let that = this;
    let ship = that.data.index;
    // 请求参数
    let param = {
      'uid': that.data.uid,
      'followUid': that.data.oid
    }
    let url = null;
    if (ship == 0) {
      // 添加关注
      url = "http://localhost:8080/fanfollow/follow";
    } else {
      // 取消关注
      url = "http://localhost:8080/fanfollow/follow";
    }
    wx.request({
      url: url,
      method: 'GET',
      data: param,
      header: {
        "Content-Type": 'application/json'
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            index: Math.abs(ship - 1)
          })
        } else {
          wx.showToast({
            title: '修改关注关系失败，请重试！',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (err) {
        console.log(err);
        wx.showToast({
          title: '未连接到服务器',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },

  /**
   * 发起聊天
   */
  toChat: function () {
    let that = this;
    wx.redirectTo({
      url: '/pages/chat/chating/chating?toUid=' + that.data.oid,
    })
  },

  /**
   * 查看我的帖子
   */
  toMyPost: function () {
    wx.navigateTo({
      url: '../user/myPost/myPost?uid=' + this.data.oid,
    })
  },

  /**
   * 查看我的好友
   */
  toMyFriend: function (e) {
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '../user/myFriend/myFriend?type=' + id + '&uid=' + this.data.oid,
    })
  },
})