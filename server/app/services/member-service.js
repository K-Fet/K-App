const winston = require('winston');
const MemberDAO = require('../dao/member-dao');

const memberDAO = new MemberDAO();

/**
 * Return all members of the app.
 *
 * @returns {Promise<void>} Members
 */
async function getAllMembers() {
    await memberDAO.init();

    winston.info('Member service: get all members');
    const members = memberDAO.findAll();

    memberDAO.end();
    return members;
}

module.exports = {
    getAllMembers
};
