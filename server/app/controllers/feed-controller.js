const Joi = require('joi');
const { createUserError } = require('../../utils');
const FEED_CONFIG = require('../../config/feed');
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
  const schema = Joi.object().keys({
    'hub.mode': Joi.string().equal('subscribe').required(),
    'hub.challenge': Joi.string().required(),
    'hub.verify_token': Joi.equal(FEED_CONFIG.verifyToken),
  }).required();

  const { error } = schema.validate(req.query);
  if (error) throw createUserError('BadRequest', error.message);

  res.send(req.query['hub.challenge']);
}

module.exports = {
  feedWebhooks,
  facebookVerify,
};
