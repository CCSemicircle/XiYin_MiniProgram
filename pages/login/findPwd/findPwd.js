// pages/login/findPwd/findPwd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    getCode: "",
    trueCode: "",
    getCodeTime: "",
    pwd0: "",
    pwd1: "",
    isHidden: true
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '稀音-寻觅稀世知音',
      path: '/pages/login/login',
      imageUrl: '/icons/logo.png'
    }
  },

  /***
   * 设置输入栏信息
   */
  inputPhone: function(e) {
    this.setData({
      phone: e.detail.value
    });
  },

  inputPwd0: function(e) {
    this.setData({
      pwd0: e.detail.value
    });
  },

  inputPwd1: function(e) {
    this.setData({
      pwd1: e.detail.value
    });
  },

  inputAccount: function(e) {
    this.setData({
      account: e.detail.value
    });
  },


  inputCode: function(e) {
    this.setData({
      getCode: e.detail.value
    });
  },

  /**
   * 获取验证码
   */
  getCode: function() {
    /**
     * 获取验证码
     */
    let that=this;
    if (that.data.phone == "") {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 1500
      })
    }else{
      wx.showModal({
        title: '温馨提示',
        content:'验证码已经发送，请注意查收'
      })
    }
  },

  /**
   * 验证验证码
   */
  checkCode: function(e) {
    var that = this;
    that.setData({
      isHidden: false
    })
    /**
     * 验证验证码
     */
  },

  /**
   * 提交新密码
   */
  submitPwd: function() {
    var that = this;
    var pwd0 = that.data.pwd0;
    var pwd1 = that.data.pwd1;
    if (pwd0 == "" ||
      pwd1 == "") {
      wx.showToast({
        title: '请将信息填写完整',
        icon: 'none',
        duration: 1500
      })
    } else if (pwd0 != pwd1) {
      wx.showToast({
        title: '两次输入密码不相同',
        icon: 'none',
        duration: 1500
      })
    } else {
      // 请求参数
      let url="http://localhost:8080/user/update";
      let param ={
        "phone":that.data.phone,
        "pwd":pwd0
      }
      wx.request({
        url: url,
        method: 'post',
        data: param,
        header: {
          'Content-Type': 'application/json'
        },
        success: function(res) {
          if (res.data.code == 0) {
            wx.showToast({
              title: '密码修改成功,请重新登录',
              icon: 'none',
              duration: 1000
            })
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })　　　　
            }, 1000);
          } else {
            wx.showToast({
              title: '密码修改失败',
              icon: 'none',
              duration: 1500,
            })
          }
        },
        fail: function(err) {
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