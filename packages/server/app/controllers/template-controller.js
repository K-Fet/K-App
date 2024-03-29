const templateService = require('../services/template-service');
const { Template, TemplateUnit } = require('../models');

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
 * Create a Template
 *
 * @param req Request
 * @param res Response
 * @return {Promise<void>} Nothing
 */
async function createTemplate(req, res) {
  let newTemplate = new Template(req.body, {
    include: [
      {
        model: TemplateUnit,
        as: 'services',
      },
    ],
  });

  newTemplate = await templateService.createTemplate(newTemplate);

  res.json(newTemplate);
}

/**
 * Get a Template by its id
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
 * Update a Template.
 *
 * @param req Request
 * @param res Response
 * @return {Promise<void>} Nothing
 */
async function updateTemplate(req, res) {
  let newTemplate = new Template(
    req.body,
    {
      include: [
        {
          model: TemplateUnit,
          as: 'services',
        },
      ],
    },
  );

  const templateId = req.params.id;

  newTemplate = await templateService.updateTemplateById(
    templateId,
    newTemplate,
  );

  res.json(newTemplate);
}

/**
 * Delete a Template
 *
 * @param req Request
 * @param res Response
 * @return {Promise<void>} Nothing
 */
async function deleteTemplate(req, res) {
  const templateId = req.params.id;

  const template = await templateService.deleteTemplateById(templateId);

  res.json(template);
}

module.exports = {
  getAllTemplates,
  createTemplate,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
};
