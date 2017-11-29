const should = require('should');
const sinon = require('sinon');
require('should-sinon');

const { User } = require('../../app/models/user');

const spyToJSON = sinon.spy(User.prototype, 'toJSON');

afterEach('Reset spies', function () {
    spyToJSON.reset();
});

describe('User model Test', function () {
    it('should initialize without problem', async function () {
        // Given
        // When

        const u = new User();

        // Then
        u.should.not.be.undefined();
    });

    it('should call #toJSON() when stringify object', async function () {
        // Given
        const m = new User();

        // When

        JSON.stringify(m);

        // Then

        spyToJSON.should.have.been.calledOnce();
    });

    it('should not return password when #toJSON()', async function () {
        // Given
        const m = new User();
        m.password = 'MyPassword';

        // When

        const j = m.toJSON();

        // Then

        j.should.not.have.property('password');
    });

    it('should parse user correctly', async function () {
        // Given
        // When

        const m = User.parse({
            id: 5
        });

        // Then

        m.should.be.instanceOf(User).and.have.property('id').equal(5);
    });

    it('should return null if data is undefined', async function () {
        // Given
        // When

        const m = User.parse();

        // Then

        should(m).be.null();
    });
});
