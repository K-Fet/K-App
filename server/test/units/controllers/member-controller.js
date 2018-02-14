const should = require('should');
const sinon = require('sinon');
require('should-sinon');

const proxyquire = require('proxyquire');
const httpMocks = require('node-mocks-http');

// Mock Service
const mockObj = {
    getAllMembers() {
        return Promise.resolve([ 'item 1', 'item 2' ]);
    }
};

const memberController = proxyquire('../../app/controllers/member-controller', {
    '../services/member-service': mockObj
});

describe('Member controller tests', () => {
    it('should not fail and send a JSON parsed data', async () => {
        // Given

        const res = httpMocks.createResponse();
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/member/',
            params: {}
        });

        // When
        await memberController.getAllMembers(req, res);


        // Then
        res._isEndCalled().should.be.true();
        res._isJSON().should.be.true();
        res._getData().should.be.equal('["item 1","item 2"]');
    });
});

