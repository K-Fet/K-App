const crypto = require('crypto');
const Joi = require('joi');
const { createUserError } = require('./errors');

/**
 * Clean an object by removing 'undefined' fields.
 *
 * Needed because sequelize does not make difference between null and undefined
 * (see https://github.com/sequelize/sequelize/issues/7056).
 *
 * @param obj Object to clean
 * @return {*} The object cleaned
 */
function cleanObject(obj) {
  // eslint-disable-next-line no-param-reassign
  Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
  return obj;
}

/**
 * Parse start and end date from query.
 *
 * Will throw if one is missing and if start > end
 *
 * @param query
 * @returns {{start: Date, end: Date}}
 */
function parseStartAndEnd(query) {
  if (!query.start || !query.end) {
    throw createUserError('BadRequest', '\'start\' & \'end\' query parameters are required');
  }

  const start = new Date(+query.start);
  const end = new Date(+query.end);

  if (start > end) {
    throw createUserError('BadRequest', '\'start\' parameter must be inferior to \'end\' parameter');
  }

  return {
    start,
    end,
  };
}

/**
 * Generate a secure token.
 *
 * @param stringBase base of the generated token
 * @param byteLength Number of bytes to generate
 * @returns {Promise<string>} Secure token
 */
function generateToken(byteLength = 48, stringBase = 'base64') {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(byteLength, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString(stringBase));
      }
    });
  });
}

/**
 * This constant is used by Joi to validate params from a request.
 * It represent an object with a single field id (an integer).
 *
 * @type {ObjectSchema} Joi schema
 */
const ID_SCHEMA = Joi.object({ id: Joi.number().integer().required() });

module.exports = {
  cleanObject,
  parseStartAndEnd,
  generateToken,
  ID_SCHEMA,
};
