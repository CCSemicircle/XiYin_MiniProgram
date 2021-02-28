// pages/login/login.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",
    pwd:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (wx.getStorageSync('information').uid != "") {
      that.setData({
        phone: wx.getStorageSync('information').phone,
        pwd: wx.getStorageSync('information').pwd
      })
      that.login();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.onLoad();
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
   * 输入手机号
   */
  inputPhone:function(e){
    this.setData({
      phone: e.detail.value
    });
  },

  /**
   * 输入密码
   */
  inputPwd: function(e) {
    this.setData({
      pwd: e.detail.value
    });
  },

  /**
   * 登录
   */
  login:function(e){
    let that=this;
    if(that.data.phone=="" || that.data.pwd==""){
      wx,wx.showToast({
        title: '请输入手机号和密码',
        duration: 1500,
        icon: 'none',
      })
      return;
    }

    // 请求参数
    let url= "http://localhost:8080/user/login";
    let param={
      "phone":that.data.phone,
      "pwd":that.data.pwd
    }

    wx.request({
      url: url,
      method: 'POST',
      data: param,
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        //console.log(res.data)
        if(res.data.code==0){
        let info=res.data.user;
        info.region=res.data.user.region==null?"":res.data.user.region.split("|");
        info.interests=res.data.user.interests==null?"":res.data.user.interests.split("|");
        wx.setStorageSync('information', info);
        wx.switchTab({
          url: '../broadcast/broadcastMain'
        })
      }else{
        wx.showToast({
          title: '账号密码不正确',
          icon:'loading',
          duration:1500
        })
      }
      },
      fail(err) {
        console.log(err)
        wx.showToast({
          title: '网络连接失败',
          icon:'loading',
          duration:1500
        })
      }
    })
  },

  /**
   * 找回密码
   */
  toFindPwd:function(){
    wx.navigateTo({
      url: 'findPwd/findPwd',
    })
  },

  /**
   * 游客访问
   */
  touristVisit:function(){
    wx.switchTab({
      url: '../broadcast/broadcastMain',
    })
  },

  /**
   * 注册账号
   */
  toRegister:function(){
    wx.navigateTo({
      url: 'register/register',
    })
  }
})