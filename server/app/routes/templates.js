const router = require('express').Router();
const am = require('../../utils/async-middleware');
const templateController = require('../controllers/template-controller');

router.get('/', am(templateController.getAllTemplates));
router.post('/', am(templateController.createTemplate));
router.get('/:id(\\d+)', am(templateController.getTemplateById));
router.put('/:id(\\d+)', am(templateController.updateTemplate));
router.delete('/:id(\\d+)', am(templateController.deleteTemplate));

module.exports = router;
