const Joi = require('joi');
const { createUserError } = require('../../utils');
const logger = require('../../logger');
const FEED_CONFIG = require('../../config/feed');

/**
 * Webhook entry
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function feedWebhooks(req, res) {
  logger.info('Facebook feed:', req.body);

  res.send();
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
