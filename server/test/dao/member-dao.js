const should = require('should');

// Mock database for testing purpose
const db = require('../utils/mock-database');

const MemberDAO = require('../../app/dao/member-dao');
const Member = require('../../app/models/member');

describe('MemberDAO Test', function () {
    it('should return 2 members', async function () {
        // Given
        const dao = new MemberDAO();
        await dao.init();

        db.sendNextCall([
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
            m.should.be.instanceOf(Member);
            m.should.have.property('firstName').equalOneOf('Harold', 'Root');
        });
    });
});
