const logger = require('../../logger');
const sequelize = require('../../db');
const authService = require('./auth-service');
const mailService = require('./mail-service');
const { ConnectionInformation, SpecialAccount, Permission } = require('../models');
const { createUserError, createServerError, cleanObject, hash, setEmbeddedAssociations } = require('../../utils');

/**
 * Return all specialAccounts of the app
 *
 * @returns {Promise<Array>} SpecialAccount
 */
async function getAllSpecialAccounts() {

    logger.verbose('SpecialAccount service: get all specialAccounts');
    return SpecialAccount.findAll({
        attributes: { exclude: [ 'code' ] },
        include: [
            {
                model: ConnectionInformation,
                as: 'connection',
                attributes: [ 'id', 'username' ],
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

    logger.verbose('SpecialAccount service: creating a new SpecialAccount with username %s',
        newSpecialAccount.connection.username);

    const transaction = await sequelize.transaction();

    try {
        // We force the email to lowercase for multiple reasons:
        // 1. We can profit of the unique index of mysql
        // 2. It's easier to make request case sensitive than insensitive
        // 3. For most of providers (for us at least), it is treated the same
        //
        // But know that it's not really good as we can see here: https://stackoverflow.com/questions/9807909
        newSpecialAccount.connection.username = newSpecialAccount.connection.username.toLowerCase();

        newSpecialAccount.code = await hash(newSpecialAccount.code);

        const co = await newSpecialAccount.connection.save({ transaction });
        newSpecialAccount.connectionId = co.id;
        await newSpecialAccount.save({ transaction });

        await authService.resetPassword(co.username, transaction);
        // Remove critic fields
        newSpecialAccount.code = undefined;

    } catch (err) {
        if (err.userError) throw err;

        logger.verbose('SpecialAccount service: Error while creating specialAccount %o', err);
        await transaction.rollback();

        if (err.Errors === sequelize.SequelizeUniqueConstraintError) {
            throw createUserError('BadUsername', 'a username must be unique');
        }
        throw createServerError('ServerError', 'Error while creating special account');
    }

    if (_embedded) {
        for (const associationKey of Object.keys(_embedded)) {
            const value = _embedded[associationKey];

            await setEmbeddedAssociations(associationKey, value, newSpecialAccount, transaction, true);
        }
    }

    // Welcome email
    try {
        await mailService.sendWelcomeMail(newSpecialAccount.connection.username);
    } catch (err) {
        logger.error('Error while sending reset password mail at %s, %o', newSpecialAccount.connection.username, err);
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

    const specialAccount = await SpecialAccount.findById(specialAccountId, {
        include: [
            {
                model: ConnectionInformation,
                as: 'connection',
                attributes: [ 'id', 'username' ],
            },
            {
                model: Permission,
                as: 'permissions',
            },
        ],
        attributes: { exclude: [ 'code' ] },
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
    const currentSpecialAccount = await SpecialAccount.findById(specialAccountId, {
        include: [
            {
                model: ConnectionInformation,
                as: 'connection',
            },
        ],
    });

    if (!currentSpecialAccount) throw createUserError('UnknownSpecialAccount', 'This SpecialAccount does not exist');

    logger.verbose('SpecialAccount service: updating specialAccount named %s', currentSpecialAccount.connection.username);

    const transaction = await sequelize.transaction();

    try {
        await currentSpecialAccount.update(cleanObject({
            id: updatedSpecialAccount.id,
            code: updatedSpecialAccount.code ? await hash(updatedSpecialAccount.code) : undefined,
            description: updatedSpecialAccount.description,
        }), { transaction });

        if (updatedSpecialAccount.connection && updatedSpecialAccount.connection.username) {

            // We have to load old username
            const co = await currentSpecialAccount.getConnection();

            await authService.updateUsername(co.username, updatedSpecialAccount.connection.username);

            // Remove this association before reloading
            updatedSpecialAccount.connection = undefined;
        }
    } catch (err) {
        if (err.userError) throw err;

        logger.warn('SpecialAccount service: Error while updating special account', err);
        await transaction.rollback();
        throw createServerError('ServerError', 'Error while updating special account');

    }

    if (_embedded) {
        for (const associationKey of Object.keys(_embedded)) {
            const value = _embedded[associationKey];

            await setEmbeddedAssociations(associationKey, value, currentSpecialAccount, transaction);
        }
    }

    await transaction.commit();
    await currentSpecialAccount.reload();
    return currentSpecialAccount;
}

/**
 * Delete a SpecialAccount
 *
 * @param specialAccountId {number} SpecialAccount id
 * @return {Promise<SpecialAccount>} The deleted SpecialAccount
 */
async function deleteSpecialAccountById(specialAccountId) {

    logger.verbose('SpecialAccount service: deleting SpecialAccount with id %d', specialAccountId);

    const specialAccount = await SpecialAccount.findById(specialAccountId, {
        include: [
            {
                model: ConnectionInformation,
                as: 'connection',
            },
        ],
    });

    if (!specialAccount) throw createUserError('UnknownSpecialAccount', 'This SpecialAccount does not exist');

    const transaction = await sequelize.transaction();

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
