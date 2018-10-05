const memberService = require('../services/member-service');
const { Member } = require('../models');

/**
 * Fetch all the members from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAllMembers(req, res) {
  const members = await memberService.getAllMembers(req.query);

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
  let newMember = new Member(req.body);

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
  let newMember = new Member(req.body);

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

/**
 * Register a member for a new year.
 *
 * @param req Request
 * @param res Response
 * @return {Promise<void>} Registration
 */
async function registerMember(req, res) {
  const memberId = req.params.id;

  const registration = await memberService.registerMember(memberId);

  res.json(registration);
}

/**
 * Unregister a member for a specific year.
 *
 * @param req Request
 * @param res Response
 * @return {Promise<void>} Nothing
 */
async function unregisterMember(req, res) {
  const { id: memberId, year } = req.params;

  const registration = await memberService.unregisterMember(memberId, year);

  res.send(registration);
}

/**
 * Search a member in all database
 *
 * @param req Request
 * @param res Response
 * @return {Promise<void>} Nothing
 */
async function searchMembers(req, res) {
  const members = await memberService.searchMembers(req.query.q);

  res.send(members);
}

module.exports = {
  getAllMembers,
  createMember,
  updateMember,
  getMemberById,
  deleteMember,
  registerMember,
  unregisterMember,
  searchMembers,
};
