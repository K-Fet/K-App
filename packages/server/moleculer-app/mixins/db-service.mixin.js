const DbService = require('moleculer-db');
const MongooseAdapter = require('moleculer-db-adapter-mongoose');
const conf = require('nconf');

module.exports = function dbService(mongooseModel) {
  return {
    mixins: [DbService],
    adapter: new MongooseAdapter(conf.get('mongodb:url'), { useNewUrlParser: true, useCreateIndex: true }),
    model: mongooseModel,
  };
};
