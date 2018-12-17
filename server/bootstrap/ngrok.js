const conf = require('nconf');
const logger = require('../logger');

async function start() {
  if (process.env.NODE_ENV === 'production') return;

  logger.info('Starting ngrok...');

  const port = conf.get('web:port');
  let url = `http://localhost:${port}`;

  try {
    // eslint-disable-next-line import/no-extraneous-dependencies,global-require
    const ngrok = require('ngrok');
    url = await ngrok.connect(port);
    logger.info(`Back is live at ${url}`);
  } catch (e) {
    logger.warn(`Couldn't load ngrok, back is only live at ${url}`);
  }

  conf.set('web:publicUrl', url);
}


module.exports = {
  start,
};
