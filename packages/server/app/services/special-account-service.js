const logger = require('../../logger');
const { sequelize } = require('../../bootstrap/sequelize');
const authService = require('./auth-service');
const mailService = require('./mail-service');
const { ConnectionInformation, SpecialAccount, Permission } = require('../models');
const {
  createUserError, createServerError, cleanObject, hash, setAssociations,
} = require('../../utils');

/**
 * Return all specialAccounts of the app
 *
 * @returns {Promise<Array>} SpecialAccount
 */
async function getAllSpecialAccounts() {
  logger.verbose('SpecialAccount service: get all specialAccounts');
  return SpecialAccount.findAll({
    attributes: { exclude: ['code'] },
    include: [
      {
        model: ConnectionInformation,
        as: 'connection',
        attributes: ['id', 'email'],
      },
    ],
  });
}

/**
 * Create a SpecialAccount.
 *
 * @param newSpecialAccount {SpecialAccount} partial specialAccount
 * @param _embedded Embedded associations of a special account
 * @return {Promise<SpecialAccount>} The created SpecialAccount with its id
 */
async function createSpecialAccount(newSpecialAccount, _embedded) {
  logger.verbose(
    'SpecialAccount service: creating a new SpecialAccount with email %s',
    newSpecialAccount.connection.email,
  );

  const transaction = await sequelize().transaction();

  try {
    // We force the email to lowercase for multiple reasons:
    // 1. We can profit of the unique index of mysql
    // 2. It's easier to make request case sensitive than insensitive
    // 3. For most of providers (for us at least), it is treated the same
    //
    // But know that it's not really good as we can see here: https://stackoverflow.com/questions/9807909
    /* eslint-disable no-param-reassign */
    newSpecialAccount.connection.email = newSpecialAccount.connection.email.toLowerCase();

    newSpecialAccount.code = await hash(newSpecialAccount.code);

    const co = await newSpecialAccount.connection.save({ transaction });
    newSpecialAccount.connectionId = co.id;
    await newSpecialAccount.save({ transaction });

    await authService.resetPassword(co.email, transaction);
    // Remove critic fields
    newSpecialAccount.code = undefined;
    /* eslint-enable no-param-reassign */
  } catch (err) {
    if (err.userError) throw err;

    logger.verbose('SpecialAccount service: Error while creating specialAccount %o', err);
    await transaction.rollback();

    if (err.Errors === sequelize().SequelizeUniqueConstraintError) {
      throw createUserError('BadEmail', 'a email must be unique');
    }
    throw createServerError('ServerError', 'Error while creating special account');
  }

  await setAssociations(_embedded, newSpecialAccount, null, transaction, true);

  // Welcome email
  try {
    await mailService.sendWelcomeMail(newSpecialAccount.connection.email);
  } catch (err) {
    logger.error('Error while sending reset password mail at %s, %o', newSpecialAccount.connection.email, err);
    throw createUserError('MailerError', 'Unable to send email to the provided address');
  }

  await transaction.commit();
  return newSpecialAccount;
}

/**
 * Get a SpecialAccount by his id.
 * @param specialAccountId {number} SpecialAccount Id
 * @returns {Promise<SpecialAccount>} SpecialAccount
 */
async function getSpecialAccountById(specialAccountId) {
  logger.verbose('specialAccount service: get a specialAccount by his id %d', specialAccountId);

  const specialAccount = await SpecialAccount.findByPk(specialAccountId, {
    include: [
      {
        model: ConnectionInformation,
        as: 'connection',
        attributes: ['id', 'email'],
      },
      {
        model: Permission,
        as: 'permissions',
      },
    ],
    attributes: { exclude: ['code'] },
  });

  if (!specialAccount) throw createUserError('UnknownSpecialAccount', 'This SpecialAccount does not exist');
  return specialAccount;
}

/**
 * Update a specialAccount
 *
 * @param specialAccountId {number} specialAccount id
 * @param updatedSpecialAccount {SpecialAccount} Updated SpecialAccount, constructed from the request.
 * @param _embedded Associations links to update
 * @return {Promise<SpecialAccount>} the updated special account
 */
async function updateSpecialAccountById(specialAccountId, updatedSpecialAccount, _embedded) {
  const currentSpecialAccount = await SpecialAccount.findByPk(specialAccountId, {
    include: [
      {
        model: ConnectionInformation,
        as: 'connection',
      },
    ],
  });

  if (!currentSpecialAccount) throw createUserError('UnknownSpecialAccount', 'This SpecialAccount does not exist');

  logger.verbose('SpecialAccount service: updating specialAccount named %s', currentSpecialAccount.connection.email);

  const transaction = await sequelize().transaction();

  try {
    await currentSpecialAccount.update(cleanObject({
      id: updatedSpecialAccount.id,
      code: updatedSpecialAccount.code ? await hash(updatedSpecialAccount.code) : undefined,
      description: updatedSpecialAccount.description,
    }), { transaction });

    if (updatedSpecialAccount.connection && updatedSpecialAccount.connection.email) {
      // We have to load old email
      const co = await currentSpecialAccount.getConnection();

      await authService.updateEmail(co.email, updatedSpecialAccount.connection.email);
    }
  } catch (err) {
    if (err.userError) throw err;

    logger.warn('SpecialAccount service: Error while updating special account', err);
    await transaction.rollback();
    throw createServerError('ServerError', 'Error while updating special account');
  }

  await setAssociations(_embedded, currentSpecialAccount, null, transaction, true);

  await transaction.commit();
  return currentSpecialAccount.reload();
}

/**
 * Delete a SpecialAccount
 *
 * @param specialAccountId {number} SpecialAccount id
 * @return {Promise<SpecialAccount>} The deleted SpecialAccount
 */
async function deleteSpecialAccountById(specialAccountId) {
  logger.verbose('SpecialAccount service: deleting SpecialAccount with id %d', specialAccountId);

  const specialAccount = await SpecialAccount.findByPk(specialAccountId, {
    include: [
      {
        model: ConnectionInformation,
        as: 'connection',
      },
    ],
  });

  if (!specialAccount) throw createUserError('UnknownSpecialAccount', 'This SpecialAccount does not exist');

  const transaction = await sequelize().transaction();

  try {
    await specialAccount.connection.destroy();
    await specialAccount.destroy();
  } catch (err) {
    await transaction.rollback();
  }

  return specialAccount;
}

module.exports = {
  getAllSpecialAccounts,
  createSpecialAccount,
  getSpecialAccountById,
  deleteSpecialAccountById,
  updateSpecialAccountById,
};
