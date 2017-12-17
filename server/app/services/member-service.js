const logger = require('../../logger');
const { Member: Member } = require('../models/member');
const { createUserError } = require('../../utils');

/**
 * Return all members of the app.
 *
 * @returns {Promise<Array>} Members
 */
async function getAllMembers() {

    logger.verbose('Member service: get all members');
    return await Member.findAll();
}

/**
 * Create an member.
 *
 * @param newMember {Member} partial member
 * @return {Promise<Member|Errors.ValidationError>} The created member with its id
 */
async function createMember(newMember) {

    logger.verbose('Member service: creating a new member named %s %s', newMember.firstName, newMember.lastName);
    return await newMember.save();
}


/**
 * Get an member by its id.
 *
 * @param memberId {number} Member id
 * @return {Promise<Member>} The wanted member.
 */
async function getMemberById(memberId) {

    logger.verbose('Member service: get member by id %d', memberId);

    const member = await Member.findById(memberId);

    if (!member) throw createUserError('UnknownMember', 'This member does not exist');

    return member;
}


/**
 * Update an member.
 * This will copy only the allowed changes from the `updatedMember`
 * into the current member.
 * This means, with this function, you can not change everything like
 * the `createdAt` field or others.
 *
 * @param memberId {number} member id
 * @param updatedMember {Member} Updated member, constructed from the request.
 * @return {Promise<Member>} The updated member
 */
async function updateMember(memberId, updatedMember) {

    const currentMember = await Member.findById(memberId);

    if (!currentMember) throw createUserError('UnknownMember', 'This member does not exist');

    logger.verbose('Member service: updating member named %s %s', currentMember.firstName, currentMember.lastName);

    return await currentMember.update({
        email: updatedMember.email,
        firstName: updatedMember.firstName,
        lastName: updatedMember.lastName,
        school: updatedMember.school,
        active: updatedMember.active,
    });
}

/**
 * Delete an member.
 *
 * @param memberId {number} member id.
 * @return {Promise<Member>} The deleted member
 */
async function deleteMember(memberId) {

    logger.verbose('Member service: deleting member with id %d', memberId);

    const member = await Member.findById(memberId);

    if (!member) throw createUserError('UnknownMember', 'This member does not exist');

    await member.destroy();

    return member;
}


module.exports = {
    getAllMembers,
    createMember,
    updateMember,
    getMemberById,
    deleteMember
};
