const path = require('path');
const { ServiceBroker } = require('moleculer');
const PermissionGuard = require('moleculer-middleware-permissions');
const JoiValidator = require('./utils/joi.validator');
const { loggerConfig } = require('../logger');

const guard = new PermissionGuard({
  getUserPermissions: ctx => {
    console.log('DEBUG1', ctx.meta);
    return ctx.meta.userPermissions;
  },
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

async function upgradePermissionsForAdmin(sb) {
  const actions = await sb.call('$node.actions', { skipInternal: true, onlyLocal: true });

  const set = new Set(actions
    // Only keep permissions published through the ApiGw
    .filter(a => !['private', 'protected', 'public'].includes(a.action.visibility))
    .flatMap(a => a.action.permissions)
    .filter(perm => typeof perm === 'string')
    .filter(perm => !perm.startsWith('$')));

  sb.logger.info(`Got ${set.size} permissions from moleculer app`);
  sb.logger.debug(`Permissions: [${[...set].join(', ')}]`);

  // We override any permissions set before
  const userService = sb.getLocalService('v1.acl.users');
  await userService.adapter.updateMany(
    { 'account.autoUpgradePermissions': true },
    { $set: { 'account.permissions': [...set] } },
  );
}

async function start({ expressApp, apiPath }) {
  broker.loadServices(path.join(__dirname, 'services'));

  expressApp.use(apiPath,
    broker.getLocalService('api').express(),
    (req, res) => res.sendStatus(404));

  await broker.start();

  await upgradePermissionsForAdmin(broker);
}

module.exports = {
  start,
};
