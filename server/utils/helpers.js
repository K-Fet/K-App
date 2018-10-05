const crypto = require('crypto');
const Joi = require('joi');

/**
 * Current school year.
 *
 * For school year 2017-2018, current year will be 2017
 */
function getCurrentSchoolYear() {
  const date = new Date();

  if (date.getMonth() < 7) {
    return date.getFullYear() - 1;
  }
  return date.getFullYear();
}

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

/**
 * This constant is used by Joi to validate query from a request.
 * It represent an object with a start end end date.
 *
 * @type {ObjectSchema} Joi schema
 */
const RANGE_SCHEMA = Joi.object({
  startAt: Joi.date().required(),
  endAt: Joi.date().greater(Joi.ref('startAt')).required(),
});

/**
 * This constant is used by Joi to validate query from a request.
 * It represent an object with a search query.
 * This query must contain at least 4 characters
 *
 * @type {ObjectSchema} Joi schema
 */
const SEARCH_SCHEMA = Joi.object({
  query: Joi.string().regex(/[a-z -]{4,}/i),
  active: Joi.boolean(),
});

/**
 * Helper to handle the common pattern where there is a code and an object
 * inside the body.
 *
 * Be careful as it will allow other props.
 *
 * @param prop {string} Property name
 * @param schema {ObjectSchema} Joi object schema
 * @returns {ObjectSchema} Joi schema
 */
function joiThrough(prop, schema) {
  return Joi.object({ [prop]: schema.required() }).unknown(true);
}

module.exports = {
  getCurrentSchoolYear,
  cleanObject,
  generateToken,
  joiThrough,
  ID_SCHEMA,
  RANGE_SCHEMA,
  SEARCH_SCHEMA,
};
