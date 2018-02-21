const specialAccountService = require('../services/specialAccount-service');
const { SpecialAccount } = require('../models');
const { SpecialAccountSchema } = require('../models/schemas');
const { createUserError } = require('../../utils');
const Joi = require('joi');

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
}

const { error } = schema.validate(req.body);
if (error) throw createUserError('BadRequest', error.details[0].message);

const newUser = req.body;

let newSpecialAccount = new SpecialAccount({
    code: newUser.code,
    description: newUser.description
});

newSpecialAccount = await specialAccountService.createSpecialAccount(newSpecialAccount, newUser.connection);

res.json(newSpecialAccount);


module.exports = {
    getAllSpecialAccounts
};