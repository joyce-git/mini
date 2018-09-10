const app = getApp()

Page({
  data: {
    server: 'https://safe-savannah-64671.herokuapp.com/links/',
    images: [],
  },

  onLoad: function (e) {
    let that = this;
    that.setData({ images: app.globalData.images });
    if (!that.data.images) {
      let link = '5b90397de1399f6c8d4d4bdf';
      if (e.scene) {
        link = decodeURIComponent(e.scene)
      };
      let url = that.data.server + link;
      wx.request({
        url: url,
        success: function(res) {
          that.setData({images: res.data.images});
        }
      })
    }
  }
})