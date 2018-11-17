const { ServiceBroker } = require('moleculer');

const broker = new ServiceBroker();

async function start({ express }) {
  broker.loadService('./services');

  express.use('/api/v2', broker.getLocalService('api').express());

  await broker.start();
}

module.exports = {
  start,
};
