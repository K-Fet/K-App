const router = require('express').Router();
const am = require('../../utils/async-middleware');
const guard = require('express-jwt-permissions')();
const serviceController = require('../controllers/service-controller');

router.get('/', guard.check('service:read'), am(serviceController.getAllServices));
router.post('/', guard.check('service:write'), am(serviceController.createService));
router.get('/:id(\\d+)', guard.check('service:read'), am(serviceController.getServiceById));
router.put('/:id(\\d+)', guard.check('service:write'), am(serviceController.updateService));
router.delete('/:id(\\d+)', guard.check('service:write'), am(serviceController.deleteService));

module.exports = router;
