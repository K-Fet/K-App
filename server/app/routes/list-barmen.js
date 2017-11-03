const router = require('express').Router();
const listBarmenController = require('../controllers/list-barmen-controller');

router.get('/', listBarmenController.getListBarmen);



module.exports = router;
