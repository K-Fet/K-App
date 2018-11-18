const path = require('path');
const { ServiceBroker, Logger } = require('moleculer');
const JoiValidator = require('./utils/joi.validator');
const logger = require('../logger');

const broker = new ServiceBroker({
  logger: () => Logger.extend(logger),
  validation: true,
  validator: new JoiValidator(),
});

async function start({ expressApp, apiPath }) {
  broker.loadServices(path.join(__dirname, 'services'));

  expressApp.use(apiPath, broker.getLocalService('api').express());

  await broker.start();
}

module.exports = {
  start,
};
