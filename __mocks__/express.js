/* eslint-disable no-unused-vars,class-methods-use-this,no-param-reassign */
const next = jest.fn();

function Router() {
  return {
    post(str, cb) {
      this._handle(str, cb);
    },

    put(str, cb) {
      this._handle(str, cb);
    },

    get(str, cb) {
      this._handle(str, cb);
    },

    use(str, cb) {
      this._handle(str, cb);
    },

    _handle(str, cb) {
      if (typeof str === 'function') {
        cb = str;
      }
      cb({}, {}, next);
    },
  };
}

module.exports = {
  Router,
  next,
};
