const Joi = require('joi');
const { createUserError } = require('../../utils');


/**
 * Webhook entry
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function feedWebhooks(req, res) {

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
        // eslint-disable-next-line
        'hub.verify_token': Joi.string().required(), // TODO Check the verification token
    }).required();

    const { error } = schema.validate(req.query);
    if (error) throw createUserError('BadRequest', error.message);

    res.send(req.query['hub.challenge']);
}

module.exports = {
    feedWebhooks,
    facebookVerify,
};
