const winston = require('winston');
const router = require('express').Router();


router.get('/', (req, res) => {
    winston.debug('API request :');
    res.send('Hello World !');
});

router.use('*', (req, res) => {
    res.sendStatus(404);
});

module.exports = router;
