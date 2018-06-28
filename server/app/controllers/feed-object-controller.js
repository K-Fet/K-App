const feedObjectService = require('../services/feed-object-service');
const { FeedObject, Media } = require('../models');
const { MediaSchema, FeedObjectSchema } = require('../models/schemas');
const { createUserError } = require('../../utils');
const Joi = require('joi');

/**
 * Fetch feedObjects from the database with pagination.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAll(req, res) {
  const schema = Joi.object().keys({
    page: Joi.number().min(1).max(100),
    limit: Joi.number().min(1).max(100),
  });

  let page = 1;
  let limit = 40;

  if (req.query.params) {
    // Cast to number
    page = +req.query.params.page;
    limit = +req.query.params.limit;

    const { error } = schema.validate(req.query.params);
    if (error) throw createUserError('BadRequest', error.message);
  }

  const feedObjects = await feedObjectService.getAll(page, limit);

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
  const schema = FeedObjectSchema.requiredKeys([
    'title',
    'content',
    'date',
    'source',
  ]);

  const { error } = schema.validate(req.body);
  if (error) throw createUserError('BadRequest', error.message);

  // Handle media
  if (req.body.medias) {
    const mediaSchema = Joi.array().items(MediaSchema.requiredKeys([
      'url',
      'type',
    ]));

    const { mediaError } = mediaSchema.validate(req.body.medias);
    if (mediaError) throw createUserError('BadRequest', error.message);
  }

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
  const schema = FeedObjectSchema.min(1);

  const { error } = schema.validate(req.body);
  if (error) throw createUserError('BadRequest', error.message);

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

  const feedObjectId = req.params.id;

  newFeedObject = await feedObjectService.updateFeedObject(feedObjectId, newFeedObject, req.body._embedded);

  res.json(newFeedObject);
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
