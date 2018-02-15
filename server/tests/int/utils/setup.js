const express = require('express');
const request = require('request-promise-native');
const http = require('http');
const { SequelizeMocking } = require('sequelize-mocking');
const routes = require('../../../app/routes/index');
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 2356;
const BASE_URL = `http://localhost:${PORT}/api`;

// Database init
require('../../../db');
require('./sequelize-mock').sequelizeMock();

app.use('/api/', routes);

SequelizeMocking.create(require('../../../db'));

// Express setup

beforeAll(done => {
    server.on('error', () => process.exit(1));
    server.on('listening', () => done());
    server.listen(PORT);
});

afterAll(done => server.close(() => done()));


// Sequelize mocking
beforeAll(async () => {
    await SequelizeMocking.create(require('../../../db'));
});

afterEach(async () => {

});

beforeEach(async () => {

});


// Login setup
beforeAll(async () => {
    const { jwt } = await request({
        uri: BASE_URL + '/auth/login',
        method: 'POST',
        body: {
            username: '',
            password: ''
        }
    });
});

module.exports = {
    BASE_URL
};
