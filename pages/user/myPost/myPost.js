// pages/user/myPost/myPost.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts:[],// 用户所发帖子
    uid:"",  // 用户uid
    value:"",  // 输入框的值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 初始化数据
    that.setData({
      uid:options.uid
    })
    that.getPosts();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      value: ""
    })
    that.getPosts();
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
   * 获取用户所有发布的寻友贴
   */
  getPosts: function () {
    let that = this;
      wx.request({
        url: 'http://localhost:8080/post/userPost',
        header: {
          "Content-Type": "application/json"
        },
        method: "GET",
        data: {
          'uid': that.data.uid,
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 0) {
            that.setData({
              posts: res.data.posts
            })
            //console.log(res.data);
          } else {
            wx.showToast({
              title: "获取稀音失败，请重试！",
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
        url: 'http://localhost:8080/post/searchUserPost',
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
            that.setData({
              posts: res.data.posts
            })
            if (res.data.posts.length == 0) {
              wx.showToast({
                title: '没有检索到相关内容',
                duration: 1500,
                icon: 'none'
              })
            }
          } else {
            wx.showToast({
              title: "获取稀音失败，请重试！",
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
   * 顶帖
   */
  up: function (e) {
    let id=e.currentTarget.dataset.id;
    let that=this;
    //console.log(e.currentTarget.dataset.item);
    //console.log(e.currentTarget.dataset.id);
    wx.request({
      url: 'http://localhost:8080/post/upPost',
      header: {
        "Content-Type": "application/json"
      },
      method: "POST",
      data: {
        'uid':that.data.uid,
        'id':id
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.showToast({
            title: '您已经顶过啦',
            duration:1500,
            icon:'none'
          })
          // 顶帖成功
        } else if(res.data.code == 0){
            // 顶帖成功
            wx.showToast({
              title: '顶帖成功！',
              duration:1000,
              icon:''
            })
        } else {
          wx.showToast({
            title: "点赞失败，请重试！",
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