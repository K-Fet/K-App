const router = require('express').Router();
const am = require('../../utils/async-middleware');
const templateController = require('../controllers/template-controller');
const guard = require('express-jwt-permissions')();

router.get('/', guard.check('template:read'), am(templateController.getAllTemplates));
router.post('/', guard.check('template:write'), am(templateController.createTemplate));
router.get('/:id(\\d+)', guard.check('template:read'), am(templateController.getTemplateById));
router.put('/:id(\\d+)', guard.check('template:write'), am(templateController.updateTemplate));
router.delete('/:id(\\d+)', guard.check('template:write'), am(templateController.deleteTemplate));

module.exports = router;
