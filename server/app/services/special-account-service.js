const logger = require('../../logger');
const sequelize = require('../../db');
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
        attributes: { exclude: ['code'] },
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
        newSpecialAccount.connection.password = await hash(newSpecialAccount.connection.password);
        newSpecialAccount.code = await hash(newSpecialAccount.code);


        const co = await newSpecialAccount.connection.save({ transaction });
        newSpecialAccount.connectionId = co.id;
        await newSpecialAccount.save({ transaction });

        // Remove critic fields
        newSpecialAccount.code = undefined;
        co.password = undefined;

    } catch (err) {
        logger.verbose('SpecialAccount service: Error while creating specialAccount %o', err);
        await transaction.rollback();
        throw createServerError('ServerError', 'Error while creating a specialAccount');
    }

    if (_embedded) {
        for (const associationKey of Object.keys(_embedded)) {
            const value = _embedded[associationKey];

            await setEmbeddedAssociations(associationKey, value, newSpecialAccount, transaction, true);
        }
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
                attributes: ['id', 'username']
            },
            {
                model: Permission,
                as: 'permissions',
            }
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
    const currentSpecialAccount = await SpecialAccount.findById(specialAccountId);

    if (!currentSpecialAccount) throw createUserError('UnknownSpecialAccount', 'This SpecialAccount does not exist');

    logger.verbose('SpecialAccount service: updating specialAccount named %s', currentSpecialAccount.connection.username);

    const transaction = await sequelize.transaction();

    try {
        await currentSpecialAccount.update(cleanObject({
            id: updatedSpecialAccount.id,
            code: updatedSpecialAccount.code ? await hash(updatedSpecialAccount.code) : undefined,
            description: updatedSpecialAccount.description
        }), { transaction });

        const updateCo = updatedSpecialAccount.connection;

        // If connection information is changed
        if (updateCo) {
            const co = await currentSpecialAccount.getConnection();
            await co.update(
                cleanObject({
                    username: updateCo.username,
                    password: await hash(updateCo.password)
                }),
                { transaction }
            );
        }
    } catch (err) {
        logger.warn('SpecialAccount service: Error while updating SpecialAccount', err);
        await transaction.rollback();
        throw createServerError('ServerError', 'Error while updating SpecialAccount');
    }

    if (_embedded) {
        for (const associationKey of Object.keys(_embedded)) {
            const value = _embedded[associationKey];

            await setEmbeddedAssociations(associationKey, value, currentSpecialAccount, transaction);
        }
    }

    await transaction.commit();
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
            }
        ]
    });

    if (!specialAccount) throw createUserError('UnknownSpecialAccount', 'This SpecialAccount does not exist');

    const transaction = sequelize.transaction();

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
    updateSpecialAccountById
};
