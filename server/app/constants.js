const uuid = require('uuid/v4');

module.exports = {
  /**
   * List all permissions used in the application.
   */
  PERMISSION_LIST: [
    // This is a special permissions that allow the user to be updated
    // when new permissions are created.
    // It's important that ONLY ONE user has this permission.
    'admin:upgrade',

    'barman:read',
    'barman:write',

    'category:write',

    'feedobject:write',

    'kommission:read',
    'kommission:write',

    'member:read',
    'member:write',

    'role:read',
    'role:write',

    'service:read',
    'service:write',

    'specialaccount:read',
    'specialaccount:write',
    'specialaccount:force-code-reset',

    'task:read',
    'task:write',

    'template:read',
    'template:write',
  ],

  /**
   * Name of the permission which will allow to update admin with newly created permissions.
   */
  ADMIN_UPGRADE_PERMISSION: 'admin:upgrade',

  /**
   * Facebook verify token.
   * Generated at runtime
   */
  VERIFY_TOKEN: uuid(),

  /**
   * Facebook base api URL.
   */
  FB_BASE_API: 'https://graph.facebook.com/v3.0',
};
