//app.js
App({
  onLaunch: function () {
    let that = this;
    let logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    // Check if token_id exists on the client first
    wx.getStorage({
      key: 'token_id',
      success: res => {
        console.log("Token exists on client");
        // Check if token_id exists on the server
        wx.request({
          url: that.globalData.server + 'login',
          method: 'GET',
          header: { 'content-type': 'application/json' },
          data: { token_id: res.data.data },
          success: res => {
            if (res.statusCode == "200") {
              console.log("log in successfully");
              that.globalData.token_id = res.data;
              that.getUserDocument();
            } else if (res.statusCode == "204") {
              that.createToken();
            }
          },
          fail: res => {
            console.log(res);           
          }
        })
      },
      fail: res => {
        console.log("Failed to find token_id from storage info");
        that.createToken();
      }
    });
  },

  createToken: function () {
    let that = this;
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: that.globalData.server + 'login',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              code: res.code
            },
            success: res => {
              wx.setStorage({
                key: "token_id",
                data: res
              });
              console.log("successfully created token");
              that.globalData.token_id = res.data;
              that.getUserDocument();
            },
            fail: res => {
              console.log("Failed to create token");
            }
          })
        }
      },
      fail: res => {
        console.log("Failed to log in.");
      }
    })
  },

  getUserDocument: function () {
    let that = this;
    wx.request({
      url: that.globalData.server + 'home',
      method: 'GET',
      header: { 'content-type': 'application/json' },
      data: {
        token_id: that.globalData.token_id
      },
      success: res => {
        if (res.statusCode == "200") {
          that.globalData.images = res.data.images;
        } else if (res.statusCode == "204") {
          console.log("User NOT found");
        }
      },
      fail: res => {
        console.log("Failed to find the user");
        console.log(res);
      }
    })
  },

  globalData: {
    userInfo: null,
    token_id: null,
    images: [],
    server: 'http://localhost:3000/',
    server2: 'https://safe-savannah-64671.herokuapp.com/' ||'http://localhost:3000/'
  }
})