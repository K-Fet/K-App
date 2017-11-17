const should = require('should');
const sinon = require('sinon');
require('should-sinon');

const Member = require('../../app/models/member');

const spyToJSON = sinon.spy(Member.prototype, 'toJSON');

afterEach('Reset spies', function () {
    spyToJSON.reset();
});

describe('Member model Test', function () {
    it('should initialize without problem', async function () {
        // Given
        // When

        const m = new Member();

        // Then
        m.should.not.be.undefined();
    });

    it('should call #toJSON() when stringify object', async function () {
        // Given
        const m = new Member();

        // When

        JSON.stringify(m);

        // Then

        spyToJSON.should.have.been.calledOnce();
    });
});
