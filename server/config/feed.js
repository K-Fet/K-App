const uuid = require('uuid/v4');

module.exports = {

  /**
   * Give the base API path for the facebook api.
   */
  baseApi: 'https://graph.facebook.com/v3.0',

  /**
   * Access token to the FB App.
   */
  accessToken: process.env.FB_ACCESS_TOKEN,

  /**
   *  Facebook application ID.
   */
  appId: this.accessToken && this.accessToken.split('|')[0],

  /**
   * Random verifyToken.
   */
  verifyToken: uuid(),

};
