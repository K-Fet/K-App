const path = require('path');

module.exports = {
  /**
   * Port where the http web server will listen
   */
  port: process.env.PORT || 3000,

  /**
   * Accept only connection on hostname.
   *
   * If omitted, the server will serve all interfaces
   *
   * @example 'localhost'
   * @default undefined
   */
  hostname: process.env.HOSTNAME,

  /**
   * Configure the proxy used.
   *
   * @example 'loopback'
   * @default undefined
   * @see https://expressjs.com/en/guide/behind-proxies.html
   */
  trustedProxy: process.env.TRUSTED_PROXY,

  /**
   * Absolute path to the folder containing all the static files
   */
  publicFolder: path.resolve(__dirname, '../../client/dist/'),

  /**
   * Website url.
   *
   * Used in side channels to link back to here.
   */
  get publicURL() {
    if (process.env.NODE_ENV === 'production') {
      return process.env.PUBLIC_URL;
    }
    return this._currentPublicURL;
  },

  /**
   * This variable will be set by the bootstrap ngrok
   *
   * @see ../bootstrap/ngrok.js
   */
  _currentPublicURL: null,
};
