const { createUserError, createServerError, createPermissionError } = require('./errors');
const { verify, hash } = require('./password-manager');
const { setAssociations, setEmbeddedAssociations } = require('./associations');
const { cleanObject, parseStartAndEnd, generateToken } = require('./helpers');
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
  setEmbeddedAssociations,
  parseStartAndEnd,
  generateToken,
};
