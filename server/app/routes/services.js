const router = require('express').Router();
const serviceController = require('../controllers/service-controller');

router.get('/', serviceController.getAllServices);
router.get('/:serviceId(\\d+)', serviceController.getServiceById);
router.delete('/:serviceId(\\d+)', serviceController.deleteServiceById);
router.post('/', serviceController.addService);
router.put('/:serviceId(\\d+)', serviceController.updateServiceById);
router.get('/:serviceId(\\d+)/barmen', serviceController.getBarmenByServiceId);

module.exports = router;