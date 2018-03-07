const memberService = require('../services/member-service');
const { Member } = require('../models');
const { MemberSchema } = require('../models/schemas');
const { createUserError } = require('../../utils');

/**
 * Fetch all the members from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAllMembers(req, res) {
    const members = await memberService.getAllMembers();

    res.json(members);
}

/**
 * Create a member.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function createMember(req, res) {
    const reqMember = req.body.member;
    const schema = MemberSchema.requiredKeys(
        'firstName',
        'lastName'
    );

    const { error } = schema.validate(reqMember);
    if (error) throw createUserError('BadRequest', error.details.message);

    let newMember = new Member(reqMember);

    newMember = await memberService.createMember(newMember);

    res.json(newMember);
}


/**
 * Get a member by its id.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getMemberById(req, res) {
    const memberId = req.params.id;

    const member = await memberService.getMemberById(memberId);

    res.json(member);
}


/**
 * Update a member.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function updateMember(req, res) {
    const reqMember = req.body.member;
    const schema = MemberSchema.min(1);

    const { error } = schema.validate(reqMember);
    if (error) throw createUserError('BadRequest', error.details[0].message);

    let newMember = new Member(reqMember);

    const memberId = req.params.id;

    newMember = await memberService.updateMember(memberId, newMember);

    res.json(newMember);
}

/**
 * Delete a member.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function deleteMember(req, res) {
    const memberId = req.params.id;

    const member = await memberService.deleteMember(memberId);

    res.json(member);
}


module.exports = {
    getAllMembers,
    createMember,
    updateMember,
    getMemberById,
    deleteMember
};
