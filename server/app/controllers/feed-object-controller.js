const feedObjectService = require('../services/feed-object-service');
const { FeedObject, Media } = require('../models');
const { MediaSchema, FeedObjectSchema } = require('../models/schemas');
const { createUserError } = require('../../utils');
const Joi = require('joi');

/**
 * Fetch all the categories from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAll(req, res) {
  // TODO: offset
  const categories = await feedObjectService.getAll();

  res.json(categories);
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
  createFeedObject,
  updateFeedObject,
  getFeedObjectById,
  deleteFeedObject,
};
