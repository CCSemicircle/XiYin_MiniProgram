// pages/user/updateInfo/updateInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: "",
    navBar: [
      {
        "type": "name",
        "text": "昵称",
      },
      {
        "type": "sex",
        "text": "性别",
      },
      {
        "type": "age",
        "text": "年龄",
      },
      {
        "type": "region",
        "text": "地区",
      }
    ],    // 导航栏标题
    name: "",
    sex: "",
    age: "",
    region: "",
    index: 0,
    flag: false      // 是否修改
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //console.log(options.type);
    for (let i = 0; i < 4; i++) {
      if (that.data.navBar[i].type == options.type) {
        that.setData({
          index: i,
        })
        //console.log(i);
        break;
      }
    }
    //console.log(that.data.index);

    //数据初始化
    that.setData({
      uid: wx.getStorageSync('information').uid,
      name: wx.getStorageSync('information').name,
      sex: wx.getStorageSync('information').sex,
      age: wx.getStorageSync('information').age,
      region: wx.getStorageSync('information').region==""?wx.getStorageSync('location'):wx.getStorageSync('information').region
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      //
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
   * 输入框聚焦时显示编辑图标
   */
  bindfocus: function () {
    this.setData({
      flag: false,
    })
  },

  /**
   * 输入栏输入完成，修改昵称/年龄
   */
  bindconfirm: function (event) {
    let that = this;
    let value = event.detail.value;
    if (value.length == 0) { 
      wx.showToast({
        title: '信息不能为空',
        icon: 'none',
        duration: 1500
      })
    } else {
      let param;
      if(that.data.index==0){ // 修改昵称
        param={
          'uid':that.data.uid,
          'name':that.data.name
        }
      }else if(that.data.index==2){ // 修改年龄
        param={
          'uid':that.data.uid,
          'age':that.data.age
        }
      }
      wx.request({
        url: 'http://localhost:8080/user/update',
        header: {
          "Content-Type": "application/json"
        },
        method: "POST",
        data: param,
        success: function (res) {
          if (res.data.code == 0) {
            // 修改本地缓存信息，每次更新app.globalData都需修改
            let info = wx.getStorageSync('information');
            if(that.data.index==0){ // 修改昵称
              info.name = value;
              that.setData({
                name: value,
                flag: true,
              })
            }else if(that.data.index==2){ // 修改年龄
              info.age = value;
              that.setData({
                age: value,
                flag: true,
              })
            }
            wx.setStorageSync("information", info);
            wx.showToast({
              title: '信息修改成功！',
              icon: 'success',
              duration: 1000
            });
          } else {
            wx.showToast({
              title: "信息修改失败，请重试！",
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
   * 单击性别栏，修改性别
   */
  onTapSexBar: function(event) {
    let that = this;
    let option = event.currentTarget.id;
    let s = that.data.sex;    // 原数据
    if ((option == "female" && s == 1) || (option == "male" && s == 0)) {
      wx.showModal({
        title: '提示',
        content: '确定是否修改',
        success: function(res) {
          if (res.confirm) { // 用户确定修改
            console.log(Math.abs(s-1));
            wx.request({
              url: 'http://localhost:8080/user/update',
              header: {
                "Content-Type": "application/json"
              },
              method: "POST",
              data: {
                'uid': that.data.uid,
                'sex': Math.abs(s-1)
              },
              success: function(res) {
                if (res.data.code == 0) {
                    that.setData({
                      sex: Math.abs(s-1),
                    })
                  // 修改本地缓存信息，每次更新app.globalData都需修改
                  let info = wx.getStorageSync('information');
                  info.sex = Math.abs(s-1);
                  wx.setStorageSync("information", info);
                  wx.showToast({
                    title: '信息修改成功！',
                    icon: 'success',
                    duration: 1000
                  });
                  that.setData({
                    flag: true,
                  })
                } else {
                  wx.showToast({
                    title: "信息修改失败，请重试！",
                    icon: "none",
                    duration: 1500
                  })
                }
              },
              fail: function(err) {
                console.log(err);
                wx.showToast({
                  title: "未连接到服务器！",
                  icon: "none",
                  duration: 1500
                })
              }
            })
          } else { //用户取消修改

          }
        }
      })
    }
  },

  /**
   * 地区选择器，修改地区信息
   */
  bindRegionChange: function (e) {
    let that = this;
    wx.request({
      url: 'http://localhost:8080/user/update',
      header: {
        "Content-Type": "application/json"
      },
      method: "POST",
      data: {
        'uid': that.data.uid,
        'region': e.detail.value.join('|'), // 上传数据，转换为字符串数据
      },
      success: function (res) {
        if (res.data.code == 0) {
          console.log(res.data.data);
          // 修改本地缓存信息，每次更新app.globalData都需修改
          let info = wx.getStorageSync('information');
          info.region = e.detail.value;
          wx.setStorageSync("information", info);
          wx.showToast({
            title: '信息修改成功！',
            icon: 'success',
            duration: 1000
          });
          that.setData({
            region: value
          })
        } else {
          wx.showToast({
            title: "信息修改失败，请重试！",
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