const crypto = require('crypto');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const { isBefore, parse } = require('date-fns');

/**
 * Current school year.
 *
 * For school year 2017-2018, current year will be 2017
 */
function getCurrentSchoolYear() {
  // Switch Year on July 15th
  const date = parse('15-07', 'dd-MM', new Date());

  if (isBefore(new Date(), date)) {
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
 * Flatten object.
 * Inspired of https://github.com/hughsk/flat
 *
 * @param target
 * @param opts
 */
function flatten(target, opts = {}) {
  const options = {
    delimiter: '.',
    ...opts,
  };
  const output = {};

  function step(object, prev, currentDepth = 1) {
    Object.keys(object).forEach((key) => {
      const value = object[key];
      const isarray = options.safe && Array.isArray(value);
      const type = Object.prototype.toString.call(value);
      const isobject = (type === '[object Object]' || type === '[object Array]');

      const newKey = prev
        ? prev + options.delimiter + key
        : key;

      if (!isarray && isobject && Object.keys(value).length && (!options.maxDepth || currentDepth < options.maxDepth)) {
        return step(value, newKey, currentDepth + 1);
      }

      output[newKey] = value;
      return undefined;
    });
  }

  step(target);
  return output;
}

/**
 * This constant is used by Joi to validate params from a request.
 * It represents an object with a single field id (an integer).
 *
 * @type {ObjectSchema} Joi schema
 */
const ID_SCHEMA = Joi.object({ id: Joi.number().integer().required() });

/**
 * This constant is used by Joi to validate query from a request.
 * It represents an object with a start and end date.
 *
 * @type {ObjectSchema} Joi schema
 */
const RANGE_SCHEMA = Joi.object({
  startAt: Joi.date().required(),
  endAt: Joi.date().greater(Joi.ref('startAt')).required(),
});

/**
 * This constant is used by Joi to validate query from a request.
 * It represent an object with a start end end year date.
 *
 * @type {ObjectSchema} Joi schema
 */
const YEAR_SCHEMA = Joi.object({
  startAt: Joi.number().min(2018).required(),
  endAt: Joi.number().greater(Joi.ref('startAt')).required(),
});

/**
 * This constant is used by Joi to validate query from a request.
 * It represent an object with a search query.
 * This query must contain at least 3 characters
 *
 * @type {ObjectSchema} Joi schema
 */
const SEARCH_SCHEMA = Joi.object({
  query: Joi.string().min(3),
  active: Joi.boolean(),
});

/**
 * This constant is used by Joi to validate a MongoDB id
 * @type {AlternativesSchema} Joi schema
 */
const MONGO_ID = Joi.alt(
  Joi.string().length(12),
  Joi.string().length(24).regex(new RegExp('^[0-9a-fA-F]{24}$')),
);

/**
 * This constant is used by Joi to validate a unit (inventory-management)
 * @type {StringSchema} Joi schema
 */
const UNIT_SCHEMA = Joi.string().min(1).max(3);

/**
 * This constant is used by Joi to validate and remove fields created by mongoose.
 * @type {Object} Partial Joi schema
 */
const MONGOOSE_INTERNALS = {
  createdAt: Joi.date().strip(),
  updatedAt: Joi.date().strip(),
  __v: Joi.number().integer(),
};


const JOI_ID = Joi.alt(
  Joi.string(),
  Joi.number(),
  Joi.array(),
);
const JOI_STRING_OR_STRING_ARRAY = Joi.alt(
  Joi.string(),
  Joi.array().items(Joi.string()),
);


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

/**
 * Group an array into a Map by a selected field.
 *
 * @see https://stackoverflow.com/a/38327540/5285167
 * @param list {any[]} List to group by
 * @param keyGetter {function} function called to select key
 * @return {Map<any, any[]>} A Map
 */
function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });

  return map;
}

function createSchema(schemaObj, options, { textIndex } = {}) {
  const schema = mongoose.Schema(schemaObj, options);

  if (Array.isArray(textIndex)) {
    schema.index(textIndex.reduce((o, field) => ({ ...o, [field]: 'text' }), {}));
  }

  return schema;
}

module.exports = {
  getCurrentSchoolYear,
  cleanObject,
  flatten,
  generateToken,
  joiThrough,
  groupBy,
  createSchema,
  ID_SCHEMA,
  RANGE_SCHEMA,
  MONGO_ID,
  YEAR_SCHEMA,
  UNIT_SCHEMA,
  SEARCH_SCHEMA,
  MONGOOSE_INTERNALS,
  JOI_ID,
  JOI_STRING_OR_STRING_ARRAY,
};
