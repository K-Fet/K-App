const router = require('express').Router();
const guard = require('express-jwt-permissions')();
const barmanController = require('../controllers/barman-controller');

router.get('/', guard.check('barman:read'), barmanController.getAllBarmen);

module.exports = router;
