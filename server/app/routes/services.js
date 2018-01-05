const router = require('express').Router();
const guard = require('express-jwt-permissions')();
const am = require('../../utils/async-middleware');
const serviceController = require('../controllers/service-controller');

router.get('/', guard.check('service:read'), am(serviceController.getAllServices));

router.post('/', am(serviceController.createService));

router.get('/:id(\\d+)', am(serviceController.getServiceById));
router.put('/:id(\\d+)', am(serviceController.updateService));
router.delete('/:id(\\d+)', am(serviceController.deleteService));

module.exports = router;