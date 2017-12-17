const should = require('should');
const sinon = require('sinon');
require('should-sinon');

const proxyquire = require('proxyquire');
const httpMocks = require('node-mocks-http');

// Mock Service
const mockObj = {
    getAllUsers() {
        return Promise.resolve(['item 1', 'item 2']);
    }
};

const userController = proxyquire('../../app/controllers/user-controller', {
    '../services/user-service': mockObj
});

describe('User controller tests', function () {
    it('should not fail and send a JSON parsed data', async function () {
        // Given

        const res = httpMocks.createResponse();
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/user/',
            params: {}
        });

        // When
        await userController.getAllUsers(req, res);


        // Then
        res._isEndCalled().should.be.true();
        res._isJSON().should.be.true();
        res._getData().should.be.equal('["item 1","item 2"]');
    });
});

