const WEB_CONFIG = require('../../config/web');
const FEED_CONFIG = require('../../config/feed');
const rp = require('request-promise-native');
const logger = require('../../logger');

/**
 * Send a request to subscribe to facebook webhooks.
 *
 * @returns {Promise.<void>} Nothing
 */
async function subscribeWebhook() {
  const options = {
    method: 'POST',
    url: `${FEED_CONFIG.baseApi}/${FEED_CONFIG.appId}/subscriptions`,
    qs: {
      object: 'page',
      callback_url: `${WEB_CONFIG.publicURL}/api/feed/webhooks`,
      include_values: true,
      verify_token: FEED_CONFIG.verifyToken,
      fields: [
        'feed',
      ].join(', '),
    },
    headers: {
      Authorization: `Bearer ${FEED_CONFIG.accessToken}`,
    },
    json: true,
  };

  try {
    const res = await rp(options);
    if (!res.success) {
      logger.warn('Feed service: received a negative response from facebook: %o', res);
    }
    // TODO Send mail in case of failure
  } catch (error) {
    logger.warn('Feed service: error while subscribing to app feed: %o', error.error);
  }
}

module.exports = {
  subscribeWebhook,
};
