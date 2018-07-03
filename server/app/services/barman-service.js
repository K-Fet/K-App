const logger = require('../../logger');
const { sequelize } = require('../../bootstrap/sequelize');
const { Op } = require('sequelize');
const {
  ConnectionInformation, Barman, Kommission, Role, Service,
} = require('../models');
const {
  createUserError, createServerError, cleanObject, setAssociations,
} = require('../../utils');
const authService = require('./auth-service');
const mailService = require('./mail-service');

/**
 * Return all barmen of the app.
 *
 * @returns {Promise<Array>} Barmen
 */
async function getAllBarmen() {
  logger.verbose('Barman service: get all barmen');
  return Barman.findAll({
    order: [
      ['nickname', 'ASC'],
    ],
  });
}

/**
 * Create a Barman.
 *
 * @param newBarman {Barman} partial member
 * @param _embedded {Object} Object containing associations to update, see swagger for more information.
 * @return {Promise<Barman>} The created barman with its id
 */
async function createBarman(newBarman, _embedded) {
  logger.verbose('Barman service: creating a new barman named %s %s', newBarman.firstName, newBarman.lastName);

  const transaction = await sequelize.transaction();
  try {
    // We force the email to lowercase for multiple reasons:
    // 1. We can profit of the unique index of mysql
    // 2. It's easier to make request case sensitive than insensitive
    // 3. For most of providers (for us at least), it is treated the same
    //
    // But know that it's not really good as we can see here: https://stackoverflow.com/questions/9807909

    // eslint-disable-next-line no-param-reassign
    newBarman.connection.username = newBarman.connection.username.toLowerCase();

    const co = await newBarman.connection.save({ transaction });
    // eslint-disable-next-line no-param-reassign
    newBarman.connectionId = co.id;
    await newBarman.save({ transaction });

    await authService.resetPassword(co.username, transaction);
  } catch (err) {
    if (err.userError) throw err;

    await transaction.rollback();
    logger.warn('Barman service: Error while creating barman %o', err);

    if (err.Errors === sequelize.SequelizeUniqueConstraintError) {
      throw createUserError('BadUsername', 'a username must be unique');
    }

    throw createServerError('ServerError', 'Error while creating barman');
  }

  // Associations
  await setAssociations(_embedded, newBarman, { godFather: Barman }, transaction, true);

  // Welcome email
  try {
    await mailService.sendWelcomeMail(newBarman.connection.username);
  } catch (err) {
    await transaction.rollback();
    logger.error('Error while sending welcome mail at %s, %o', newBarman.connection.username, err);
    throw createUserError('MailerError', 'Unable to send email to the provided address');
  }

  await transaction.commit();
  return newBarman;
}

/**
 * Get a Barman by his id.
 * @param barmanId {number} Barman Id
 * @returns {Promise<Barman>} Barmen
 */
async function getBarmanById(barmanId) {
  logger.verbose('Barman service: get a barman by his id %d', barmanId);

  const barman = await Barman.findById(barmanId, {
    include: [
      {
        model: ConnectionInformation,
        as: 'connection',
        attributes: ['id', 'username'],
      },
      {
        model: Barman,
        as: 'godFather',
      },
      {
        model: Kommission,
        as: 'kommissions',
      },
      {
        model: Role,
        as: 'roles',
      },
    ],
  });

  if (!barman) throw createUserError('UnknownBarman', 'This Barman does not exist');

  return barman;
}

/**
 * Update a barman
 * This will copy only the allowed changes from the `updatedBarman`
 * into the current barman.
 * This means, with this function, you can not change everything like
 * the `createdAt` field or others.
 *
 * @param barmanId {number} barman id
 * @param updatedBarman {Barman} Updated barman, constructed from the request.
 * @param _embedded {Object} Object containing associations to update, see swagger for more information.
 * @return {Promise<Barman>} The updated barman
 */
async function updateBarmanById(barmanId, updatedBarman, _embedded) {
  const currentBarman = await Barman.findById(barmanId, {
    include: [
      {
        model: Kommission,
        as: 'kommissions',
      },
      {
        model: Role,
        as: 'roles',
      },
    ],
  });

  if (!currentBarman) throw createUserError('UnknownBarman', 'This Barman does not exist');

  logger.verbose('Barman service: updating barman named %s %s', currentBarman.firstName, currentBarman.lastName);

  const transaction = await sequelize.transaction();

  try {
    await currentBarman.update(cleanObject({
      firstName: updatedBarman.firstName,
      lastName: updatedBarman.lastName,
      nickname: updatedBarman.nickname,
      facebook: updatedBarman.facebook,
      dateOfBirth: updatedBarman.dateOfBirth,
      flow: updatedBarman.flow,
      active: updatedBarman.active,
    }), { transaction });

    // If connection information is changed
    if (updatedBarman.connection && updatedBarman.connection.username) {
      // We have to load old username
      const co = await currentBarman.getConnection();

      await authService.updateUsername(co.username, updatedBarman.connection.username);
    }
  } catch (err) {
    if (err.userError) throw err;

    logger.warn('Barman service: Error while updating barman', err);
    await transaction.rollback();
    throw createServerError('ServerError', 'Error while updating barman');
  }

  // Associations
  if (_embedded && _embedded.godFather && _embedded.godFather === currentBarman.id) {
    await transaction.rollback();
    throw createUserError('PickHimself', 'Try to pick himself as his gofFather');
  }

  await setAssociations(_embedded, currentBarman, { godFather: Barman }, transaction);


  await transaction.commit();
  return currentBarman.reload();
}

/**
 * Delete a Barman.
 *
 * @param barmanId {number} barman id
 * @returns {Promise<Barman>} The deleted barman
 */
async function deleteBarmanById(barmanId) {
  logger.verbose('Barman service: deleting member with id %d', barmanId);

  const barman = await Barman.findById(barmanId, {
    include: [
      {
        model: ConnectionInformation,
        as: 'connection',
        attributes: ['id', 'username'],
      },
    ],
  });

  if (!barman) throw createUserError('UnknownBarman', 'This Barman does not exist');

  const transaction = await sequelize.transaction();
  // FIXME even wih paranoid = false it doesn't work normally with CASCADE DELETE
  // because it should be the other way, here when we delete a connection information,
  // it deletes on cascade a barman. But when we delete a barman it doesn't delete a connection information on cascade
  // I try to use a hook (like a trigger) to delete but too complicated, i didn't manage to do it
  try {
    await barman.connection.destroy({ transaction });
    await barman.destroy({ transaction });
  } catch (err) {
    logger.warn('Barman service: Error while deleting barman', err);
    await transaction.rollback();
    throw createServerError('ServerError', 'Error while deleting barman');
  }
  await transaction.commit();
  return barman;
}

/**
 * Get the services of a barman
 *
 * @param barmanId {number} barman id
 * @param startDate {Date} starting date for services
 * @param endDate {Date} ending date for services
 * @returns {Promise<Array>} Barmen's services
 */
async function getBarmanServices(barmanId, startDate, endDate) {
  logger.verbose('Barman service: retreive services of the barman ', barmanId);

  const barman = await Barman.findById(barmanId);

  if (!barman) throw createUserError('UnknownBarman', 'This Barman does not exist');

  if (!barman.active) throw createUserError('BadRequest', 'Barman must be an active barman');

  return barman.getServices({
    where: {
      startAt: {
        [Op.gte]: startDate,
      },
      endAt: {
        [Op.lte]: endDate,
      },
    },
    include: [
      {
        model: Barman,
        as: 'barmen',
      },
    ],
  });
}

/**
 * Create a service for a barman
 *
 * @param barmanId {number} barman id
 * @param servicesId {Array<number>} service ids
 * @returns {Promise<Errors.ValidationError>} an error or nothing
 */
async function createServiceBarman(barmanId, servicesId) {
  logger.verbose('Barman service: create a Service for the barman ', barmanId, servicesId);

  const barman = await Barman.findById(barmanId);

  if (!barman) throw createUserError('UnknownBarman', 'This Barman does not exist');

  if (!barman.active) throw createUserError('BadRequest', 'Barman must be an active barman');


  const count = await Service.count({
    where: {
      id: {
        [Op.in]: servicesId,
      },
      endAt: {
        [Op.gt]: Date.now(),
      },
    },
  });

  if (count !== servicesId.length) {
    throw createUserError('TooOldEvent', 'You cannot edit services that are already pasted');
  }

  try {
    await barman.addService(servicesId);
  } catch (err) {
    throw createUserError('UnknownServices', 'Unable to associate barman with provided services');
  }
}

/**
 * Delete a Service of a barman
 *
 * @param barmanId {number} barman id
 * @param servicesId {number} service id
 *
 * @returns {Promise<Errors.ValidationError>} an error or nothing
 */
async function deleteServiceBarman(barmanId, servicesId) {
  logger.verbose('Barman service: delete a Service for the barman ', barmanId, servicesId);

  const barman = await Barman.findById(barmanId);

  if (!barman) throw createUserError('UnknownBarman', 'This Barman does not exist');

  if (!barman.active) throw createUserError('BadRequest', 'Barman must be an active barman');

  const count = await Service.count({
    where: {
      id: {
        [Op.in]: servicesId,
      },
      endAt: {
        [Op.gt]: Date.now(),
      },
    },
  });

  if (count !== servicesId.length) {
    throw createUserError('TooOldEvent', 'You cannot edit services that are already pasted');
  }

  try {
    await barman.removeServices(servicesId);
  } catch (err) {
    throw createUserError('UnknownServices', 'Unable to associate barman with provided services');
  }
}

module.exports = {
  getAllBarmen,
  createBarman,
  getBarmanById,
  deleteBarmanById,
  updateBarmanById,
  getBarmanServices,
  createServiceBarman,
  deleteServiceBarman,
};
