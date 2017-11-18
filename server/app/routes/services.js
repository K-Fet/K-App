const router = require('express').Router();
const serviceController = require('../controllers/service-controller');

router.get('/', serviceController.getAllServices);

module.exports = router;