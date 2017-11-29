const should = require('should');
const proxyquire = require('proxyquire');
const mockDB = require('../utils/mock-database');

const { UserDAO } = proxyquire('../../app/dao/user-dao', {
    '../../db': {
        getConnection() {
            return mockDB.db;
        },
        '@global': true
    }
});

describe('UserDAO Test', function () {
    it('should return 2 users', async function () {
        // Given
        const dao = new UserDAO();
        await dao.init();

        mockDB.sendNextCall([
            [ // Rows
                {
                    id: 1,
                    firstName: 'Harold',
                    lastName: 'Finch',
                    school: 'MIT'
                },
                {
                    id: 2,
                    firstName: 'Root',
                    lastName: '',
                    school: 'None'
                }
            ]
        ]);

        // When

        const users = await dao.findAll();

        // Then

        users.should.be.Array().and.have.size(2);
        users.forEach(m => {
            m.should.have.property('firstName').equalOneOf('Harold', 'Root');
        });
    });


    it('should return a single user', async function () {
        // Given
        const dao = new UserDAO();
        await dao.init();

        mockDB.sendNextCall([
            [ // Rows
                {
                    id: 1,
                    firstName: 'Harold',
                    lastName: 'Finch',
                    school: 'MIT',
                    email: 'foo@bar'
                }
            ]
        ]);

        // When

        const user = await dao.findByEmail('foo@bar');

        // Then

        user.should.have.property('email').equal('foo@bar');
    });
});
