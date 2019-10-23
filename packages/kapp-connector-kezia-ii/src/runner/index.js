/* eslint-disable no-param-reassign */
class Runner {
  constructor(options) {
    this.options = {
      tasks: [],
      interval: 1000 * 60 * 2,
      maxTaskFailed: -1,
      taskFailHandler: null,
      taskFailRecover: null,
      ...options,
    };
  }

  startAll() {
    console.log(`Starting runner with interval of ${this.options.interval / 1000} seconds`);
    this._run();
  }

  stopAll() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  async _taskFailed(error, task) {
    const { maxTaskFailed, taskFailHandler } = this.options;

    if (!maxTaskFailed || maxTaskFailed === -1) return;

    task._failedCount = (task._failedCount + 1) || 1;

    if (task._failedCount >= maxTaskFailed) {
      if (task._taskFailHandled) {
        console.warn(`Task ${task.name} failed again, but handler was already called`);
        return;
      }
      task._taskFailHandled = true;

      console.warn(`Task ${task.name} failed to many times, calling fail handler`);

      if (typeof taskFailHandler !== 'function') {
        throw new Error('taskFailHandler is not a function');
      }
      try {
        await taskFailHandler(error, task);
        console.log('Notification sent!');
      } catch (e) {
        console.error(`Unable to send notification, please contact the webmaster at '${process.env.ERROR_EMAIL}'`, e);
      }
    }
  }

  async _resetTaskFailed(t) {
    const { taskFailRecover } = this.options;
    if (t._taskFailHandled && taskFailRecover) {
      // Send notification about fixed error
      await taskFailRecover(t);
    }

    t._failedCount = 0;
    t._taskFailHandled = false;
  }

  _run() {
    console.log('Starting new run session');

    // eslint-disable-next-line no-return-assign
    this.options.tasks.forEach(t => t.data = t.data || {});

    const runningTasks = this.options.tasks
      .filter(t => !t.disabled)
      .map(t => ({ p: t.handler(this.options, t.data), t }))
      .map(({ p, t }) => p
        .then((d) => {
          console.log(`Task ${t.name} terminated with success!`, d);
          this._resetTaskFailed(t);
        })
        .catch((e) => {
          console.error(`Task ${t.name} terminated failing!`, e);
          this._taskFailed(e, t);
        }));

    Promise.all(runningTasks)
      .then(() => {
        this.intervalId = setTimeout(this._run.bind(this), this.options.interval);
      });
  }
}

module.exports = Runner;
