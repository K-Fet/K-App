const authService = require('../services/auth-service');
const barmanService = require('../services/barman-service');
const userService = require('../services/user-service');
const specialAccountService = require('../services/special-account-service');
const { createUserError } = require('../../utils');
const {
  Barman,
  SpecialAccount,
  ConnectionInformation,
  Kommission,
} = require('../models');
const { BarmanSchema, SpecialAccountSchema } = require('../models/schemas');
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
  const { user } = await authService.me(req.user.jit);

  if (user.specialAccount) {
    const schema = SpecialAccountSchema.min(1);
    const newSA = req.body.specialAccount;

    const { error } = schema.validate(newSA);
    if (error) throw createUserError('BadRequest', error.message);

    const { code } = req.body;

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
          },
        ],
      },
    );

    newSpecialAccount = await specialAccountService
      .updateSpecialAccountById(user.specialAccount.id, newSpecialAccount);

    res.json({
      specialAccount: newSpecialAccount,
      barman: undefined,
    });
  } else if (user.barman) {
    const schema = BarmanSchema
      .min(1);

    const newUser = req.body.barman;

    const { error } = schema.validate(newUser);
    if (error) throw createUserError('BadRequest', error.message);

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
          },
        ],
      },
    );

    newBarman = await barmanService.updateBarmanById(user.barman.id, newBarman, null);

    res.json({
      specialAccount: undefined,
      barman: newBarman,
    });
  }
}

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function getBarmanService(req, res) {
  const { startAt, endAt } = req.query;
  const services = await barmanService.getBarmanServices(req.barman.id, startAt, endAt);

  res.json(services);
}

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function addBarmanService(req, res) {
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
  const servicesId = req.body;

  await barmanService.deleteServiceBarman(req.barman.id, servicesId);

  res.send();
}

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function getBarmanTasks(req, res) {
  const tasks = await req.barman.getTasks({
    include: [
      {
        model: Kommission,
        as: 'kommission',
      },
      {
        model: Barman,
        as: 'barmen',
      },
    ],
  });
  res.json(tasks);
}

module.exports = {
  me,
  updateMe,
  getBarmanService,
  addBarmanService,
  removeBarmanService,
  getBarmanTasks,
};
