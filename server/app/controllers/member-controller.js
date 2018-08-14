const Joi = require('joi');
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
  const filters = req.query;
  const schema = Joi.object().keys({
    startAt: Joi.number().integer(),
    endAt: Joi.number().integer(),
  });

  const { error } = schema.validate(filters);
  if (error) throw createUserError('BadRequest', error.message);

  const members = await memberService.getAllMembers(filters);

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
    'lastName',
  );

  const { error } = schema.validate(reqMember);
  if (error) throw createUserError('BadRequest', error.message);

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
  if (error) throw createUserError('BadRequest', error.message);

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


module.exports = {
  getAllMembers,
  createMember,
  updateMember,
  getMemberById,
  deleteMember,
  registerMember,
  unregisterMember,
};
