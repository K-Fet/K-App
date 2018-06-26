const feedService = require('../app/services/feed-service');
const FEED_CONFIG = require('../config/feed');
const logger = require('../logger');

async function start() {
  if (!FEED_CONFIG.accessToken) {
    logger.warn('Access token is not defined. Skipping facebook subscription');
    return;
  }
  await feedService.subscribeWebhook();
}


module.exports = {
  start,
};
