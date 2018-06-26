const feedObjectService = require('../services/feed-object-service');

/**
 * Fetch the feed.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function get(req, res) {
  const feed = await feedObjectService.getAll();

  res.json(feed);
}

module.exports = {
  get,
};
