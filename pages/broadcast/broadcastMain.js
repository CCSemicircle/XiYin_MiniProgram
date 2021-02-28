// pages/broadcast/broadcastMain.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: [],    // 用户当前定位
    types: ["全部频道", "演出赛事", "结伴旅游", "拼车出行", "其他频道"],   // 帖子类别
    posts: [],// 用户所发帖子
    value: "",  // 搜索框的值
    currTab:0,  // 当前选定的分类
    uid:"",   // 用户uid
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 初始化数据
    that.setData({
      uid:wx.getStorageSync('information').uid
    })
    that.getLocation();
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
   * 切换顶部导航栏
   */
  onTapNav:function(e){
    this.setData({
      currTab:e.currentTarget.dataset.index
    })
  },

  /**
   * 校验是否授权位置信息
   */
  checkLocation() {
    let that = this;
    //选择位置，需要用户授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              wx.showToast({ //这里提示失败原因
                title: '授权成功！',
                duration: 1500
              })
            },
            fail() {
              that.showSettingToast('需要授权位置信息');
            }
          })
        }
      }
    })
  },

  /**
   * 打开权限设置页提示框
   */
  showSettingToast: function (e) {
    wx.showModal({
      title: '提示！',
      confirmText: '去设置',
      showCancel: false,
      content: e,
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../setting/setting',
          })
        }
      }
    })
  },

  /**
   * 获取位置
   */
  getLocation: function () {
    this.checkLocation();
    let that = this;
    wx.chooseLocation({
      success: function (res) {
        //console.log(res)
        // 获取当前定位，精确到 市/州-区/县，后续可考虑导入他方api减少误差
        let index_city = res.address.lastIndexOf("市");
        if (index_city == -1) {
          index_city = res.address.lastIndexOf("州");
        }

        let index_area = res.address.lastIndexOf("县");
        if (index_area == -1) {
          index_area = res.address.lastIndexOf("区");
        }
        let currLocation = [];
        currLocation.push(res.address.substring(0, index_city + 1))
        currLocation.push(res.address.substring(index_city + 1, index_area + 1));
        //console.log(currLocation);

        that.setData({
          location: currLocation
        })

        wx.setStorageSync('location', currLocation);

        // 获取定位后就执行
        that.getPosts();
      }
    });
  },

  /**
   * 获取当前位置所有寻友贴
   */
  getPosts: function () {
    let that = this;
    if (that.data.location.length == 0) {
      wx.showModal({
        title: '温馨提示',
        content: '您没有选择位置无法获取稀音,点击确定获取定位',
        confirmText: '去定位',
        success(res) {
          if (res.confirm) {
            that.getLocation();
          }
        }
      })
    } else {
      wx.request({
        url: 'http://localhost:8080/post/getPosts',
        header: {
          "Content-Type": "application/json"
        },
        method: "GET",
        data: {
          'location': that.data.location.join("|"),
        },
        success: function (res) {
          if (res.data.code == 0) {
            that.setData({
              posts: res.data.posts
            })
            //console.log(res.data.posts);
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
    if (that.data.location.length == 0) {
      wx.showModal({
        title: '温馨提示',
        content: '您没有选择位置无法获取稀音,点击确定获取定位',
        success(res) {
          if (res.confirm) {
            that.getLocation();
          }
        }
      })
    } else if (that.data.value.length == 0) {
      wx.showToast({
        title: '搜索内容不能为空',
        duration: 1500,
        icon: 'none'
      })
    } else {
      wx.request({
        url: 'http://localhost:8080/post/search',
        header: {
          "Content-Type": "application/json"
        },
        method: "GET",
        data: {
          'location': that.data.location.join("|"),
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
   * 发帖
   */
  toAdd: function (e) {
    wx.navigateTo({
      url: 'addPost/addPost',
    })
  },

  /**
   * 顶帖
   */
  up: function (e) {
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
        'id':e.currentTarget.dataset.id
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
            title: "顶帖失败，请重试！",
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
})