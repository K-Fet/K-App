const winston = require('winston');
const router = require('express').Router();

router.get('/', (req, res) => {
    winston.debug('API request :');
    res.send('Hello World !');
});

router.get('/dbTest', (req, res) => {
    winston.debug('API request :');
    req.getConnection(function(err,conn){
        if (err) return res.send('Cannot Connect to database');
        conn.query('SELECT 1 + 1 AS solution',function(err,result){
            if(err) return res.send('Mysql error, check your query' + err);
            res.send('Db work, 1 + 1 = ' + result[0].solution);
        });
    });
});

router.use('*', (req, res) => {
    res.sendStatus(404);
});

module.exports = router;
