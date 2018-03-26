const logger = require('../../logger');
const sequelize = require('../../db');
const { Template, TemplateUnit } = require('../models');
const { createUserError, createServerError, getDefaultTemplate } = require('../../utils');

/**
 * Return all services templates of the app
 *
 * @returns {Promise<Array>} SpecialAccount
 */
async function getAllTemplates() {
    logger.verbose('Template service: get all templates');

    let templates = await Template.findAll({
        include: [
            {
                model: TemplateUnit,
                as: 'services',
                attributes: { exclude: [ 'id', 'TemplateId', 'createdAt', 'updatedAt' ] },
            }
        ]
    });

    // Create a default template if no template was found yet.
    if (templates.length === 0) {
        const template = await Template.create({
            name: 'Semaine par default',
            services: getDefaultTemplate(),
        }, {
            include: [
                {
                    model: TemplateUnit,
                    as: 'services',
                },
            ],
        });
        templates = [ template ];
    }

    return templates;
}

/**
 * Get a Template by his id.
 * @param templateId {number} SpecialAccount Id
 * @returns {Promise<SpecialAccount>} SpecialAccount
 */
async function getTemplateById(templateId) {

    logger.verbose('Template service: get a template by his id %d', templateId);

    const template = await Template.findById(templateId, {
        include: [
            {
                model: TemplateUnit,
                as: 'services',
                attributes: { exclude: [ 'id', 'TemplateId', 'createdAt', 'updatedAt' ] },
            }
        ],
    });

    if (!template) throw createUserError('UnknownTemplate', 'This Template does not exist');
    return template;
}

/**
 * Create a template.
 *
 * @param newTemplate {Template} the new template
 * @return {Promise<SpecialAccount>} The created SpecialAccount with its id
 */
async function createTemplate(newTemplate) {

    logger.verbose('Template service: creating a new Template with name %s',
        newTemplate.name);

    return Template.create(newTemplate, {
        include: [
            {
                model: TemplateUnit,
                as: 'services',
            }
        ]
    });
}

/**
 * Update a specialAccount
 *
 * @param templateId {number} specialAccount id
 * @param updatedTemplate {Template} Updated SpecialAccount, constructed from the request.
 * @return {Promise<Template>} the updated template
 */
async function updateTemplateById(templateId, updatedTemplate) {
    const currentTemplate = await Template.findById(templateId, {
        include: [
            {
                model: TemplateUnit,
                as: 'services',
            }
        ]
    });

    if (!currentTemplate) throw createUserError('UnknownTemplate', 'This Template does not exist');

    logger.verbose('Template service: updating template named %s', currentTemplate.name);

    const transaction = await sequelize.transaction();

    try {
        await currentTemplate.destroy({ transaction });
        await updatedTemplate.save({ transaction,
            include: [
                {
                    model: TemplateUnit,
                    as: 'services',
                    attributes: { exclude: [ 'id', 'TemplateId', 'createdAt', 'updatedAt' ] },
                }
            ] });
    } catch (err) {
        logger.warn('Template service: Error while updating template with id %d', templateId);
        await transaction.rollback();
        throw createServerError('ServerError', 'Error while updating template');
    }

    await transaction.commit();

    // Remove
    return updatedTemplate;
}

/**
 * Delete a SpecialAccount
 *
 * @param templateId {number} SpecialAccount id
 * @return {Promise<SpecialAccount>} The deleted Template
 */
async function deleteTemplateById(templateId) {

    logger.verbose('Template service: deleting Template with id %d', templateId);

    const template = await Template.findById(templateId, {
        include: [
            {
                model: TemplateUnit,
                as: 'services',
            }
        ]
    });

    if (!template) throw createUserError('UnknownTemplate', 'This Template does not exist');

    const transaction = await sequelize.transaction();

    try {
        await template.destroy({ transaction });
    } catch (err) {
        logger.warn('Template service: Error while deleting template with id %d', templateId);
        await transaction.rollback();
        throw createServerError('ServerError', 'Error while deleting template');
    }

    await transaction.commit();

    return template;
}

module.exports = {
    getAllTemplates,
    createTemplate,
    getTemplateById,
    deleteTemplateById,
    updateTemplateById,
};
