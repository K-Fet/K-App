const feedObjectService = require('../services/feed-object-service');
const { FeedObject, Media } = require('../models');

/**
 * Fetch feedObjects from the database with pagination.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAll(req, res) {
  const { offset, limit } = req.query;

  const feedObjects = await feedObjectService.getAll(offset, limit);

  res.json(feedObjects);
}

/**
 * Fetch all the pinned feedObjects from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getPinned(req, res) {
  const pinnedFeedObjects = await feedObjectService.getPinned();

  res.json(pinnedFeedObjects);
}

/**
 * Create a feed object.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function createFeedObject(req, res) {
  let newFeedObject = new FeedObject({
    ...req.body,
    _embedded: undefined, // Remove the only external object
  }, {
    include: [
      {
        model: Media,
        as: 'medias',
      },
    ],
  });

  newFeedObject = await feedObjectService.createFeedObject(newFeedObject, req.body._embedded);

  res.json(newFeedObject);
}


/**
 * Get a feed object by its id.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getFeedObjectById(req, res) {
  const feedObjectId = req.params.id;

  const feedObject = await feedObjectService.getFeedObjectById(feedObjectId);

  res.json(feedObject);
}


/**
 * Update a feed object.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function updateFeedObject(req, res) {
  let updatedFeedObject = new FeedObject({
    ...req.body,
    medias: undefined,
    _embedded: undefined, // Remove the only external object
  }, {
    include: [
      {
        model: Media,
        as: 'medias',
      },
    ],
  });

  const feedObjectId = req.params.id;

  updatedFeedObject = await feedObjectService
    .updateFeedObject(feedObjectId, updatedFeedObject, req.body.medias, req.body._embedded);

  res.json(updatedFeedObject);
}

/**
 * Delete a feed object.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function deleteFeedObject(req, res) {
  const feedObjectId = req.params.id;

  const feedObject = await feedObjectService.deleteFeedObject(feedObjectId);

  res.json(feedObject);
}

module.exports = {
  getAll,
  getPinned,
  createFeedObject,
  updateFeedObject,
  getFeedObjectById,
  deleteFeedObject,
};
