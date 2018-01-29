const categoryService = require('../services/category-service');
const { Category } = require('../models/category');
const { checkStructure, createUserError } = require('../../utils');

/**
 * Fetch all the categories from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAllCategories(req, res) {

    const categories = await categoryService.getAllCategories();

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

    if (!checkStructure(req.body, ['name', 'description'])) {
        throw createUserError(
            'BadRequest',
            'The body has missing properties, needed: [\'name\', \'description\']'
        );
    }

    let newCategory = new Category({
        name: req.body.name,
        description: req.body.description,
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

    const category = await categoryService.getCategroyById(categoryId);

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

    // FIXME We should check the type of each provided field, instead of just the presence
    if (!checkStructure(req.body, ['name', 'description'])) {
        throw createUserError(
            'BadRequest',
            'The body has missing properties, needed: [\'name\', \'description\']'
        );
    }

    let newCategory = new Category({
        name: req.body.name,
        description: req.body.description,
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
    getAllCategories,
    createCategory,
    updateCategory,
    getCategoryById,
    deleteCategory
};
