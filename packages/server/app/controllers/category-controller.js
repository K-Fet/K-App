const categoryService = require('../services/category-service');
const { Category } = require('../models');

/**
 * Fetch all the categories from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAll(req, res) {
  const categories = await categoryService.getAll();

  res.json(categories);
}

/**
 * Create a category.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function createCategory(req, res) {
  let newCategory = new Category({
    ...req.body,
  });

  newCategory = await categoryService.createCategory(newCategory);

  res.json(newCategory);
}


/**
 * Get a category by its id.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getCategoryById(req, res) {
  const categoryId = req.params.id;

  const category = await categoryService.getCategoryById(categoryId);

  res.json(category);
}


/**
 * Update a category.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function updateCategory(req, res) {
  let newCategory = new Category({
    ...req.body,
  });

  const categoryId = req.params.id;

  newCategory = await categoryService.updateCategory(categoryId, newCategory);

  res.json(newCategory);
}

/**
 * Delete a category.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function deleteCategory(req, res) {
  const categoryId = req.params.id;

  const category = await categoryService.deleteCategory(categoryId);

  res.json(category);
}

module.exports = {
  getAll,
  createCategory,
  updateCategory,
  getCategoryById,
  deleteCategory,
};
