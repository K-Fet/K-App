const path = require('path');
const { ServiceBroker } = require('moleculer');
const PermissionGuard = require('moleculer-middleware-permissions');
const JoiValidator = require('./utils/joi.validator');
const { loggerConfig } = require('../logger');
const { PERMISSION_LIST } = require('./constants');
const { getAllPermissionsFromUser } = require('../utils');

const guard = new PermissionGuard({
  getUserPermissions: ctx => getAllPermissionsFromUser(ctx.meta.user),
});

const broker = new ServiceBroker({
  logger: {
    type: 'Winston',
    options: { winston: loggerConfig },
  },
  middlewares: [
    guard.middleware(),
  ],
  validator: new JoiValidator(),
});

async function populatePermissions(sb) {
  const actions = await sb.call('$node.actions', { skipInternal: true, onlyLocal: true });

  const set = new Set(actions
    // Only keep permissions published through the ApiGw
    .filter(a => !['private', 'protected', 'public'].includes(a.action.visibility))
    .flatMap(a => a.action.permissions)
    .filter(perm => typeof perm === 'string')
    .filter(perm => !perm.startsWith('$')));

  sb.logger.info(`Added ${set.size} permissions from moleculer app`);
  sb.logger.debug(`Added permissions: ${[...set].join(', ')}.`);
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
