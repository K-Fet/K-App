const authService = require('../services/auth-service');
const barmanService = require('../services/barman-service');
const userService = require('../services/user-service');
const specialAccountService = require('../services/special-account-service');
const { createUserError, parseStartAndEnd } = require('../../utils');
const { Barman, SpecialAccount, ConnectionInformation } = require('../models');
const { BarmanSchema, SpecialAccountSchema } = require('../models/schemas');
const Joi = require('joi');
const logger = require('../../logger');

/**
 * Send information about the connected user.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<{ barman: Barman, specialAccount: SpecialAccount}>} The connected user's information
 */
async function me(req, res) {
    const user = await authService.me(req.user.jit);

    res.send(user);
}

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function updateMe(req, res) {
    const user = await authService.me(req.user.jit);

    if (user.specialAccount) {
        const schema = SpecialAccountSchema.min(1);
        const newSA = req.body.specialAccount;

        const { error } = schema.validate(newSA);
        if (error) throw createUserError('BadRequest', error.message);

        const code = req.body.code;

        if (!code) {
            throw createUserError('BadRequest', 'body.code is missing');
        }

        if (!await userService.checkCode(req.user.userId, code)) {
            throw createUserError('CodeError', 'The code provided is wrong');
        }

        logger.info(`Secure action at ${req.method} ${req.originalUrl} done by user id ${req.user.userId}`);

        let newSpecialAccount = new SpecialAccount(
            {
                ...newSA,
                _embedded: undefined, // Remove the only external object
            },
            {
                include: [
                    {
                        model: ConnectionInformation,
                        as: 'connection',
                    }
                ]
            }
        );

        newSpecialAccount = await specialAccountService
            .updateSpecialAccountById(user.specialAccount.id, newSpecialAccount);

        res.json({ specialAccount: newSpecialAccount, barman: undefined });
    }
    if (user.barman) {
        const schema = BarmanSchema.min(1);
        const newUser = req.body.barman;

        const { error } = schema.validate(newUser);
        if (error) throw createUserError('BadRequest', error.message);

        if (newUser.barman.active) throw createUserError('BadRequest', 'Active field is not allowed throw PUT /me');

        let newBarman = new Barman(
            {
                ...newUser,
                _embedded: undefined, // Remove the only external object
            },
            {
                include: [
                    {
                        model: ConnectionInformation,
                        as: 'connection',
                    }
                ]
            }
        );

        newBarman = await barmanService.updateBarmanById(user.barman.id, newBarman);

        res.json({ specialAccount: undefined, barman: newBarman });
    }
}

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function getBarmanService(req, res) {


    const { start, end } = parseStartAndEnd(req.query);
    const services = await barmanService.getBarmanServices(req.barman.id, start, end);

    res.json(services);
}

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function addBarmanService(req, res) {
    const schema = Joi.array().items(Joi.number().integer().required()).required();

    const { error } = schema.validate(req.body);
    if (error) throw createUserError('BadRequest', error.message);

    if (!req.barman.active) throw createUserError('NotActive', 'Provided barman is not an active barman');
    const servicesId = req.body;

    await barmanService.createServiceBarman(req.barman.id, servicesId);

    res.send();
}

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function removeBarmanService(req, res) {
    const schema = Joi.array().items(Joi.number().integer().required()).required();

    const { error } = schema.validate(req.body);
    if (error) throw createUserError('BadRequest', error.message);

    if (!req.barman.active) throw createUserError('NotActive', 'Provided barman is not an active barman');
    const servicesId = req.body;

    await barmanService.deleteServiceBarman(req.barman.id, servicesId);

    res.send();
}


module.exports = {
    me,
    updateMe,
    getBarmanService,
    addBarmanService,
    removeBarmanService,
};
