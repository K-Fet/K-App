const memberService = require('../services/member-service');
const { Member } = require('../models/member');
const { checkStructure, createUserError } = require('../../utils');

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

    // FIXME We should check the type of each provided field, instead of just the presence
    if (!checkStructure(req.body, ['firstName', 'lastName', 'school'])) {
        throw createUserError(
            'BadRequest',
            'The body has missing properties, needed: [\'firstName\', \'lastName\', \'school\']'
        );
    }

    let newMember = new Member({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        school: req.body.school,
        active: req.body.active,
    });

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

    // FIXME We should check the type of each provided field, instead of just the presence
    if (!checkStructure(req.body, ['firstName', 'lastName', 'school'])) {
        throw createUserError(
            'BadRequest',
            'The body has missing properties, needed: [\'firstName\', \'lastName\', \'school\']'
        );
    }

    let newMember = new Member({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        school: req.body.school,
        active: req.body.active,
    });

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

