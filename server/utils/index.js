const { createUserError, createServerError, createPermissionError } = require('./errors');
const { verify, hash } = require('./password-manager');
const { setAssociations, setEmbeddedAssociations } = require('./associations');
const {
  cleanObject, generateToken, ID_SCHEMA, RANGE_SCHEMA, joiThrough,
} = require('./helpers');
const { getDefaultTemplate } = require('./template-service');

module.exports = {
  createUserError,
  createServerError,
  createPermissionError,
  verify,
  hash,
  cleanObject,
  getDefaultTemplate,
  setAssociations,
  joiThrough,
  setEmbeddedAssociations,
  generateToken,
  ID_SCHEMA,
  RANGE_SCHEMA,
};
