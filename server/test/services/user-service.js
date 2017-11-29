const should = require('should');
const sinon = require('sinon');
require('should-sinon');
const proxyquire = require('proxyquire');

class UserDAOStub {
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

const userService = proxyquire('../../app/services/user-service', {
    '../dao/user-dao': { UserDAO: UserDAOStub }
});

describe('User service Test', function () {
    it('should call init and end', async function () {
        // Given

        const initSpy = sinon.spy(UserDAOStub.prototype, 'init');
        const endSpy = sinon.spy(UserDAOStub.prototype, 'end');

        // When

        await userService.getAllUsers();

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

        const members = await userService.getAllUsers();

        // Then
        members.should.be.an.Array().with.size(2).and.containDeepOrdered(['item 1', 'item 2']);
    });
});
