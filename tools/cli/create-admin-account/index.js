const inquirer = require('inquirer');
const Joi = require('joi');
const crypto = require('crypto');
const { checkEnv, getSequelizeInstance } = require('../utils');
const { hash } = require('../../../server/utils/password-manager');
const { initModel } = require('../../../server/bootstrap/sequelize');
const { start: syncPermissions } = require('../../../server/bootstrap/permissions');
const { ConnectionInformation, SpecialAccount, Permission } = require('../../../server/app/models');
const { PERMISSION_LIST } = require('../../../server/app/constants');

async function checkExistingAdminAccount() {
  const specialAccounts = await SpecialAccount.findAll({
    include: [
      {
        model: ConnectionInformation,
        as: 'connection',
      },
      {
        model: Permission,
        as: 'permissions',
      },
    ],
  });

  const admins = specialAccounts.filter(s => PERMISSION_LIST.length === s.permissions.length);

  admins.forEach(s => console.log(`[create-admin-account] Found admin account (email: ${s.connection.email})`));

  return admins.length;
}

async function creationSetup() {
  const questions = [
    {
      type: 'input',
      name: 'email',
      message: '[create-admin-account] Email?',
      valid: input => Joi.validate(input, Joi.string().email(), { presence: 'required' }),
    },
    {
      type: 'password',
      name: 'password',
      message: '[create-admin-account] Password? leave blank to generate one (recommended on prod)',
    },
    {
      type: 'input',
      name: 'code',
      message: '[create-admin-account] Admin code?',
      valid: input => !!input,
    },
  ];

  const { email, password, code } = await inquirer.prompt(questions);

  let finalPassword = password;

  if (!password) {
    console.log('[create-admin-account] No password was provided, generating one:');
    finalPassword = crypto.randomBytes(10).toString('hex');
    console.log(`[create-admin-account] Generated password: ${finalPassword}`);
  }

  return {
    code: await hash(code),
    description: 'Administrator',
    connection: {
      password: await hash(finalPassword),
      email,
    },
  };
}

async function doCreation(admin, sequelize) {
  const transaction = await sequelize.transaction();

  // eslint-disable-next-line no-param-reassign
  admin.connection.email = admin.connection.email.toLowerCase();

  const co = await ConnectionInformation.create(admin.connection, { transaction });
  // eslint-disable-next-line no-param-reassign
  admin.connectionId = co.id;

  const newAdmin = await SpecialAccount.create(admin, { transaction });

  const allPerms = await Permission.findAll();
  await newAdmin.setPermissions(allPerms, { transaction });

  await transaction.commit();
}

async function run() {
  checkEnv(
    'DB__HOST',
    'DB__USERNAME',
    'DB__PASSWORD',
    'DB__DATABASE',
  );

  console.log('[create-admin-account] Creating sequelize instance');
  const sequelize = await getSequelizeInstance();
  initModel(sequelize);
  await sequelize.sync();
  await syncPermissions({ skipAdminUpgrade: true });
  console.log('[create-admin-account] Sequelize is now fully loaded');

  console.log('[create-admin-account] Checking already existing admin accounts');
  const adminCount = await checkExistingAdminAccount();

  if (adminCount) {
    const { continueCreation } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueCreation',
        message: 'Already existing admin accounts found, continue?',
        default: false,
      },
    ]);
    if (!continueCreation) return;
  }
  console.log('[create-admin-account] Creating admin account');
  const newAdmin = await creationSetup();
  await doCreation(newAdmin, sequelize);

  console.log('[create-admin-account] Admin account created');
}

module.exports = {
  run,
};
