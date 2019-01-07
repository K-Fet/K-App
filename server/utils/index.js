const am = require('./async-middleware');
const { createUserError, createServerError, createPermissionError } = require('./errors');
const { verify, hash } = require('./password-manager');
const { setAssociations } = require('./associations');
const {
  getCurrentSchoolYear, cleanObject, generateToken,
  ID_SCHEMA, RANGE_SCHEMA, YEAR_SCHEMA, SEARCH_SCHEMA, MONGO_ID, joiThrough, flatten,
} = require('./helpers');
const { getDefaultTemplate } = require('./template-service');

module.exports = {
  am,
  createUserError,
  createServerError,
  createPermissionError,
  verify,
  hash,
  flatten,
  cleanObject,
  getCurrentSchoolYear,
  getDefaultTemplate,
  setAssociations,
  joiThrough,
  generateToken,
  ID_SCHEMA,
  MONGO_ID,
  RANGE_SCHEMA,
  YEAR_SCHEMA,
  SEARCH_SCHEMA,
};
