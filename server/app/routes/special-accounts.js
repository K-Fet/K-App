const guard = require('express-jwt-permissions')();
const router = require('express').Router();
const am = require('../../utils/async-middleware');
const { codeGuard } = require('../middlewares/code-guard');
const specialAccountController = require('../controllers/special-account-controller');

router.get('/', guard.check('specialaccount:read'), am(specialAccountController.getAllSpecialAccounts));
router.post('/', guard.check('specialaccount:write'), am(codeGuard), am(specialAccountController.createSpecialAccount));
router.get('/:id(\\d+)', guard.check('specialaccount:read'), am(specialAccountController.getSpecialAccountById));
router.put('/:id(\\d+)', guard.check('specialaccount:write'), am(codeGuard), am(specialAccountController.updateSpecialAccount));
router.post('/:id(\\d+)/delete', guard.check('specialaccount:write'), am(codeGuard), am(specialAccountController.deleteSpecialAccount));

module.exports = router;
