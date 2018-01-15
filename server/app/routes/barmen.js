const router = require('express').Router();
const guard = require('express-jwt-permissions')();
const am = require('../../utils/async-middleware');
const barmanController = require('../controllers/barman-controller');

router.get('/', guard.check('barman:read'), am(barmanController.getAllBarmen));

router.post('/', guard.check('barman:write'), am(barmanController.createBarman));

router.get('/:id(\\d+)', guard.check('barman:read'), am(barmanController.getBarmanById));
router.put('/:id(\\d+)', guard.check('barman:write'), am(barmanController.updateBarman));
router.delete('/:id(\\d+)', guard.check('barman:write'), am(barmanController.deleteBarman));

module.exports = router;
