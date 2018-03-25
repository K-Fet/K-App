const router = require('express').Router();
const am = require('../../utils/async-middleware');
const templateController = require('../controllers/template-controller');

router.get('/', am(templateController.getAllSpecialAccounts));
router.post('/', am(templateController.createSpecialAccount));
router.get('/:id(\\d+)', am(templateController.getSpecialAccountById));
router.put('/:id(\\d+)', am(templateController.updateSpecialAccount));
router.delete('/:id(\\d+)', am(templateController.deleteSpecialAccount));

module.exports = router;
