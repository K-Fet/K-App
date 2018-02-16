const express = require('express');
const request = require('request-promise-native');
const http = require('http');
const routes = require('../../../app/routes/index');
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 2356;
const BASE_URL = `http://localhost:${PORT}/api`;
const ACCOUNT = 'TEST_ADMIN';

const sequelize = require('../../../db');
const { SequelizeMocking } = require('sequelize-mocking');
const { SpecialAccount, ConnectionInformation } = require('../../../app/models');
const { hash } = require('../../../utils');

app.use('/api/', routes);

// Express setup

beforeAll(done => {
    server.on('error', () => process.exit(1));
    server.on('listening', () => done());
    server.listen(PORT);
});

afterAll(done => server.close(() => done()));


// Sequelize mocking
beforeAll(async () => {
    await SequelizeMocking.create(sequelize);

    await SpecialAccount.create({
        code: await hash('123456'),
        description: 'Administrator',
        connection: {
            password: await hash(ACCOUNT),
            username: ACCOUNT
        }
    }, {
        include: [{
            model: ConnectionInformation,
            as: 'connection'
        }]
    });
});

afterEach(async () => {

});

beforeEach(async () => {

});


// Login setup
let _baseRequest;

beforeAll(async () => {
    const { jwt } = await request({
        uri: BASE_URL + '/auth/login',
        method: 'POST',
        body: {
            username: ACCOUNT,
            password: ACCOUNT
        }
    });

    _baseRequest = request.defaults({
        auth: {
            bearer: jwt
        }
    });
});

module.exports = {
    BASE_URL,
    get baseRequest() {
        return _baseRequest;
    }
};
