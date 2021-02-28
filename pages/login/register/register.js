// pages/login/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    pwd0: "",
    pwd1: "",
    name: "",
    getCode: "",
    trueCode: "",
    getCodeTime: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  /***
   * 设置输入栏信息
   */
  inputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },

  inputCode: function (e) {
    this.setData({
      getCode: e.detail.value
    });
  },

  inputPwd0: function (e) {
    this.setData({
      pwd0: e.detail.value
    });
  },

  inputPwd1: function (e) {
    this.setData({
      pwd1: e.detail.value
    });
  },

  inputName: function (e) {
    this.setData({
      name: e.detail.value
    });
  },

  /**
   * 获取验证码
   */
  getCode: function () {
    let that=this;
    if (that.data.phone == "") {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 1500
      })
    } else {
      // 验证用户是否已经注册
    wx.request({
      url: "http://localhost:8080/user/isExist",
      method: 'GET',
      data: {
        "phone": that.data.phone
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 0) {

          /**
           * 获取验证码，获取验证码之后禁止修改手机号，不应该变动手机号
           */

          // 验证码发送成功进行提示
          wx.showModal({
            title: '温馨提示',
            content:'验证码已经发送，请注意查收'
          })
    
        } else if (res.data.code == 1) {
          wx.showToast({
            title: '手机号已经注册',
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '获取验证码失败',
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
   * 验证验证码并提交表单信息进行注册
   */
  check: function () {

    /**
     * 验证验证码
     */

    // 提交表单信息进行注册
    let that = this;
    if (that.data.phone == "" ||
    that.data.getCode == "" ||
      that.data.name == "" ||
      that.data.pwd0 == "" ||
      that.data.pwd1 == "") {
      wx.showToast({
        title: '请将必要信息填写完整',
        icon: 'none',
        duration: 1500
      })
    } else if(that.data.pwd0!=that.data.pwd1){
      wx.showToast({
        title: '两次输入的密码不一致',
        icon: 'none',
        duration: 1500
      })
    }
    else {
      wx.request({
        url: "http://localhost:8080/user/register",
        method: 'POST',
        data: {
          'phone': that.data.phone,
          'pwd': that.data.pwd0,
          'name': that.data.name,
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 0) {
            wx.showToast({
              title: '注册成功',
              icon: 'success',
              duration: 1000,
            })
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })　　　　
            }, 1000);
          } else {
            wx.showToast({
              title: '注册失败',
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
  }
})