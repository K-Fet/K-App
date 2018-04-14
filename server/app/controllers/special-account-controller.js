const specialAccountService = require('../services/special-account-service');
const { SpecialAccount, ConnectionInformation } = require('../models');
const { SpecialAccountSchema } = require('../models/schemas');
const { createUserError } = require('../../utils');

/**
 * Fetch all SpecialAccount from the database
 *
 * @param req Request
 * @param res Response
 * @return {Promise<void>} Nothing
 */
async function getAllSpecialAccounts(req, res) {
    const specialAccount = await specialAccountService.getAllSpecialAccounts();

    res.json(specialAccount);
}

/**
 * Create a SpecialAccount
 *
 * @param req Request
 * @param res Response
 * @return {Promise<void>} Nothing
 */
async function createSpecialAccount(req, res) {
    const schema = SpecialAccountSchema.requiredKeys(
        'code',
        'connection',
        'connection.username',
    );

    const { error } = schema.validate(req.body.specialAccount);
    if (error) throw createUserError('BadRequest', error.message);

    const newAccount = req.body.specialAccount;

    let newSpecialAccount = new SpecialAccount(
        {
            ...newAccount,
            _embedded: undefined,  // Remove the only external object
        },
        {
            include: [
                {
                    model: ConnectionInformation,
                    as: 'connection'
                }
            ]
        }
    );

    newSpecialAccount = await specialAccountService.createSpecialAccount(newSpecialAccount, newAccount._embedded);

    res.json(newSpecialAccount);
}

/**
 * Get a SpecialAccount by its id
 *
 * @param req Request
 * @param res Response
 * @return {Promise<void>} Nothing
 */
async function getSpecialAccountById(req, res) {
    const specialAccountId = req.params.id;

    const specialAccount = await specialAccountService.getSpecialAccountById(specialAccountId);

    res.json(specialAccount);
}

/**
 * Update a SpecialAccount.
 *
 * @param req Request
 * @param res Response
 * @return {Promise<void>} Nothing
 */
async function updateSpecialAccount(req, res) {
    const schema = SpecialAccountSchema.min(1);
    const newUser = req.body.specialAccount;

    const { error } = schema.validate(newUser);
    if (error) throw createUserError('BadRequest', error.message);

    let newSpecialAccount = new SpecialAccount(
        {
            ...newUser,
            _embedded: undefined
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

    const specialAccountId = req.params.id;

    newSpecialAccount = await specialAccountService.updateSpecialAccountById(specialAccountId,
        newSpecialAccount, newUser._embedded);

    res.json(newSpecialAccount);
}

/**
 * Delete a SpecialAccount
 *
 * @param req Request
 * @param res Response
 * @return {Promise<void>} Nothing
 */
async function deleteSpecialAccount(req, res) {
    const specialAccountId = req.params.id;

    const specialAccount = await specialAccountService.deleteSpecialAccountById(specialAccountId);

    res.json(specialAccount);
}

module.exports = {
    getAllSpecialAccounts,
    createSpecialAccount,
    getSpecialAccountById,
    updateSpecialAccount,
    deleteSpecialAccount
};
