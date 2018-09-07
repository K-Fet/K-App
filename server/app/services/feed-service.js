const rp = require('request-promise-native');
const conf = require('nconf');
const logger = require('../../logger');
const { createUserError } = require('../../utils');

/**
 * Send a request to subscribe to facebook webhooks.
 *
 * @returns {Promise.<void>} Nothing
 */
async function subscribeWebhook() {
  const options = {
    method: 'POST',
    url: `${conf.get('feed:baseApi')}/${conf.get('feed:appId')}/subscriptions`,
    qs: {
      object: 'page',
      callback_url: `${conf.get('web:publicUrl')}/api/feed/webhooks`,
      include_values: true,
      verify_token: conf.get('feed:verifyToken'),
      fields: [
        'feed',
      ].join(', '),
    },
    headers: {
      Authorization: `Bearer ${conf.get('feed:accessToken')}`,
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
 * @return {Promise<void>}
 */
async function _importChange({ field, value }) {
  logger.verbose(`Facebook feed received a ${field} update`);

  if (field !== 'feed') {
    logger.error(`Server received update for ${field} that it should not have received!`);
    throw createUserError('BadRequest', 'Could not handle this entry');
  }

  /* eslint-disable no-unused-vars */
  const {
    action,
    album_id: albumId,
    comment_id: commentId,
    created_time: createdTime,
    edited_time: editedTime,
    event_id: eventId,
    from,
    is_hidden: isHidden,
    item,
    link,
    message,
    parent_id: parentId,
    photo,
    photo_id: photoId,
    photo_ids: photoIds,
    photos,
    post,
    post_id: postId,
    published,
    reaction_type: reactionType,
    recipient_id: recipientId,
    share_id: shareId,
    verb,
    video,
    video_id: videoId,
  } = value;
  /* eslint-enable no-unused-vars */

  switch (verb) {
    case 'add': {
      break;
    }
    case 'block':
    case 'edit':
    case 'edited':
    case 'delete':
    case 'follow':
    case 'hide':
    case 'mute':
    case 'remove':
    case 'unblock':
    case 'unhide':
    case 'update':
      logger.warn(`Server does not implement ${verb} action for now`);
      break;
    default:
      logger.error(`Unrecognised verb from facebook webhooks: ${verb}`);
  }
}

/**
 * Import raw data from facebook webhooks.
 *
 * @param object {string} Type of the object
 * @param entry {array} FB entries
 * @return {Promise<*>}
 */
async function importWebhookEvent({ object, entry }) {
  logger.verbose(`Facebook feed received for '${object}'. Got ${entry.length} items`);

  // Each entry should is processed at the same time
  // But each changes of an entry is done one after another to have the right order
  return Promise.all(entry.map(({ changes }) => changes.reduce(
    (p, change) => p.then(_importChange(change)),
    Promise.resolve(),
  )));
}

module.exports = {
  subscribeWebhook,
  importWebhookEvent,
};
