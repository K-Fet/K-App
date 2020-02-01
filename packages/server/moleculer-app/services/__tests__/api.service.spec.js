const { ServiceBroker } = require('moleculer');
const { Errors } = require('moleculer-web');
const conf = require('nconf');
const jwt = require('jsonwebtoken');
const ApiService = require('../api.service');

const BASE_USER = { _id: 1, account: {} };

describe('Test api.service', () => {
  const broker = new ServiceBroker({
    logger: false,
  });

  const call = (name, data) => {
    if (name.endsWith('.check')) {
      if (data.id === 'validId') {
        return ({ userId: 42, _id: 'validId' });
      }
      throw new Error('Invalid id');
    }
    if (name.endsWith('.get')) {
      return BASE_USER;
    }

    throw new Error();
  };

  const service = broker.createService(ApiService);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());


  describe('Test authenticate method', () => {
    it('should return existing user', async () => {
      const user = await service.authenticate({ meta: { user: 12 }, call });

      expect(user).toEqual(12);
    });

    it('should return null when no header', async () => {
      const user = await service.authenticate({ meta: {}, call }, null, { headers: {} });

      expect(user).toBeNull();
    });

    it('should return null when auth header is not a bearer', async () => {
      const user = await service.authenticate({
        meta: {}, call,
      }, null, { headers: { authorization: 'Basic username:password' } });

      expect(user).toBeNull();
    });

    it('should set error if no header', async () => {
      const ctx = { meta: {}, call };
      const user = await service.authenticate(ctx, null, { headers: { authorization: 'Basic username:password' } });

      expect(user).toBeNull();
      expect(ctx.meta.authenticationError).toBe(Errors.ERR_NO_TOKEN);
    });

    it('should decode token and return user', async () => {
      const token = jwt.sign({ jit: 'validId' }, conf.get('web:jwtSecret'));
      const ctx = { meta: {}, call };
      const user = await service.authenticate(ctx, null, { headers: { authorization: `Bearer ${token}` } });

      expect(ctx.meta.authenticationError).not.toBeDefined();
      expect(user).toEqual(BASE_USER);
    });

    it('should save jit in meta', async () => {
      const token = jwt.sign({ jit: 'validId' }, conf.get('web:jwtSecret'));
      const ctx = { meta: {}, call };
      await service.authenticate(ctx, null, { headers: { authorization: `Bearer ${token}` } });

      expect(ctx.meta.authenticationError).not.toBeDefined();
      expect(ctx.meta.jit).toEqual('validId');
    });

    it('should fail if id does not exist', async () => {
      const token = jwt.sign({ jit: 'unknownId' }, conf.get('web:jwtSecret'));
      const ctx = { meta: {}, call };
      await service.authenticate(ctx, null, { headers: { authorization: `Bearer ${token}` } });

      expect(ctx.meta.authenticationError).toEqual(Errors.ERR_INVALID_TOKEN);
    });

    it('should fail if invalid token', async () => {
      const token = jwt.sign({ jit: 'validId' }, 'INVALID_SECRET');
      const ctx = { meta: {}, call };
      await service.authenticate(ctx, null, { headers: { authorization: `Bearer ${token}` } });

      expect(ctx.meta.authenticationError).toEqual(Errors.ERR_INVALID_TOKEN);
    });

    it('should save user permissions in meta', async () => {
      const token = jwt.sign({ jit: 'validId' }, conf.get('web:jwtSecret'));
      const ctx = { meta: {}, call };
      await service.authenticate(ctx, null, { headers: { authorization: `Bearer ${token}` } });

      expect(ctx.meta.authenticationError).not.toBeDefined();
      expect(ctx.meta.userPermissions).toEqual([]);
    });
  });

  describe('Test authorize method', () => {
    it('should pass if user is defined in meta', async () => {
      const ctx = { meta: { user: BASE_USER } };
      await expect(service.authorize(ctx)).resolves.toBeFalsy();
    });

    it('should throw unauthorized error with error', async () => {
      const ctx = { meta: { authenticationError: 'MY_ERROR' } };

      await expect(service.authorize(ctx)).rejects.toBeInstanceOf(Errors.UnAuthorizedError);
      await expect(service.authorize(ctx)).rejects.toHaveProperty('type', 'MY_ERROR');
    });
  });
});
