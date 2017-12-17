const router = require('express').Router();
const guard = require('express-jwt-permissions')();
const memberController = require('../controllers/member-controller');

router.get('/', guard.check('member:read'), memberController.getAllMembers);

router.post('/', memberController.createMember);

router.get('/:id(\\d+)', memberController.getMemberById);
router.put('/:id(\\d+)', memberController.updateMember);
router.delete('/:id(\\d+)', memberController.deleteMember);

module.exports = router;
