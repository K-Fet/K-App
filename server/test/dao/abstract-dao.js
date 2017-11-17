const should = require('should');
const proxyquire = require('proxyquire');
const mockDB = require('../utils/mock-database');

const AbstractDAO = proxyquire('../../app/dao/abstract-dao', {
    '../../db': {
        getConnection() {
            return mockDB.db;
        },
        '@global': true
    }
});

describe('AbstractDAO Test', function () {
    it('should initialize the database', async function () {
        // Given
        const dao = new AbstractDAO();

        // When
        await dao.init();

        // Then

        dao.should.have.property('db').which.is.a.Object();
    });

    it('should release the connection and reset properties', async function () {
        // Given
        const dao = new AbstractDAO();

        await dao.init();

        // When

        dao.end();

        // Then

        dao.should.have.property('db').which.is.null();
    });
});
