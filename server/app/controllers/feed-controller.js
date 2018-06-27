const feedController = require('./feed-object-controller');

/**
 * Fetch the feed.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
// eslint-disable-next-line
async function get(req, res) {
  feedController.getAll();
}

module.exports = {
  get,
};
