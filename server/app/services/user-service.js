const logger = require('../../logger');
const { User } = require('../models/user');
const { createUserError } = require('../../utils');

/**
 * Return all users of the app.
 *
 * @returns {Promise<Array>} Users
 */
async function getAllUsers() {

    logger.verbose('User service: get all users');
    return await User.findAll();
}

/**
 * Create an user.
 *
 * @param newUser {User} partial user
 * @return {Promise<User|Errors.ValidationError>} The created user with its id
 */
async function createUser(newUser) {

    logger.verbose('User service: creating a new user named %s %s', newUser.firstName, newUser.lastName);
    return await newUser.save();
}


/**
 * Get an user by its id.
 *
 * @param userId {number} User id
 * @return {Promise<User>} The wanted user.
 */
async function getUserById(userId) {

    logger.verbose('User service: get user by id %d', userId);

    const user = await User.findById(userId);

    if (!user) throw createUserError('UnknownUser', 'This user does not exist');

    return user;
}


/**
 * Update an user.
 * This will copy only the allowed changes from the `updatedUser`
 * into the current user.
 * This means, with this function, you can not change everything like
 * the `createdAt` field or others.
 *
 * @param userId {number} user id
 * @param updatedUser {User} Updated user, constructed from the request.
 * @return {Promise<User>} The updated user
 */
async function updateUser(userId, updatedUser) {

    const currentUser = await User.findById(userId);

    if (!currentUser) throw createUserError('UnknownUser', 'This user does not exist');

    logger.verbose('User service: updating user named %s %s', currentUser.firstName, currentUser.lastName);

    return await currentUser.update({
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        school: updatedUser.school,
        active: updatedUser.active,
    });
}

/**
 * Delete an user.
 *
 * @param userId {number} user id.
 * @return {Promise<User>} The deleted user
 */
async function deleteUser(userId) {

    logger.verbose('User service: deleting user with id %d', userId);

    const user = await User.findById(userId);

    if (!user) throw createUserError('UnknownUser', 'This user does not exist');

    await user.destroy();

    return user;
}


module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    getUserById,
    deleteUser
};
