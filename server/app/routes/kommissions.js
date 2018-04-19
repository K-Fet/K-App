const router = require('express').Router();
const guard = require('express-jwt-permissions')();
const am = require('../../utils/async-middleware');
const kommissionController = require('../controllers/kommission-controller');

router.get('/', guard.check('kommission:read'), am(kommissionController.getAllKommissions));
router.post('/', guard.check('kommission:write'), am(kommissionController.createKommission));
router.get('/:id(\\d+)', guard.check('kommission:read'), am(kommissionController.getKommissionById));
router.put('/:id(\\d+)', guard.check('kommission:write'), am(kommissionController.updateKommission));
router.post('/:id(\\d+)/delete', guard.check('kommission:write'), am(kommissionController.deleteKommission));

module.exports = router;
