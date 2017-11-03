const router = require('express').Router();
const helloWorldController = require('../controllers/hello-world-controller');

router.get('/', helloWorldController.sayHelloWorld);

//Test rajoue Micka

module.exports = router;
