const router = require('express').Router();
const am = require('../../utils/async-middleware');
const specialAccountController = require('../controllers/special-account-controller');

router.get('/', am(specialAccountController.getAllSpecialAccounts));
router.post('/', am(specialAccountController.createSpecialAccount));
router.get('/:id(\\d+)', am(specialAccountController.getSpecialAccountById));
router.put('/:id(\\d+)', am(specialAccountController.updateSpecialAccount));
router.delete('/:id(\\d+)', am(specialAccountController.deleteSpecialAccount));

module.exports = router;
