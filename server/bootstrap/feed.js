const conf = require('nconf');
const feedService = require('../app/services/feed-service');
const logger = require('../logger');

async function start() {
  const accessToken = conf.get('feed:accessToken');
  if (!accessToken) {
    logger.warn('Access token is not defined. Skipping facebook subscription');
    return;
  }

  conf.set('feed:appId', accessToken.split('|')[0]);
  await feedService.subscribeWebhook();
}


module.exports = {
  start,
};
