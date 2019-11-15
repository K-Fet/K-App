const { MoleculerClientError } = require('moleculer').Errors;

const getPermissionsFromActions = (action) => {
  const { permissions, name } = action;

  if (Array.isArray(permissions)) return permissions;
  if (permissions === true) return [name];
  return [permissions];
};

const verifyPerms = ({ requestPerms, userPerms }) => {
  return false;
};

module.exports = {
  name: 'CheckPermissions',

  // Wrap local action handlers
  localAction(handler, action) {
    if (!action.permissions) return handler;

    const actionPerms = getPermissionsFromActions(action);

    const permNames = [];
    const permFuncs = [];
    actionPerms.forEach((p) => {
      if (typeof p === 'function') {
        // Add custom permission function
        permFuncs.push(p);
        return;
      }

      if (typeof p === 'string') {
        if (p === '$owner') {
          // Check if user is owner of the entity
          permFuncs.push(async (ctx) => {
            if (typeof ctx.service.isEntityOwner === 'function') {
              return ctx.service.isEntityOwner.call(this, ctx);
            }
            return false;
          });
          return;
        }

        // Add a role or permission name
        permNames.push(p);
      }
    });

    return async function CheckPermissionsMiddleware(ctx) {
      const { roles = [], permissions = [] } = ctx.meta.user.account;

      let res = false;
      if (permNames.length > 0) {
        res = await verifyPerms({
          userPerms: [...new Set([
            ...roles.flatMap(r => r.permissions),
            ...permissions,
          ]).entries()],
          requestedPerms: permNames,
        });
      }

      if (res !== true) {
        if (permFuncs.length > 0) {
          const results = await Promise.all(permFuncs.map(async fn => fn.call(this, ctx)));
          res = results.find(r => !!r);
        }

        if (res !== true) {
          throw new MoleculerClientError('You have no right for this operation!', 401, 'ERR_HAS_NO_ACCESS', { action: action.name });
        }
      }
      return handler(ctx);
    }.bind(this);
  },
};
