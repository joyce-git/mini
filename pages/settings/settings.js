// pages/settings/settings.js
Page({
  data: {
    images: [],
    server: 'https://safe-savannah-64671.herokuapp.com/upload/',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  chooseImage: function (e) {
    let that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      count: 3,
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          images: that.data.images.concat(res.tempFilePaths)
        });
      }
    })
  },

  deleteImage: function (e) {
    let that = this;
    let images = that.data.images;
    let index = e.currentTarget.dataset.index;
    images.splice(index, 1);
    that.setData({
      images: images,
    });
  },

  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.images // 需要预览的图片http链接列表
    })
  },

  submit: function (e) {
    let filePaths = this.data.images;
    let i = 0, length = filePaths.length;
    this.uploadFiles(filePaths, i, length);
  },

  uploadFiles(filePaths, i, length) {
    let that = this;
    wx.uploadFile({
      url: that.data.server,
      filePath: filePaths[0],
      name: "file",
      header: {
        "Content-Type": "multipart/form-data",
        "accept": "application/json"
      },
      success: (res) => {
        let data = res.data;
        console.log(res);
      },
      complete: () => {
        i++;
        if (i < length) {
          this.uploadFiles(filePaths, i, length);
        }
      }
    });
  }   


})