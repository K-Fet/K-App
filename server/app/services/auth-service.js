const logger = require('../../logger');
const sequelize = require('../../db');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const uuidv4 = require('uuid/v4');
const EMAIL_CONFIG = require('../../config/mail');

const { jwtSecret, expirationDuration } = require('../../config/jwt');
const { verify, createUserError, createServerError, generateToken, hash } = require('../../utils');

const { ConnectionInformation, JWT, Barman, SpecialAccount, Kommission, Role, Permission } = require('../models');

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
 * Log a member and create a JWT Token.
 * The token will contain every
 * permissions given for the user.
 *
 * @param username Username used to login
 * @param password Unencrypted password
 * @returns {Promise<String>} JWT Signed token
 */
async function login(username, password) {

    const user = await ConnectionInformation.findOne({ where: { username } });

    if (!user) throw createUserError('LoginError', 'Bad username/password combination');

    if (!user.password) throw createUserError('UndefinedPassword', 'You must define password. Please, check your email.');

    if (user.emailToken) {
        throw createUserError('UnverifiedUsername', 'A valid email is required to use the app, you could change your ');
    }

    if (!await verify(user.password, password)) throw createUserError('LoginError', 'Bad username/password combination');

    if (user.passwordToken) {
        await user.update({ passwordToken: null });
    }

    delete user.password;
    delete user.emailToken;
    delete user.passwordToken;

    return createJWT(user);
}

/**
 * Refresh a token and revoked the old one.
 *
 * @param currentTokenId {String} Current token id
 * @returns {Promise<String>} The newly created token
 */
async function refresh(currentTokenId) {
    // Revoke old token
    const token = await logout(currentTokenId);

    // Get user to create a new token.
    // Here we don't really need transaction
    // because current token is already revoked
    const user = await token.getConnection();

    return createJWT(user);
}


/**
 * Create a new JWT including permissions.
 *
 * @param user {ConnectionInformation} User
 * @returns {Promise<String>} Return a JWT.
 */
async function createJWT(user) {

    // Sign with default (HMAC SHA256)
    const id = uuidv4();

    await user.createJwt({
        id,
    });

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
        // TODO permissions = barman.roles.reduce((a, b) => a.concat(b.permissions.map(p => p.name)));
        permissions = require('../../config/permissions').PERMISSION_LIST;
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
            throw createServerError('UnknownUser',
                'This user has no barman or special account linked, this should not exist!');
        }

        permissions = specialAccount.permissions.map(p => p.name);
    }

    logger.info(`Creating a new JWT ${user.id}, with permissions : ${permissions.join(', ')}`);

    return jwt.sign({
        jit: id,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * expirationDuration),
        permissions,
        userId: user.id,
    }, jwtSecret);
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

    const co = await token.getConnection({
        attributes: [],
        include: [
            {
                model: Barman,
                as: 'barman',
                include: [
                    {
                        model: ConnectionInformation,
                        as: 'connection',
                        attributes: [ 'id', 'username' ],
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
                attributes: { exclude: [ 'code' ] },
                include: [
                    {
                        model: ConnectionInformation,
                        as: 'connection',
                        attributes: [ 'id', 'username' ],
                    },
                ],
            },
        ],
    });

    if (!co) throw createServerError('UnknownUser', 'This token has no connection, this should not exist!');

    return co;
}


/**
 * Launch the procedure to reset the password of an user.
 *
 *
 * @param username {String} Username of the user
 * @param currTransaction {Object=} Transaction to use, it will no handle commit and rollback !
 * @returns {Promise<void>}
 */
async function resetPassword(username, currTransaction) {
    const transaction = currTransaction || await sequelize.transaction();

    const co = await ConnectionInformation.findOne({ where: { username }, transaction: currTransaction });

    if (!co) throw createUserError('UnknownUser', 'Unable to find provided username');

    if (co.emailToken) throw createUserError('UnverifiedUsername', 'A valid email is required to reset the password.');

    try {
        const passwordToken = await generateToken(256);

        await co.update({
            passwordToken: await hash(passwordToken)
        }, { transaction });

        const transporter = nodemailer.createTransport(EMAIL_CONFIG[ process.env.NODE_ENV || 'development' ]);


        // Setup email data with unicode symbols
        const mailOptions = {
            from: '"Fred Foo 👻" <foo@example.com>', // Sender address
            to: 'bar@example.com, baz@example.com', // List of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Hello world?', // Plain text body
            html: `<b>Hello world? ${passwordToken}</b>` // Html body
        };

        // Send mail with defined transport object
        const info = await transporter.sendMail(mailOptions);

    } catch (err) {
        logger.error('Error while creating reset password token %o', err);
        if (currTransaction) throw err;

        await transaction.rollback();
        throw createServerError('ServerError', 'Error while resetting password');
    }

    if (!currTransaction) await transaction.commit();
}


module.exports = {
    isTokenRevoked,
    login,
    refresh,
    logout,
    me,
    createJWT,
    resetPassword,
};
