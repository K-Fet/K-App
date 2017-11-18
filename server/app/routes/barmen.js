const router = require('express').Router();
const barmanController = require('../controllers/barman-controller');

router.get('/', barmanController.getAllBarmen);

module.exports = router;
