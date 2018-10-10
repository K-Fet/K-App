const { createUserError, createServerError, createPermissionError } = require('./errors');
const { verify, hash } = require('./password-manager');
const { setAssociations } = require('./associations');
const {
  getCurrentSchoolYear, cleanObject, generateToken, ID_SCHEMA, RANGE_SCHEMA, SEARCH_SCHEMA, joiThrough,
} = require('./helpers');
const { getDefaultTemplate } = require('./template-service');

module.exports = {
  createUserError,
  createServerError,
  createPermissionError,
  verify,
  hash,
  cleanObject,
  getCurrentSchoolYear,
  getDefaultTemplate,
  setAssociations,
  joiThrough,
  generateToken,
  ID_SCHEMA,
  RANGE_SCHEMA,
  SEARCH_SCHEMA,
};
