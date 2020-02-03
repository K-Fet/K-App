const { ServiceBroker, Errors: { MoleculerClientError } } = require('moleculer');
const JoiValidator = require('../../../utils/joi.validator');
const UsersService = require('../users.service');

describe('Test acl.users.service', () => {
  const broker = new ServiceBroker({
    logger: false,
    validator: new JoiValidator(),
  });

  const service = broker.createService(UsersService);
  const { model } = service.adapter;

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe('Test methods', () => {
    describe('isEntityOwner method', () => {
      it('should be owner of itself', () => {
        expect(service.isEntityOwner({ meta: { user: { _id: 'user-1' } }, params: { id: 'user-1' } })).toBeTruthy();
      });

      it('should not be owner of another user', () => {
        expect(service.isEntityOwner({ meta: { user: { _id: 'user-2' } }, params: { id: 'user-1' } })).toBeFalsy();
      });
    });

    describe('limitToServiceAccounts method', () => {
      it('should skip accountType != Service account', () => {
        const ctx = {
          meta: { user: { accountType: 'SERVICE' } },
          params: { accountType: 'BARMAN' },
          locals: {},
        };

        expect(() => service.limitToServiceAccounts(ctx)).not.toThrow();
      });

      it('should throw if current user != Service account', () => {
        const ctx = {
          meta: { user: { accountType: 'BARMAN' } },
          params: { accountType: 'SERVICE' },
          locals: {},
        };

        expect(() => service.limitToServiceAccounts(ctx)).toThrow(MoleculerClientError);
      });

      function testMethod({ user, current, next }) {
        return () => service.limitToServiceAccounts({
          meta: { userPermissions: user, user: { accountType: 'SERVICE' } },
          locals: { entity: current ? { accountType: 'SERVICE', account: { permissions: current } } : null },
          params: { accountType: 'SERVICE', account: { permissions: next } },
        });
      }

      it.each([
        { user: ['a'], current: ['a'], next: [] },
        { user: [], current: ['a'], next: ['a'] },
        { user: ['a'], current: null, next: ['a'] },
        { user: ['b'], current: ['a', 'b'], next: ['a'] },
        { user: ['a', 'b'], current: ['a', 'b'], next: [] },
      ])('should pass with permissions %j', (preset) => {
        expect(testMethod(preset)).not.toThrow();
      });

      it.each([
        { user: [], current: [], next: ['a'] },
        { user: [], current: null, next: ['a'] },
        { user: ['a'], current: ['a', 'b'], next: ['a'] },
        { user: ['b'], current: null, next: ['a'] },
      ])('should throw with permissions %j', (preset) => {
        expect(testMethod(preset)).toThrow(MoleculerClientError);
      });
    });

    describe('remoteSensitiveData method', () => {
      it('should remove tokens and password when entity is returned', () => {
        const data = {
          password: 'argon2Hash',
          passwordToken: 'anotherOne',
          emailToken: 'andAgainAnotherOne',
        };

        const res = service.removeSensitiveData({}, data);

        expect(res).not.toHaveProperty('password');
        expect(res).not.toHaveProperty('passwordToken');
        expect(res).not.toHaveProperty('emailToken');
      });

      it('should remove tokens and password when rows are returned', () => {
        const data = {
          password: 'argon2Hash',
        };

        const res = service.removeSensitiveData({}, { rows: [data, data] });

        expect.assertions(2);
        res.rows.forEach(r => expect(r).not.toHaveProperty('password'));
      });

      it('should leave not sensitive fields', () => {
        const data = {
          password: 'argon2Hash',
          otherField: 'AnotherField',
        };

        const res = service.removeSensitiveData({}, data);

        expect(res).not.toHaveProperty('password');
        expect(res).toHaveProperty('otherField');
      });

      it('should not fail if no data', () => {
        const res = service.removeSensitiveData({}, null);

        expect(res).toBe(null);
      });
    });

    describe('getUserByEmail method', () => {
      it('should populate locals with user', async () => {
        await model.create({ email: 'test@example.com', accountType: 'SERVICE', account: {} });

        const ctx = { params: { email: 'test@example.com' }, locals: {} };

        expect(await service.getUserByEmail(ctx)).toBeUndefined();
        expect(ctx.locals.user).toBeDefined();
      });

      it('should fail silently if no user', async () => {
        const ctx = { params: { email: 'unknown@example.com' }, locals: {} };

        expect(await service.getUserByEmail(ctx)).toBeUndefined();
        expect(ctx.locals.user).not.toBeDefined();
      });
    });
  });
});
