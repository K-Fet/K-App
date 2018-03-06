const router = require('express').Router();
const am = require('../../utils/async-middleware');
const guard = require('express-jwt-permissions')();
const serviceController = require('../controllers/service-controller');

router.get('/', guard.check('service:read'), am(serviceController.getAllServices));
router.post('/', guard.check('service:write'), am(serviceController.createService));
router.get('/:id(\\d+)', guard.check('service:read'), am(serviceController.getServiceById));
router.put('/:id(\\d+)', guard.check('service:write'), am(serviceController.updateService));
router.delete('/:id(\\d+)', guard.check('service:write'), am(serviceController.deleteService));
router.get('/:id(\\d+/barmen)', guard.check('service:read', 'barman:read'), am(serviceController.getBarmen));
// TODO Add specific permissions for template
router.get('/template', guard.check('service:read'), am(serviceController.getServicesTemplate));

module.exports = router;
