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

/**
 * Import one change from one entry from the FB webhooks.
 *
 * @param field
 * @param value
 * @param value.item
 * @param value.post_id
 * @param value.verb
 * @param value.createdTime
 * @param value.isHidden
 * @param value.message
 * @return {Promise<void>}
 */
async function importOneChange({ field, value }) {
  const { item, post_id, verb, created_time: createdTime, is_hidden: isHidden, message } = value;

}

/**
 * Import only one entry from facebook.
 *
 * @param changes {any[]} Changes of a post of the page
 * @return {Promise<void>}
 */
async function importOneFacebookItem({ changes }) {
  return Promise.all(changes.map(importOneChange));
}

/**
 * Import raw data from facebook webhooks.
 *
 * @param object {string} Type of the object
 * @param entry {any[]} FB entries
 * @return {Promise<*>}
 */
async function importWebhookEvent({ object, entry }) {
  logger.verbose(`Facebook feed received for '${object}'. Got ${entry.length} items`);

  return Promise.all(entry.map(importOneFacebookItem));
}

module.exports = {
  subscribeWebhook,
  importWebhookEvent,
};
