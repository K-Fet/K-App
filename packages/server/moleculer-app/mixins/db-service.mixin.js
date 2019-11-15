const DbService = require('moleculer-db');
const MongooseAdapter = require('moleculer-db-adapter-mongoose');
const conf = require('nconf');

module.exports = function dbService(mongooseModel, disableActions = false) {
  const actions = {
    find: {},
    count: {},
    list: {},
    insert: {},
    get: {},
    update: {},
    remove: {},
    create: {},
  };
  if (disableActions === true || Array.isArray(disableActions)) {
    Object.keys(actions)
      .filter(k => disableActions === true || disableActions.includes(k))
      .forEach((k) => { actions[k] = false; });
  }
  return {
    mixins: [DbService],
    adapter: new MongooseAdapter(conf.get('mongodb:url'), { useNewUrlParser: true, useCreateIndex: true }),
    model: mongooseModel,
    actions,
  };
};
