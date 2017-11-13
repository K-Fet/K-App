const should = require('should');
const sinon = require('sinon');
require('should-sinon');
const proxyquire = require('proxyquire');

class MemberStub {
    init() {
        return Promise.resolve();
    }

    findAll() {
        return [
            'item 1',
            'item 2'
        ];
    }

    end() {
    }
}

const memberService = proxyquire('../../app/services/member-service', {
    '../dao/member-dao': MemberStub
});

describe('Member service Test', function () {
    it('should call init and end', async function () {
        // Given

        const initSpy = sinon.spy(MemberStub.prototype, 'init');
        const endSpy = sinon.spy(MemberStub.prototype, 'end');

        // When

        await memberService.getAllMembers();

        // Then
        initSpy.should.have.been.calledOnce();
        endSpy.should.have.been.calledOnce();

        initSpy.calledBefore(endSpy).should.be.true();

        initSpy.restore();
        endSpy.restore();
    });

    it('should return members in array', async function () {
        // Given
        // When

        const members = await memberService.getAllMembers();

        // Then
        members.should.be.an.Array().with.size(2).and.containDeepOrdered(['item 1', 'item 2']);
    });
});
