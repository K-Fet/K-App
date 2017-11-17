const should = require('should');
const proxyquire = require('proxyquire');
const mockDB = require('../utils/mock-database');
const Member = require('../../app/models/member');

const MemberDAO = proxyquire('../../app/dao/member-dao', {
    '../../db': {
        getConnection() {
            return mockDB.db;
        },
        '@global': true
    }
});

describe('MemberDAO Test', function () {
    it('should return 2 members', async function () {
        // Given
        const dao = new MemberDAO();
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

        const members = await dao.findAll();

        // Then

        members.should.be.Array().and.have.size(2);
        members.forEach(m => {
            m.should.have.property('firstName').equalOneOf('Harold', 'Root');
        });
    });
});
