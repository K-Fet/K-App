const router = require('express').Router();
const memberController = require('../controllers/member-controller');

router.get('/', memberController.getAllMembers);

module.exports = router;
