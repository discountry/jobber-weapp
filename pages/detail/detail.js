const AV = require('../../utils/av-live-query-weapp-min');

Page({
  data: {
    task: {},
    application: [],
    submission: [],
    user: AV.User.current(),
    applyed: false,
    completed: false
  },
  onLoad: function (options) {
    this.fetchTask(options.objectId);
    this.fetchApplication(options.objectId);
    this.fetchSubmission(options.objectId);
    console.log(this.data);
  },
  fetchTask: function (objectId) {
    new AV.Query('Task')
      .equalTo('objectId', objectId)
      .find()
      .then(tasks => this.setData({ task: tasks[0] }))
      .catch(console.error);
  },
  fetchApplication: function (objectId) {
    var that = this;
    // 当前任务
    var currentTask = AV.Object.createWithoutData('Task', objectId);
    // 构建 UserTaskMap 的查询
    new AV.Query('UserTaskMap')
      .equalTo('task', currentTask)
      .include(['user'])
      .find()
      .then(function (UserTaskMaps) {
        var application = [];
        UserTaskMaps.forEach(function (scm, i, a) {
          application.push(scm.get('user'));
        });
        //console.log(application);
        that.setData({ application });
        that.checkApply();
    });
  },
  fetchSubmission: function (objectId) {
    var that = this;
    var currentTask = AV.Object.createWithoutData('Task', objectId);
    var query = new AV.Query('Submission');
    query.equalTo('task', currentTask);
    query.find().then(function (submits) {
      var submission = [];
      submits.forEach(function (submit, i, a) {
        submission.push(submit)
      });
      that.setData({ submission });
      that.checkCompleted(objectId);
      //console.log(that.data);
    });
  },
  checkApply: function () {
    const { application, user }  = this.data;
    if (application.find(e => e.toJSON().objectId == user.objectId)) {
      this.setData({ applyed: true })
    } else {
      this.setData({ applyed: false })
    }
  },
  checkCompleted: function (objectId) {
    var that = this;
    var currentTask = AV.Object.createWithoutData('Task', objectId);
    var query = new AV.Query('Submission');
    query.equalTo('task', currentTask);
    query.equalTo('user', AV.User.current());
    query.find().then(function (submits) {
      var submission = [];
      submits.forEach(function (submit, i, a) {
        submission.push(submit)
      });
      console.log(submission.length);
      if (submission.length > 0) {
        that.setData({completed: true});
      }
    });
  },
  applyTask: function ({
    target: {
      dataset: {
        id
      }
    }
  }) {
    var that = this;
    const { task } = this.data;
    // 选课表对象
    new AV.Object('UserTaskMap')
      .set('user', AV.User.current())
      .set('task', task)
      .save()
      .then(() => {
        wx.showToast({
          title: '认领成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            that.fetchApplication(task.toJSON().objectId);
          }
        });
      })
      .catch(console.error);
  },
  abandonTask: function ({
    target: {
      dataset: {
        id
      }
    }
  }) {
    var that = this;
    const { task } = this.data;
    new AV.Query('UserTaskMap')
      .equalTo('task', task)
      .equalTo('user', AV.User.current())
      .find()
      .then(function (application) {
        console.log(application);
        return AV.Object.destroyAll(application).then(() => {
          wx.showToast({
            title: '已放弃',
            icon: 'success',
            duration: 2000,
            success: function () {
              that.fetchApplication(task.toJSON().objectId);
            }
          });
        });
      })
      .catch(console.error);
  },
  submitTask: function ({
    target: {
      dataset: {
        id
      }
    }
  }) {
    wx.navigateTo({
      url: '/pages/submit/submit?objectId=' + id
    })
  }
})