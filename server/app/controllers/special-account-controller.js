const specialAccountService = require('../services/special-account-service');
const permissionService = require('../services/permission-service');
const { createPermissionError } = require('../../utils');
const { SpecialAccount, ConnectionInformation } = require('../models');

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
  const newAccount = req.body.specialAccount;

  let newSpecialAccount = new SpecialAccount(
    {
      ...newAccount,
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

  if (newAccount._embedded) {
    await permissionService.hasEnoughPermissions(req.user.permissions, newAccount._embedded.permissions);
  }

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
  const newUser = req.body.specialAccount;

  if (newUser.code && !req.user.permissions.include('specialaccount:force-code-reset')) {
    throw createPermissionError();
  }

  let newSpecialAccount = new SpecialAccount(
    {
      ...newUser,
      _embedded: undefined,
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

  const specialAccountId = req.params.id;

  if (newUser._embedded) {
    await permissionService.hasEnoughPermissions(req.user.permissions, newUser._embedded.permissions);
  }

  newSpecialAccount = await specialAccountService.updateSpecialAccountById(
    specialAccountId,
    newSpecialAccount, newUser._embedded,
  );

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
  deleteSpecialAccount,
};
