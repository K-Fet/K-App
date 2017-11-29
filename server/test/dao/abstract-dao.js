const should = require('should');
const proxyquire = require('proxyquire');
const mockDB = require('../utils/mock-database');

const { AbstractDAO } = proxyquire('../../app/dao/abstract-dao', {
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

        dao.should.have.property('_db').which.is.a.Object();
    });

    it('should release the connection and reset properties', async function () {
        // Given
        const dao = new AbstractDAO();

        await dao.init();

        // When

        dao.end();

        // Then

        dao.should.have.property('_db').which.is.null();
    });

    it('should prevent db access if init was not called', async function () {
        // Given
        const dao = new AbstractDAO();

        // When
        // Then

        should.throws(() => {
            dao.db;
        });
    });

    it('should prevent setter for db', async function () {
        // Given
        const dao = new AbstractDAO();

        // When
        // Then

        should.throws(() => {
            dao.db = null;
        });
    });

    it('should return a database object with getter db', async function () {
        // Given
        const dao = new AbstractDAO();

        await dao.init();

        // When

        dao.db;

        // Then
        // If getter fail, an error is thrown => test fail
    });
});
