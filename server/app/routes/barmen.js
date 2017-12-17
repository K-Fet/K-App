const router = require('express').Router();
const guard = require('express-jwt-permissions')();
const barmanController = require('../controllers/barman-controller');

router.get('/', guard.check('barman:read'), barmanController.getAllBarmen);
router.get('/:barmanId(\\d+)', guard.check('barman:read'), barmanController.getBarmanById);
router.delete('/:barmanId(\\d+)', guard.check('barman:write'), barmanController.deleteBarmanById);
router.get('/:barmanId(\\d+)/services', guard.check('barma,:read', 'service:read'), barmanController.getServicesBarman);

module.exports = router;
