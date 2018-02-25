const specialAccountService = require('../services/specialAccount-service');
const { SpecialAccount } = require('../models');
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
        'connection.password'
    );


    const { error } = schema.validate(req.body);
    if (error) throw createUserError('BadRequest', error.details[0].message);

    const newUser = req.body;

    let newSpecialAccount = new SpecialAccount({
        code: newUser.code,
        description: newUser.description
    });

    newSpecialAccount = await specialAccountService.createSpecialAccount(newSpecialAccount, newUser.connection);

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
    const newUser = req.body;

    const { error } = schema.validate(newUser);
    if (error) throw createUserError('BadRequest', error.details[0].message );

    let newSpecialAccount = new SpecialAccount({
        ...newUser
    });
    
    const specialAccountId = req.param.id;

    newSpecialAccount = await specialAccountService.updateSpecialAccountById(specialAccountId, newSpecialAccount);

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
