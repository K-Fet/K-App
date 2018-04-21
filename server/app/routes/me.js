const router = require('express').Router();
const am = require('../../utils/async-middleware');
const { isBarman } = require('../middlewares/is-barman');
const meController = require('../controllers/me-controller');

router.get('/', am(meController.me));

router.put('/', am(meController.updateMe));

router.get('/services', isBarman, am(meController.getBarmanService));
router.post('/services', isBarman, am(meController.addBarmanService));
router.post('/services/delete', isBarman, am(meController.removeBarmanService));

module.exports = router;
