const app = getApp()

Page({
  data: {
    user: null,
    images: null,
    hasImages: false,
    label: "create"
  },

  onLoad: function () {
    if (app.globalData.user) {
      this.setData({ 
        user: app.globalData.user,
        images: app.globalData.user.images
      });
    } else {
      app.userDocumentReadyCallback = res => {
        this.setData({ 
          user: res.data,
          images: res.data.images
        });
      }
    }    
  },

  onShow: function () {
    if (app.globalData.user) {
      this.setData({
        user: app.globalData.user,
        images: app.globalData.user.images
      });
    } else {
      app.userDocumentReadyCallback = res => {
        this.setData({
          user: res.data,
          images: res.data.images
        });
      }
    }
  }
});