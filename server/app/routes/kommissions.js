const router = require('express').Router();
const guard = require('express-jwt-permissions')();
const am = require('../../utils/async-middleware');
const kommissionController = require('../controllers/kommission-controller');

router.get('/', am(kommissionController.getAllKommission));

router.post('/', am(kommissionController.createMember));

router.get('/:id(\\d+)', am(kommissionController.getMemberById));
router.put('/:id(\\d+)', am(kommissionController.updateMember));
router.delete('/:id(\\d+)', am(kommissionController.deleteMember));

module.exports = router;