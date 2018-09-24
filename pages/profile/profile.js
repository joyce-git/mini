// pages/settings/settings.js
const app = getApp()

Page({
  data: {
    user: null,
    originalImages: null,
    images: null,
    server: 'http://localhost:3000/'||'https://safe-savannah-64671.herokuapp.com/',
  },

  chooseImage: function (e) {
    let that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      count: 3 - that.data.images.length,
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
    let images = that.data.user.images;
    let index = e.currentTarget.dataset.index;
    images.splice(index, 1);
    that.setData({
      images: images,
    });
  },

  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.user.images // 需要预览的图片http链接列表
    })
  },

  submit: function (e) {
    let filePaths = this.data.images;
    let deletedImages = [];
    for (let i=0; i< this.data.originalImages.length; i++) {
      let image = this.data.originalImages[i];
      if (!filePaths.includes(image)) {
        deletedImages.push(image);
      }
    }
    let newImages = [];
    for (let i=0; i<filePaths.length; i++) {
      let image = filePaths[i];
      if (!this.data.originalImages.includes(image)) {
        newImages.push(image);
      }
    }  
    if (deletedImages.length > 0) { 
      this.deleteFiles(deletedImages);
    }
    if (newImages.length > 0) {
      this.uploadFiles(newImages, 0, newImages.length);
    }
  },

  deleteFiles(deletedImages) {
    let that = this;
    wx.request({
      url: that.data.server + "images/delete",
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        token_id: app.globalData.token_id,
        deletedImages: deletedImages
      },
      success: res => {
        if (res.statusCode == "200") {
          app.globalData.user = res.data;
        }
      },
      fail: err => {
        console.log(err);
      }
    })
  },

  uploadFiles(filePaths, i, length) {   
    let that = this;
    wx.uploadFile({
      url: that.data.server + "images/upload",
      filePath: filePaths[i],
      name: "file",
      header: {
        "Content-Type": "multipart/form-data",
        "accept": "application/json"
      },
      formData: {
        token_id: app.globalData.token_id
      },
      success: (res) => {
        if (res.statusCode == "200") {
          app.globalData.user = JSON.parse(res.data);
        }
      },
      complete: () => {
        i++;
        if (i < length) {
          this.uploadFiles(filePaths, i, length);
        }
      }
    });
  },

  onLoad: function () {
    if (app.globalData.user) {
      console.log(app.globalData.user);
      this.setData({ 
        user: app.globalData.user,
        originalImages: app.globalData.user.images,
        images: app.globalData.user.images
      });
    } else {
      app.userDocumentReadyCallback = res => {
        this.setData({
          user: res.data,
          originalImages: res.data.images,
          images: res.user.images
        });
      }
    } 
  }


})