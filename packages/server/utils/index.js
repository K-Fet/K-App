/* eslint-disable global-require */
module.exports = {
  am: require('./async-middleware'),
  ...require('./helpers'),
  ...require('./template-service'),
  ...require('./associations'),
  ...require('./password-manager'),
  ...require('./errors'),
};
