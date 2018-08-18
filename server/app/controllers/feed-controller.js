const { createUserError } = require('../../utils');
const feedService = require('../services/feed-service');

/**
 * Webhook entry
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function feedWebhooks(req, res) {
  if (!req.isXHub) throw createUserError('BadRequest', 'No X-Hub Signature');
  if (!req.isXHubValid()) throw createUserError('BadRequest', 'Invalid X-Hub Request');

  await feedService.importWebhookEvent(req.body);
  res.sendStatus(200);
}

/**
 * Facebook webhooks check
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function facebookVerify(req, res) {
  res.send(req.query['hub.challenge']);
}

module.exports = {
  feedWebhooks,
  facebookVerify,
};
