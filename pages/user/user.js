const AV = require('../../utils/av-live-query-weapp-min');
const { User } = require('../../utils/av-live-query-weapp-min');

Page({
  data: {
    user: null,
    tasks: null
  },
  fetchTasks: function () {
    var that = this
    // 构建 UserTaskMap 的查询
    new AV.Query('UserTaskMap')
      .equalTo('user', User.current())
      .include(['task'])
      .find()
      .then(function (UserTaskMaps) {
        var tasks = [];
        UserTaskMaps.forEach(function (scm, i, a) {
          tasks.push(scm.get('task'));
        });
        that.setData({ tasks });
        //console.log(that.data);
    });
  },
  onLoad: function() {
    if (!User.current()) {
      User.loginWithWeapp().then(user => {
        this.setData({
          user: user.toJSON(),
        });
        this.fetchTasks();
      }).catch(console.error);
    } else {
      this.setData({
        user: User.current(),
      });
      this.fetchTasks();
    }  
    //console.log(this.data);
  },
  onShow: function () {
    this.fetchTasks();
  },
});