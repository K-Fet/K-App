const router = require('express').Router();
const guard = require('express-jwt-permissions')();
const am = require('../../utils/async-middleware');
const barmanController = require('../controllers/barman-controller');

router.get('/', guard.check('barman:read'), am(barmanController.getAllBarmen));

module.exports = router;
