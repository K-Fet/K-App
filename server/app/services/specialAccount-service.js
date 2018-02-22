const logger = require('../../logger');
const sequelize = require('../../db');
const { ConnectionInformation, SpecialAccount } = require('../models');
const { createUserError, createServerError, cleanObject, hash } = require('../../utils');

/**
 * Return all specialAccounts of the app
 * 
 * @returns {Promise<Array>} SpecialAccount
 */
async function getAllSpecialAccounts() {

    logger.verbose('SpecialAccount service: get all specialAccounts');
    return await SpecialAccount.findAll();
}

/**
 * Create a SpecialAccount.
 * 
 * @param newSpecialAccount {SpecialAccount} partial specialAccount
 * @param connection {Object} Object containing connection informations.
 * @return {Promise<SpecialAccount} The created SpecialAccount with its id
 */
async function createSpecialAccount(newSpecialAccount, connection) {

    logger.verbose('SpecialAccount service: creating a new SpecialAccount code: %s ', newSpecialAccount.code);

    const transaction = await sequelize.transaction();
    try {
        await newSpecialAccount.save({ transaction });

        const coData = {
            username: connection.username,
            password: await hash(connection.password)
        };
        await newSpecialAccount.createConnection(cleanObject(coData), { transaction });
    } catch (err) {
        logger.warn('SpecialAccount service: Error while creating specialAccount', err);
        await transaction.rollback();
        throw createServerError('ServerError', 'Error while creating a specialAccount');
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
                attributes: [ 'id', 'username' ]
            }
        ]
    });

    if(!specialAccount) throw createUserError('UnknownSpecialAccount', 'This SpecialAccount does not exist');
    return specialAccount;
}

/**
 * Update a specialAccount
 * 
 * @param specialAccountId {number} specialAccount id
 * @param updatedSpecialAccount {SpecialAccount} Updated SpecialAccount, constructed from the request.
 * @return {Promise<SpecialAccount>} the updated special account
 */
async function updateSpecialAccountById(specialAccountId, updatedSpecialAccount) {
    const currentSpecialAccount = await SpecialAccount.findById(specialAccountId);

    if (!currentSpecialAccount) throw createUserError('UnknownSpecialAccount', 'This SpecialAccount does not exist');

    logger.verbose('SpecialAccount service: updating specialAccount named %s', currentSpecialAccount.name);

    const transaction = await sequelize.transaction();

    try {
        await currentSpecialAccount.update(cleanObject({
            id: updatedSpecialAccount.id,
            code: updatedSpecialAccount.code,
            description: updatedSpecialAccount.description
        }), { transaction });

        // If connection information is changed
        if (updatedSpecialAccount.connection) {
            const co = await currentSpecialAccount.getConnection();

            const coData = {
                username: updatedSpecialAccount.connection.username,
                password: await hash(updatedSpecialAccount.connection.password)
            };
            
            // If there is no connection yet, create one
            if (!co) {
                await currentSpecialAccount.createConnection(cleanObject(coData), { transaction });
            } else {
                await co.update(cleanObject(coData), { transaction });
            }
        }
    } catch (err) {
        logger.warn('SpecialAccount service: Error while updating SpecialAccount', err);
        await transaction.rollback();
        throw createServerError('ServerError', 'Error while updating SpecialAccount');
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

    const specialAccount = await SpecialAccount.findById(specialAccountId);

    if(!specialAccount) throw createUserError('UnknownSpecialAccount', 'This SpecialAccount does not exist');

    await specialAccount.destroy();

    return specialAccount;
}

module.exports = {
    getAllSpecialAccounts,
    createSpecialAccount,
    getSpecialAccountById,
    deleteSpecialAccountById,
    updateSpecialAccountById
};