const conf = require('nconf');
const logger = require('../logger');

async function start() {
  if (process.env.NODE_ENV === 'production') return;

  logger.info('Starting ngrok...');

  // eslint-disable-next-line import/no-extraneous-dependencies,global-require
  const ngrok = require('ngrok');
  const url = await ngrok.connect(process.env.PORT || 3000);
  conf.set('web:publicUrl', url);
  logger.info(`Back is live at ${url}`);
}


module.exports = {
  start,
};
