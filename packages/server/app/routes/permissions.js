const router = require('express').Router();
const am = require('../../utils/async-middleware');
const permissionController = require('../controllers/permission-controller');

router.get('/', am(permissionController.getAllPermissions));

module.exports = router;
