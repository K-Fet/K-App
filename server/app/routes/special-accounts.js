const router = require('express').Router();
const am = require('../../utils/async-middleware');
const { codeGuard } = require('../middlewares/code-guard');
const specialAccountController = require('../controllers/special-account-controller');

router.get('/', am(specialAccountController.getAllSpecialAccounts));
router.post('/', am(codeGuard), am(specialAccountController.createSpecialAccount));
router.get('/:id(\\d+)', am(specialAccountController.getSpecialAccountById));
router.put('/:id(\\d+)', am(codeGuard), am(specialAccountController.updateSpecialAccount));
router.post('/:id(\\d+)/delete', am(codeGuard), am(specialAccountController.deleteSpecialAccount));

module.exports = router;
