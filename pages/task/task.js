const AV = require('../../utils/av-live-query-weapp-min');

Page({
  data: {
    tasks: [],
  },
  onReady: function () {
    this.fetchTask();
  },
  fetchTask: function () {
    new AV.Query('Task')
      .descending('createdAt')
      .include(['application'])
      .find()
      .then(tasks => this.setData({ tasks }))
      .catch(console.error);
  },
  applyTask: function ({
    target: {
      dataset: {
        id
      }
    }
  }) {
    const { tasks } = this.data;
    const currentTask = tasks.filter(tasks => tasks.id === id)[0];
    currentTask.set('application', AV.User.current());
    currentTask.save()
      .then(() => this.fetchTask())
      .catch(console.error);
    console.log(this.data.tasks)
  }
});