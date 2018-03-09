const authService = require('../services/auth-service');
const barmanService = require('../services/barman-service');
const specialAccountService = require('../services/special-account-service');
const { createUserError } = require('../../utils');
const { Barman, SpecialAccount, ConnectionInformation } = require('../models');
const { BarmanSchema, SpecialAccountSchema } = require('../models/schemas');
const Joi = require('joi');

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
        const newSA = req.body;

        const { error } = schema.validate(newSA);
        if (error) throw createUserError('BadRequest', error.details[0].message);

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

        newSpecialAccount = await specialAccountService.updateSpecialAccountById(user.specialAccount.id,
            newSpecialAccount, newSA._embedded);

        res.json(newSpecialAccount);
    }
    if (user.barman) {
        const schema = BarmanSchema.min(1);
        const newUser = req.body;

        const { error } = schema.validate(newUser);
        if (error) throw createUserError('BadRequest', error.details[0].message);

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

        newBarman = await barmanService.updateBarmanById(user.barman.id, newBarman, newUser._embedded);

        res.json(newBarman);
    }
}

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function getBarmanService(req, res) {

    let startDate;
    let endDate;

    if (req.query.start && req.query.end) {
        // The transformation of the DATE in ISO format is in UTC hence we add one hour to correspond to UTC+1
        // I use a + to convert the param from string to int
        startDate = new Date(+req.query.start + (1 * 60 * 60 * 1000));
        endDate = new Date(+req.query.end + (1 * 60 * 60 * 1000));
        startDate = startDate.toISOString();
        endDate = endDate.toISOString();
    } else {
        throw createUserError('BadRequest', '\'start\' & \'end\' query parameters are required');
    }

    const services = await barmanService.getBarmanServices(req.barman.id, startDate, endDate);

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
    if (error) throw createUserError('BadRequest', 'The body is missing properties');

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
    if (error) throw createUserError('BadRequest', 'The body is missing properties');

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
