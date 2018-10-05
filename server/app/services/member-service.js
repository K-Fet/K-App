const Sequelize = require('sequelize');
const logger = require('../../logger');
const { Member, Registration } = require('../models/');
const { createUserError, createServerError, getCurrentSchoolYear } = require('../../utils');
const { sequelize } = require('../../bootstrap/sequelize');

const { Op } = Sequelize;

/**
 * Register a member for a new year.
 *
 * It uses the current school year (the beginning of the year)
 * @param memberId Member id
 * @param transaction Optional transaction
 * @return {Promise<*>}
 */
async function registerMember(memberId, transaction) {
  const member = await Member.findById(memberId, { transaction });

  if (!member) throw createUserError('UnknownMember', 'This member does not exist');

  const year = getCurrentSchoolYear();

  const registrations = await member.getRegistrations({ where: { year }, transaction });

  if (registrations.length > 0) {
    throw createUserError('MemberAlreadyRegistered', `Member was already registered for ${year}-${year + 1}`);
  }

  logger.verbose('Member service: Register member with id %d for year %d', memberId, year);
  return member.createRegistration({ year }, { transaction });
}

/**
 * Unregister a member for a specific year.
 *
 * @param memberId Member id
 * @param year Year to unregister
 * @return {Promise<void>}
 */
async function unregisterMember(memberId, year) {
  const member = await Member.findById(memberId);

  if (!member) throw createUserError('UnknownMember', 'This member does not exist');

  const registrations = await member.getRegistrations({ where: { year } });

  if (registrations.length === 0) {
    throw createUserError('MemberNotRegistered', `Member is not registered for ${year}-${year + 1}`);
  }

  logger.verbose('Member service: Unregister member with id %d for year %d', memberId, year);
  await registrations[0].destroy();

  return registrations[0];
}

/**
 * Return all members of the app.
 *
 * @returns {Promise<Array>} Members
 */
async function getAllMembers({ startAt = getCurrentSchoolYear(), endAt = getCurrentSchoolYear() }) {
  logger.verbose('Member service: get all members between %s and %s', startAt, endAt + 1);
  return Member.findAll({
    order: [
      ['lastName', 'ASC'],
      [{ model: Registration, as: 'registrations' }, 'year', 'DESC'],
    ],
    include: [
      {
        model: Registration,
        as: 'registrations',
        required: true,
        attributes: ['year', 'createdAt'],
        where: {
          year: {
            [Op.gte]: startAt,
            [Op.lte]: endAt,
          },
        },
      },
    ],
  });
}

/**
 * Create an member.
 *
 * @param newMember {Member} partial member
 * @return {Promise<Member|Errors.ValidationError>} The created member with its id
 */
async function createMember(newMember) {
  const transaction = await sequelize().transaction();
  logger.verbose('Member service: creating a new member named %s %s', newMember.firstName, newMember.lastName);
  try {
    await newMember.save({ transaction });

    await registerMember(newMember.id, transaction);
  } catch (e) {
    logger.warn('Member service: Error while creating member', newMember);
    await transaction.rollback();
    throw createServerError('ServerError', 'Error while creating member');
  }

  await transaction.commit();

  return newMember.reload({
    order: [
      [{ model: Registration, as: 'registrations' }, 'year', 'DESC'],
    ],
    include: [{
      model: Registration,
      as: 'registrations',
      attributes: ['year', 'createdAt'],
    }],
  });
}


/**
 * Get an member by its id.
 *
 * @param memberId {number} Member id
 * @return {Promise<Member>} The wanted member.
 */
async function getMemberById(memberId) {
  logger.verbose('Member service: get member by id %d', memberId);

  const member = await Member.findById(memberId, {
    order: [
      [{ model: Registration, as: 'registrations' }, 'year', 'DESC'],
    ],
    include: [{
      model: Registration,
      as: 'registrations',
      attributes: ['year', 'createdAt'],
    }],
  });

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

  await currentMember.update({
    firstName: updatedMember.firstName,
    lastName: updatedMember.lastName,
    school: updatedMember.school,
  });

  return currentMember.reload({
    order: [
      [{ model: Registration, as: 'registrations' }, 'year', 'DESC'],
    ],
    include: [{
      model: Registration,
      as: 'registrations',
      attributes: ['year', 'createdAt'],
    }],
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

  const member = await Member.findById(memberId, {
    order: [
      [{ model: Registration, as: 'registrations' }, 'year', 'DESC'],
    ],
    include: [{
      model: Registration,
      as: 'registrations',
      attributes: ['year', 'createdAt'],
    }],
  });

  if (!member) throw createUserError('UnknownMember', 'This member does not exist');

  await member.destroy();

  return member;
}

/**
 * Search members which match query parameter in all database.
 *
 * @param query {string} query.
 * @return {Promise<Member[]>} Members which match the query
 */
async function searchMembers(query) {
  logger.verbose('Member service: searching members with query %s', query);
  const where = Sequelize.where(
    Sequelize.fn('concat', Sequelize.col('firstName'), ' ', Sequelize.col('lastName')),
    'like',
    `%${query}%`,
  );
  const members = await Member.findAll({
    where,
    include: [{
      model: Registration,
      as: 'registrations',
      attributes: ['year', 'createdAt'],
    }],
  });

  return members;
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
