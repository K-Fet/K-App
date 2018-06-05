/* eslint-disable max-len */
const router = require('express').Router();
const guard = require('express-jwt-permissions')();
const am = require('../../utils/async-middleware');
const barmanController = require('../controllers/barman-controller');

router.get('/', guard.check('barman:read'), am(barmanController.getAllBarmen));

router.post('/', guard.check('barman:write'), am(barmanController.createBarman));

router.get('/:id(\\d+)', guard.check('barman:read'), am(barmanController.getBarmanById));
router.put('/:id(\\d+)', guard.check('barman:write'), am(barmanController.updateBarman));
router.post('/:id(\\d+)/delete', guard.check('barman:write'), am(barmanController.deleteBarman));

router.get('/:id(\\d+)/services', guard.check('barman:read', 'service:read'), am(barmanController.getServicesBarman));
router.post('/:id(\\d+)/services', guard.check('barman:read', 'service:read'), am(barmanController.createServiceBarman));
router.post('/:id(\\d+)/services/delete', guard.check('barman:read', 'service:read'), am(barmanController.deleteServiceBarman));

module.exports = router;
