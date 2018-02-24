const logger = require('../../logger');
const sequelize = require('../../db');
const { Category } = require('../models/');
const { createUserError, createServerError, cleanObject } = require('../../utils');

/**
 * Return all categories of the app.
 *
 * @returns {Promise<Array>} Categories
 */
async function getAllCategories() {

    logger.verbose('Categroy service: get all categroies');
    return await Category.findAll();
}

/**
 * Create a category.
 *
 * @param newCategory {Category} partial category
 * @return {Promise<Category|Errors.ValidationError>} The created category with its id
 */
async function createCategory(newCategory) {

    logger.verbose('Categroy service: creating a new categroy named %s', newCategory.name);

    const transaction = await sequelize.transaction();

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
async function getCategroyById(categoryId) {

    logger.verbose('Categroy service: get categroy by id %d', categoryId);

    const category = await Category.findById(categoryId);

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
 * @param categoryId {number} categroy id
 * @param updatedCategory {Categroy} Updated categroy, constructed from the request.
 * @return {Promise<Category>} The updated categroy
 */
async function updateCategory(categoryId, updatedCategory) {

    const currentCategory = await Category.findById(categoryId);

    if (!currentCategory) throw createUserError('UnknownCategory', 'This category does not exist');

    logger.verbose('Category service: updating categroy named %s', currentCategory.name);

    const transaction = await sequelize.transaction();

    try {
        await currentCategory.update(cleanObject({
            name: updatedCategory.name,
            description: updatedCategory.description
        }), { transaction });
    } catch (err) {
        logger.warn('Category service: Error while updating category', err);
        await transaction.rollback();
        throw createServerError('ServerError', 'Error while updating category');
    }

    await transaction.commit();
    return currentCategory;
}

/**
 * Delete a categroy.
 *
 * @param categoryId {number} category id.
 * @return {Promise<Category>} The deleted category
 */
async function deleteCategory(categoryId) {

    logger.verbose('Category service: deleting category with id %d', categoryId);

    const category = await Category.findById(categoryId);

    if (!category) throw createUserError('UnknownCategory', 'This category does not exist');

    await category.destroy();

    return category;
}


module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    getCategroyById,
    deleteCategory
};
