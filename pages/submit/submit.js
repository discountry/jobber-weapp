const AV = require('../../utils/av-live-query-weapp-min');

Page({
  data: {
    objectId: null,
    url: null,
    description: null
  },
  onLoad: function (options) {
    this.setData({
      objectId: options.objectId
    })
  },
  bindUrlInput: function (e) {
    this.setData({
      url: e.detail.value
    })
  },
  bindDescriptionInput: function (e) {
    this.setData({
      description: e.detail.value
    })
  },
  submit: function () {
    const { objectId, url, description } = this.data;
    if (url == null || description == null) {
      wx.showModal({
        title: '提示',
        content: '请填写表单内容',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
      return false;
    }
    var Task = AV.Object.createWithoutData('Task', objectId);
    var Result = new AV.Object('Submission');
    Result.set('task',Task);
    Result.set('user',AV.User.current());
    Result.set('url', url);
    Result.set('description', description);
    Result.save().then(() => {
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000,
        success: function () {
          wx.redirectTo({
            url: '/pages/detail/detail?objectId=' + objectId
          });
        }
      });
    });
  }
})