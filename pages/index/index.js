const app = getApp()

Page({
  data: {
    images: null,
    hasImages: false,
    label: "create"
  },

  onLoad: function () {
    if (app.globalData.images) {
      this.setData({ images: app.globalData.images });
      if (this.data.images.length) { this.setData({ hasImages: true, label: "update" }) }
    } else {
      app.userDocumentReadyCallback = res => {
        this.setData({ images: res.data.images });
        if (this.data.images.length) { this.setData({ hasImages: true, label: "update" }) }
      }
    }    
  }

});