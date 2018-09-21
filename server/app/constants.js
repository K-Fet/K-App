const uuid = require('uuid/v4');

module.exports = {
  /**
   * List all permissions used in the application.
   */
  PERMISSION_LIST: [
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
   * Facebook verify token.
   * Generated at runtime
   */
  VERIFY_TOKEN: uuid(),

  /**
   * Facebook base api URL.
   */
  FB_BASE_API: 'https://graph.facebook.com/v3.0',
};
