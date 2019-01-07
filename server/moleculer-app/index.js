const path = require('path');
const { ServiceBroker, Logger } = require('moleculer');
const PermissionGuard = require('moleculer-middleware-permissions');
const JoiValidator = require('./utils/joi.validator');
const logger = require('../logger');
const { PERMISSION_LIST } = require('./constants');

const guard = new PermissionGuard();

const broker = new ServiceBroker({
  logger: () => Logger.extend(logger),
  middlewares: [
    guard.middleware(),
  ],
  validation: true,
  validator: new JoiValidator(),
});

async function populatePermissions(sb) {
  const actions = await sb.call('$node.actions', { skipInternal: true, onlyLocal: true });

  const set = new Set(actions
  // Only keep permissions published through the ApiGw
    .filter(a => !['private', 'protected', 'public'].includes(a.action.visibility))
    .map(a => a.action.rawPermissions)
    .filter(perms => Array.isArray(perms) && perms.length > 0)
    .reduce((a, b) => a.concat(b), []));

  logger.info(`Added ${set.size} permissions from moleculer app`);
  logger.debug(`Added permissions: ${[...set].join(', ')}.`);
  PERMISSION_LIST.push(...set);
}

async function start({ expressApp, apiPath }) {
  broker.loadServices(path.join(__dirname, 'services'));

  expressApp.use(apiPath,
    broker.getLocalService('api').express(),
    (req, res) => res.sendStatus(404));

  await broker.start();

  await populatePermissions(broker);
}

module.exports = {
  start,
};
