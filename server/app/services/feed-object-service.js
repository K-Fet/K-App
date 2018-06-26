const logger = require('../../logger');
const {
  Barman, FeedObject, Category, Media,
} = require('../models/');
const {
  createUserError, createServerError, cleanObject, setAssociations,
} = require('../../utils');
const sequelize = require('../../db');

/**
 * Return all feed objects of the app.
 *
 * @returns {Promise<Array>} FeedObjects
 */
async function getAll() {
  logger.verbose('FeedObject service: get all feed objects');
  return FeedObject.findAll({
    order: [
      ['date', 'DESC'],
    ],
    include: [
      {
        model: Category,
        as: 'categories',
      },
      {
        model: Media,
        as: 'medias',
      },
    ],
  });
}


/**
 * Create a feed object.
 *
 * @param newFeedObject {FeedObject} partial feed object
 * @param _embedded {Object} Object containing associations to update, see swagger for more information.
 * @return {Promise<FeedObject|Errors.ValidationError>} The created feed object with its id
 */
async function createFeedObject(newFeedObject, _embedded) {
  logger.verbose('FeedObject service: creating a new feed object named %s', newFeedObject.title);

  const transaction = await sequelize.transaction();
  try {
    await newFeedObject.save({ transaction });
  } catch (err) {
    logger.warn('FeedObject service: Error while creating feed object', err);
    await transaction.rollback();
    throw createServerError('ServerError', 'Error while creating feed object');
  }

  // Associations
  await setAssociations(_embedded, newFeedObject, null, transaction, true);

  await transaction.commit();
  return newFeedObject;
}


/**
 * Get a feed object by its id.
 *
 * @param feedObjectId {number} FeedObject id
 * @return {Promise<FeedObject>} The wanted feed object.
 */
async function getFeedObjectById(feedObjectId) {
  logger.verbose('FeedObject service: get feed object by id %d', feedObjectId);

  const feedObject = await FeedObject.findById(feedObjectId, {
    include: [
      {
        model: Category,
        as: 'categories',
      },
      {
        model: Media,
        as: 'medias',
      },
    ],
  });


  if (!feedObject) throw createUserError('UnknownFeedObject', 'This feed object does not exist');

  return feedObject;
}


/**
 * Update a feed object.
 * This will copy only the allowed changes from the `updatedFeedObject`
 * into the current feed object.
 * This means, with this function, you can not change everything like
 * the `createdAt` field or others.
 *
 * @param feedObjectId {number} feed object id
 * @param updatedFeedObject {FeedObject} Updated feed object, constructed from the request.
 * @param _embedded {Object} Object containing associations to update, see swagger for more information.
 * @return {Promise<FeedObject>} The updated feed object
 */
async function updateFeedObject(feedObjectId, updatedFeedObject, _embedded) {
  const currentFeedObject = await FeedObject.findById(feedObjectId, {
    include: [
      {
        model: Barman,
        as: 'barmen',
      },
    ],
  });

  if (!currentFeedObject) throw createUserError('UnknownFeedObject', 'This feed object does not exist');

  logger.verbose('FeedObject service: updating feed object named %s %s', currentFeedObject.id, currentFeedObject.name);

  const transaction = await sequelize.transaction();

  try {
    await currentFeedObject.update(cleanObject({
      title: updatedFeedObject.title,
      content: updatedFeedObject.content,
      date: updatedFeedObject.date,
      pin: updatedFeedObject.pin,
      source: updatedFeedObject.source,
      openLink: updatedFeedObject.openLink,
    }), { transaction });
  } catch (err) {
    logger.warn('FeedObject Service : error while updating a feed object', err);
    await transaction.rollback();
    throw createServerError('Server Error', 'Error while updating a feed object');
  }

  // Associations
  await setAssociations(_embedded, currentFeedObject, null, transaction);

  await transaction.commit();
  return currentFeedObject.reload();
}

/**
 * Delete an feed object.
 *
 * @param feedObjectId {number} feed object id.
 * @return {Promise<FeedObject>} The deleted feed object
 */
async function deleteFeedObject(feedObjectId) {
  logger.verbose('FeedObject service: deleting feed object with id %d', feedObjectId);

  const feedObject = await FeedObject.findById(feedObjectId);

  if (!feedObject) throw createUserError('UnknownFeedObject', 'This feed object does not exist');

  await feedObject.destroy();

  return feedObject;
}


module.exports = {
  getAll,
  createFeedObject,
  updateFeedObject,
  getFeedObjectById,
  deleteFeedObject,
};
