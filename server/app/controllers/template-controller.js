const templateService = require('../services/template-service');
const { Template } = require('../models');
const { TemplateSchema } = require('../models/schemas');
const { createUserError } = require('../../utils');

/**
 * Fetch all templates from the database
 *
 * @param req Request
 * @param res Response
 * @return {Promise<void>} Nothing
 */
async function getAllTemplates(req, res) {
    const templates = await templateService.getAllTemplates();

    res.json(templates);
}

/**
 * Create a SpecialAccount
 *
 * @param req Request
 * @param res Response
 * @return {Promise<void>} Nothing
 */
async function createTemplate(req, res) {
    const schema = TemplateSchema.requiredKeys(
        'name',
        'services',
    );

    const { error } = schema.validate(req.body);
    if (error) throw createUserError('BadRequest', error.details[0].message);

    let newTemplate = new Template({
        ...req.body
    });

    newTemplate = await templateService.createTemplate(newTemplate);

    res.json(newTemplate);
}

/**
 * Get a SpecialAccount by its id
 *
 * @param req Request
 * @param res Response
 * @return {Promise<void>} Nothing
 */
async function getTemplateById(req, res) {
    const templateId = req.params.id;

    const template = await templateService.getTemplateById(templateId);

    res.json(template);
}

/**
 * Update a SpecialAccount.
 *
 * @param req Request
 * @param res Response
 * @return {Promise<void>} Nothing
 */
async function updateTemplate(req, res) {
    const schema = TemplateSchema.min(1);

    const { error } = schema.validate(req.nody);
    if (error) throw createUserError('BadRequest', error.details[0].message);

    let newTemplate = new Template({
        ...req.body,
    });

    const templateId = req.params.id;

    newTemplate = await templateService.updateTemplateById(templateId,
        newTemplate);

    res.json(newTemplate);
}

/**
 * Delete a SpecialAccount
 *
 * @param req Request
 * @param res Response
 * @return {Promise<void>} Nothing
 */
async function deleteTemplate(req, res) {
    const templateId = req.params.id;

    const specialAccount = await templateService.deletetemplateById(templateId);

    res.json(specialAccount);
}

module.exports = {
    getAllTemplates,
    createTemplate,
    getTemplateById,
    updateTemplate,
    deleteTemplate
};
