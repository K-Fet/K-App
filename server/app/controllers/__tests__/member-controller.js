const httpMocks = require('node-mocks-http');
const memberController = require('../member-controller');

jest.mock('../../services/member-service', () => ({
    async getAllMembers() {
        return [ 'item 1', 'item 2' ];
    },
}));


describe('Member controller tests', () => {
    test('should not fail and send a JSON parsed data', async () => {
        // Given
        const res = httpMocks.createResponse();
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/member/',
            params: {},
        });

        // When
        await memberController.getAllMembers(req, res);


        // Then
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._isJSON()).toBeTruthy();
        expect(res._getData()).toEqual('["item 1","item 2"]');
    });
});
