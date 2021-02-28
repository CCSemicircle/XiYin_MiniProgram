// pages/user/myFriend/myFriend.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: "",
    users: [], // 好友列表
    navBar: [{
      type: "myFollows",
      url: 'http://localhost:8080/fanfollow/getFollows',
      searchUrl: 'http://localhost:8080/fanfollow/searchFollows',
      text: "我的关注"
    },
    {
      type: "myFans",
      url: 'http://localhost:8080/fanfollow/getFans',
      searchUrl: 'http://localhost:8080/fanfollow/searchFans',
      text: "我的粉丝"
    }
    ],
    index: 0,
    value: "",  // 搜索框内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 初始化数据
    that.setData({
      uid: options.uid
    })
    if (options.type == "myFans") {
      that.setData({
        index: 1
      })
    }
    that.getUsers();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      value: ""
    })
    that.getUsers();
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
   * 搜索框内容输入
   */
  inputValue: function (e) {
    this.setData({
      value: e.detail.value
    })
  },

  /**
   * 获取关注列表
   */
  getUsers: function () {
    let that = this;
    let index = that.data.index;
    let param = {
      'uid': that.data.uid
    }
    wx.request({
      url: that.data.navBar[index].url,
      method: 'GET',
      data: param,
      header: {
        "Content-Type": 'application/json'
      },
      success: function (res) {
        //console.log(res);
        if (res.data.code == 0) {
          that.setData({
            users: res.data.users
          })
        } else {
          wx.showToast({
            title: '获取用户列表失败,请重试！',
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
   * 检索用户列表
   */
  search: function () {
    let that = this;
    let index = that.data.index;
    if (that.data.value.length == 0) {
      wx.showToast({
        title: '搜索内容不能为空',
      })
    } else {
      let param = {
        'uid': that.data.uid,
        'keyword': that.data.value
      }
      wx.request({
        url: that.data.navBar[index].searchUrl,
        method: 'GET',
        data: param,
        header: {
          "Content-Type": 'application/json'
        },
        success: function (res) {
          //console.log(res);
          if (res.data.code == 0) {
            that.setData({
              users: res.data.users
            })
          } else {
            wx.showToast({
              title: '获取用户列表失败,请重试！',
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
    }
  },

  /**
   * 查看他人信息
   */
  seeOther:function(e){
    wx.navigateTo({
      url: '../../OtherInfo/OtherInfo?oid=' + e.currentTarget.dataset.uid,
    })
  }
})