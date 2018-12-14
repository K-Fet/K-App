const logger = require('../../logger');
const { Category } = require('../models/category');
const {
  createUserError, createServerError, cleanObject,
} = require('../../utils');
const { sequelize } = require('../../bootstrap/sequelize');

/**
 * Return all categories of the app.
 *
 * @returns {Promise<Array>} Categories
 */
async function getAll() {
  logger.verbose('Category service: get all categories');
  return Category.findAll();
}


/**
 * Create a category.
 *
 * @param newCategory {Category} partial category
 * @param _embedded {Object} Object containing associations to update, see swagger for more information.
 * @return {Promise<Category|Errors.ValidationError>} The created category with its id
 */
async function createCategory(newCategory) {
  logger.verbose('Category service: creating a new category named %s', newCategory.name);

  const transaction = await sequelize().transaction();
  try {
    await newCategory.save({ transaction });
  } catch (err) {
    logger.warn('Category service: Error while creating category', err);
    await transaction.rollback();
    throw createServerError('ServerError', 'Error while creating category');
  }

  await transaction.commit();
  return newCategory;
}


/**
 * Get a category by its id.
 *
 * @param categoryId {number} Category id
 * @return {Promise<Category>} The wanted category.
 */
async function getCategoryById(categoryId) {
  logger.verbose('Category service: get category by id %d', categoryId);

  const category = await Category.findByPk(categoryId);


  if (!category) throw createUserError('UnknownCategory', 'This category does not exist');

  return category;
}


/**
 * Update a category.
 * This will copy only the allowed changes from the `updatedCategory`
 * into the current category.
 * This means, with this function, you can not change everything like
 * the `createdAt` field or others.
 *
 * @param categoryId {number} category id
 * @param updatedCategory {Category} Updated category, constructed from the request.
 * @return {Promise<Category>} The updated category
 */
async function updateCategory(categoryId, updatedCategory) {
  const currentCategory = await Category.findByPk(categoryId);

  if (!currentCategory) throw createUserError('UnknownCategory', 'This category does not exist');

  logger.verbose('Category service: updating category named %s %s', currentCategory.id, currentCategory.name);

  const transaction = await sequelize().transaction();

  try {
    await currentCategory.update(cleanObject({
      name: updatedCategory.name,
      description: updatedCategory.description,
    }), { transaction });
  } catch (err) {
    logger.warn('Category Service : error while updating a category', err);
    await transaction.rollback();
    throw createServerError('Server Error', 'Error while updating a category');
  }

  await transaction.commit();
  return currentCategory.reload();
}

/**
 * Delete an category.
 *
 * @param categoryId {number} category id.
 * @return {Promise<Category>} The deleted category
 */
async function deleteCategory(categoryId) {
  logger.verbose('Category service: deleting category with id %d', categoryId);

  const category = await Category.findByPk(categoryId);

  if (!category) throw createUserError('UnknownCategory', 'This category does not exist');

  await category.destroy();

  return category;
}


module.exports = {
  getAll,
  createCategory,
  updateCategory,
  getCategoryById,
  deleteCategory,
};
