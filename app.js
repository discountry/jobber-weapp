//app.js
const AV = require('./utils/av-live-query-weapp-min');
// LeanCloud 应用的 ID 和 Key
AV.init({
  appId: 'Wfj5zFxm2ImCLGb1pMUs1jA7-gzGzoHsz',
  appKey: 'lQEKQgUxkFgvKjs5OR5zYC3g',
});

App({
  onLaunch: function () {
    AV.User.loginWithWeapp().then(user => {
      this.globalData.user = user.toJSON();
    }).catch(console.error);
    this.getUserInfo();
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      const user = AV.User.current();
      // 调用小程序 API，得到用户信息
      wx.getUserInfo({
        success: ({userInfo}) => {
          // 更新当前用户的信息
          user.set(userInfo).save().then(user => {
            // 成功，此时可在控制台中看到更新后的用户信息
            this.globalData.user = user.toJSON();
          }).catch(console.error);
        }
      });
    }
  },
  globalData: {
    userInfo: null
  }
});