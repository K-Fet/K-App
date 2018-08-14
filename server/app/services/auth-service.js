const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
const logger = require('../../logger');
const { sequelize } = require('../../bootstrap/sequelize');
const { jwtSecret } = require('../../config/jwt');
const {
  verify, createUserError, createServerError, generateToken, hash,
} = require('../../utils');
const {
  ConnectionInformation, JWT, Barman, SpecialAccount, Kommission, Role, Permission,
} = require('../models');
const mailService = require('./mail-service');

/**
 * Check if a token is revoked or not.
 *
 * @param tokenId {String} JIT
 * @returns {Promise<Boolean>} Return true if the token does not exist or is revoked
 */
async function isTokenRevoked(tokenId) {
  logger.info('Auth service: is token revoked');

  const token = await JWT.findById(tokenId);

  return !token || token.revoked;
}


/**
 * Create a new JWT including permissions.
 *
 * @param user {ConnectionInformation} User
 * @param rememberMe {Number} Number of day for jwt expiration
 * @returns {Promise<String>} Return a JWT.
 */
async function createJWT(user, rememberMe) {
  // Sign with default (HMAC SHA256)
  const id = uuidv4();

  await user.createJwt({
    id,
  });

  logger.info(`Creating a new JWT ${user.id}`);

  const exp = Math.floor(Date.now() / 1000) + (86400 * rememberMe); // Check JS doc for rememberMe unit
  return jwt.sign({
    jit: id,
    exp,
    userId: user.id,
  }, jwtSecret);
}

/**
 * Return the user permission
 *
 * @param user {ConnectionInformation} User
 * @returns {Promise<Array<Permission>>} Return an array of Permission.
 */
async function getPermissions(user) {
  const barman = await user.getBarman({
    include: [
      {
        model: Role,
        as: 'roles',
        include: [
          {
            model: Permission,
            as: 'permissions',
          },
        ],
      },
    ],
  });

  let permissions = [];

  if (barman) {
    permissions = [...new Set(barman.roles.reduce((a, b) => a.concat(b.permissions.map(p => p.name)), []))];
  } else {
    const specialAccount = await user.getSpecialAccount({
      include: [
        {
          model: Permission,
          as: 'permissions',
        },
      ],
    });
    if (!specialAccount) {
      throw createServerError(
        'UnknownUser',
        'This user has no barman or special account linked, this should not exist!',
      );
    }

    permissions = specialAccount.permissions.map(p => p.name);
  }

  return permissions;
}

/**
 * Log a member and create a JWT Token.
 * The token will contain every
 * permissions given for the user.
 *
 * @param usernameDirty Username used to login (dirty is because it can contain upper letters)
 * @param password Unencrypted password
 * @param rememberMe {Number} NUmber of day for jwt expiration
 * @returns {Promise<String>} JWT Signed token
 */
async function login(usernameDirty, password, rememberMe) {
  const username = usernameDirty.toLowerCase();

  const user = await ConnectionInformation.findOne({ where: { username } });

  if (!user) throw createUserError('LoginError', 'Bad username/password combination');

  if (!user.password) throw createUserError('UndefinedPassword', 'You must define password. Please, check your email.');

  if (user.usernameToken) {
    throw createUserError('UnverifiedUsername', 'A valid email is required to use the app, you could change your ');
  }

  if (!await verify(user.password, password)) throw createUserError('LoginError', 'Bad username/password combination');

  if (user.passwordToken) {
    await user.update({ passwordToken: null });
  }

  delete user.password;
  delete user.usernameToken;
  delete user.passwordToken;

  return createJWT(user, rememberMe);
}


/**
 * Logout a member by revoking his token.
 *
 * @param tokenId Token's JIT
 * @return {Promise<JWT>} The deleted token
 * @throws An error if the token could not be find.
 */
async function logout(tokenId) {
  const token = await JWT.findById(tokenId);

  if (!token) throw createUserError('LogoutError', 'This token does not exist');

  await token.update({ revoked: true });

  return token;
}


/**
 * Logout a member by revoking his token.
 *
 * @param tokenId Token's JIT
 * @return {Promise<Connection>} The deleted token
 * @throws An error if the token could not be find.
 */
async function me(tokenId) {
  const token = await JWT.findById(tokenId);
  if (!token) throw createUserError('UnknownUser', 'This token does not exist');

  const user = await token.getConnection({
    include: [
      {
        model: Barman,
        as: 'barman',
        include: [
          {
            model: ConnectionInformation,
            as: 'connection',
            attributes: ['id', 'username'],
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
      },
      {
        model: SpecialAccount,
        as: 'specialAccount',
        attributes: { exclude: ['code'] },
        include: [
          {
            model: ConnectionInformation,
            as: 'connection',
            attributes: ['id', 'username'],
          },
        ],
      },
    ],
  });

  if (!user) throw createServerError('UnknownUser', 'This token has no connection, this should not exist!');

  const permissions = await getPermissions(user);

  delete user.password;
  delete user.usernameToken;
  delete user.passwordToken;

  return {
    user,
    permissions,
  };
}


/**
 * Launch the procedure to reset the password of an user.
 *
 *
 * @param usernameDirty {String} Username of the user (dirty because it can contain upper letters)
 * @param currTransaction {Object=} Transaction to use, it will no handle commit and rollback !
 * @returns {Promise<void>}
 */
async function resetPassword(usernameDirty, currTransaction) {
  const username = usernameDirty.toLowerCase();
  const transaction = currTransaction || await sequelize().transaction();

  const co = await ConnectionInformation.findOne({
    where: { username },
    transaction: currTransaction,
  });

  if (!co) {
    await transaction.rollback();
    throw createUserError('UnknownUser', 'Unable to find provided username');
  }

  if (co.usernameToken) {
    await transaction.rollback();
    throw createUserError('UnverifiedUsername', 'A valid email is required to reset the password.');
  }

  const passwordToken = await generateToken(128);

  try {
    await co.update({
      passwordToken: await hash(passwordToken),
    }, { transaction });
  } catch (err) {
    logger.error('Error while creating reset password token %o', err);

    // Do not rollback if the parent sent a transaction AND we generate a ServerError
    if (currTransaction) throw err;

    await transaction.rollback();
    throw createServerError('ServerError', 'Error while resetting password');
  }

  try {
    await mailService.sendPasswordResetMail(username, passwordToken);
  } catch (err) {
    logger.error('Error while sending reset password mail at %s, %o', username, err);

    await transaction.rollback();
    throw createUserError('MailerError', 'Unable to send email to the provided address');
  }

  if (!currTransaction) await transaction.commit();
}

/**
 * Define a new password for an user.
 * Will reject all existing JWT.
 *
 * @param usernameDirty {String} User's login (dirty because it can contain upper letters)
 * @param passwordToken {String} Token received by the user
 * @param newPassword {String} New password
 * @param oldPassword {String} Old password (only if !passwordToken)
 * @returns {Promise<void>} Nothing
 */
async function definePassword(usernameDirty, passwordToken, newPassword, oldPassword) {
  const username = usernameDirty.toLowerCase();
  const user = await ConnectionInformation.findOne({ where: { username } });

  if (!user) throw createUserError('UnknownUser', 'Unable to find provided username');

  if (passwordToken) {
    if (!user.passwordToken) {
      throw createUserError('NoPasswordToken', 'passwordToken database value is null for the provided user');
    }
    if (!await verify(user.passwordToken, passwordToken)) {
      throw createUserError('UnknownPasswordToken', 'Provided password token has not been found for this user');
    }
  } else if (oldPassword) {
    if (!await verify(user.password, oldPassword)) {
      throw createUserError('LoginError', 'Bad username/password combination');
    }
  } else {
    throw createServerError('ServerError', 'Missing parameter');
  }

  if (user.usernameToken) {
    throw createUserError(
      'UnverifiedUsername',
      'A verified email is required, if you can not gain access to your account, contact an administrator',
    );
  }

  const transaction = await sequelize().transaction();
  try {
    await user.update({
      password: await hash(newPassword),
      passwordToken: null,
    }, { transaction });

    await JWT.update({ revoked: true }, {
      transaction,
      where: {
        connectionId: user.id,
      },
    });
    await mailService.sendPasswordUpdate(username);
  } catch (e) {
    logger.warn('AuthService: Error while defining password: %o', e);
    await transaction.rollback();
  }

  await transaction.commit();
}

/**
 * Change username for a user. Need to be verified.
 *
 * @param currentUsername {String} User's login
 * @param newUsername {String} new user's login
 * @returns {Promise<void>} Nothing
 */
async function updateUsername(currentUsername, newUsername) {
  const co = await ConnectionInformation.findOne({
    where: {
      username: currentUsername.toLowerCase(),
    },
  });

  if (!co) throw createUserError('UnknownUser', 'This User does not exist');

  if (co.passwordToken) {
    throw createUserError('UndefinedPassword', 'You must define a password. Please, check your email.');
  }

  const usernameToken = await generateToken(128);

  const transaction = await sequelize().transaction();

  try {
    await co.update({
      usernameToken: await hash(usernameToken + newUsername),
    }, { transaction });
  } catch (err) {
    logger.error('Error while creating username token %o', err);
    await transaction.rollback();
    throw createServerError('ServerError', 'Error while change username');
  }

  try {
    await mailService.sendVerifyUsernameMail(newUsername, usernameToken, co.id);
    await mailService.sendUsernameUpdateInformationMail(currentUsername, newUsername, co.id);
  } catch (err) {
    logger.error('Error while sending reset password mail at %s or %s, %o', currentUsername, newUsername, err);
    transaction.rollback();
    throw createUserError('MailerError', 'Unable to send email to the provided address');
  }

  await transaction.commit();
}

/**
 * Verify a new username request.
 *
 * @param userId {Number} user id
 * @param username {String} User's login
 * @param password {String} new user's login
 * @param usernameToken {String} Username token
 * @returns {Promise<void>} Nothing
 */
async function usernameVerify(userId, username, password, usernameToken) {
  const co = await ConnectionInformation.findById(userId);

  if (!co
    || !await verify(co.password, password)
    || !await verify(co.usernameToken, usernameToken + username)
  ) {
    throw createUserError('VerificationError', 'Bad token/password/new email combination.');
  }

  const transaction = await sequelize().transaction();

  try {
    await co.update({
      // We force the email to lowercase for multiple reasons:
      // 1. We can profit of the unique index of mysql
      // 2. It's easier to make request case sensitive than insensitive
      // 3. For most of providers (for us at least), it is treated the same
      //
      // But know that it's not really good as we can see here: https://stackoverflow.com/questions/9807909
      username: username.toLowerCase(),
      usernameToken: null,
    }, { transaction });

    // Revoke all current JWTs

    await JWT.update({ revoked: true }, {
      transaction,
      where: {
        connectionId: co.id,
      },
    });
  } catch (err) {
    logger.error('Error while creating username token %o', err);
    await transaction.rollback();
    throw createServerError('ServerError', 'Error while change username');
  }

  try {
    await mailService.sendUsernameConfirmation(username);
  } catch (err) {
    logger.error('Error while sending a confirmation for username update for %s, %o', username, err);
    transaction.rollback();
    throw createUserError('MailerError', 'Unable to send email to the provided address');
  }

  await transaction.commit();
}

/**
 * Cancel a username update request.
 *
 * @param userId {Number} user id
 * @param username {String} User's login
 * @returns {Promise<void>} Nothing
 */
async function cancelUsernameUpdate(userId, username) {
  const co = await ConnectionInformation.findById(userId);

  if (!co) {
    throw createUserError('VerificationError', 'No user found for this user id.');
  }

  const transaction = await sequelize().transaction();

  try {
    await co.update({
      usernameToken: null,
    }, { transaction });
  } catch (err) {
    logger.error('Error while creating cancel username update for %s %o', username, err);
    await transaction.rollback();
    throw createServerError('ServerError', 'Error while change username');
  }

  try {
    await mailService.sendCancelUsernameConfirmation(username);
  } catch (err) {
    logger.error('Error while sending a confirmation for username update for %s, %o', username, err);
    transaction.rollback();
    throw createUserError('MailerError', 'Unable to send email to the provided address');
  }

  await transaction.commit();
}


module.exports = {
  isTokenRevoked,
  login,
  logout,
  me,
  createJWT,
  resetPassword,
  definePassword,
  updateUsername,
  usernameVerify,
  cancelUsernameUpdate,
  getPermissions,
};
