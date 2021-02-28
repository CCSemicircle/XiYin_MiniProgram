// request get 请求
var getData = function getData(url,param) {
  wx.request({
    url: url,
    method: 'GET',
    data: param,
    success(res) {
      return res.data
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
}

// request post 请求
var postData = function(url,param) {
  wx.request({
    url: url,
    method: 'POST',
    data: param,
    header: {
      'Content-Type': 'application/json'
    },
    success(res) {
      return res.data;
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
}

// uploadFile 请求
const uploadFileData = (url,filePath)=>{
  return new Promise((resolve,reject)=>{
    wx.uploadFile({
      url: url,
      filePath: filePath,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      success(res) {
        let data = JSON.parse(res.data); // 坑，上传文件返回的是json数据，需要解析
        resolve(data.data);
      },
      fail(err) {
        reject(err);
      }
    })
  })
}

// loading加载提示
const showLoading = () => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '上传中...',
      mask: true,
      success(res) {
        //console.log('显示loading')
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// 关闭loading
const hideLoading = () => {
  return new Promise((resolve) => {
    wx.hideLoading()
    //console.log('隐藏loading')
    resolve()
  })
}

module.exports = {
  getData,
  postData,
  uploadFileData,
  showLoading,
  hideLoading
}