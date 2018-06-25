const router = require('express').Router();
const am = require('../../utils/async-middleware');
const contactController = require('../controllers/contact-controller');

router.post('/', am(contactController.sendForm));

module.exports = router;
