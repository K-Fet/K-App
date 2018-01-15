const router = require('express').Router();
const am = require('../../utils/async-middleware');
const kommissionController = require('../controllers/kommission-controller');

router.get('/', am(kommissionController.getAllKommissions));

router.post('/', am(kommissionController.createKommission));

router.get('/:id(\\d+)', am(kommissionController.getKommissionById));
router.put('/:id(\\d+)', am(kommissionController.updateKommission));
router.delete('/:id(\\d+)', am(kommissionController.deleteKommission));

module.exports = router;
