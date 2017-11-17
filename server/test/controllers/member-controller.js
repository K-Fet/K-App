const should = require('should');
const sinon = require('sinon');
require('should-sinon');

const proxyquire = require('proxyquire');
const httpMocks = require('node-mocks-http');

// Mock Service
const mockObj = {
    getAllMembers() {
        return Promise.resolve(['item 1', 'item 2']);
    }
};

const memberController = proxyquire('../../app/controllers/member-controller', {
    '../services/member-service': mockObj
});

describe('Member controller tests', function () {
    it('should not fail and send a JSON parsed data', async function () {
        // Given

        const res = httpMocks.createResponse();
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/members/',
            params: {}
        });

        // When
        await memberController.getAllMembers(req, res);


        // Then
        res._isEndCalled().should.be.true();
        res._isJSON().should.be.true();
        res._getData().should.be.equal('["item 1","item 2"]');
    });

    it('should fail correctly if there is a problem in service', async function () {
        // Given

        const res = httpMocks.createResponse();
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/members/',
            params: {}
        });

        const serviceStub = sinon.stub(mockObj, 'getAllMembers');
        serviceStub.throws();

        // When
        await memberController.getAllMembers(req, res);

        // Then
        res._isEndCalled().should.be.true();
        res.statusCode.should.be.equal(500);

        serviceStub.restore();
    });
});

