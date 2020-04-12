const { ServiceBroker } = require('moleculer');
const mongoose = require('mongoose');
const { isSameDay, addDays } = require('date-fns');
const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');
const conf = require('nconf');
const JoiValidator = require('../../../utils/joi.validator');
const AuthService = require('../auth.service');

describe('Test acl.auth.service', () => {
  const broker = new ServiceBroker({
    logger: false,
    validator: new JoiValidator(),
  });

  const defaultUserId = mongoose.Types.ObjectId().toString();
  const authenticate = jest.fn(ctx => ({ _id: defaultUserId, email: ctx.params.email }));

  broker.createService({
    name: 'acl.users',
    version: 1,
    actions: {
      authenticate,
    },
  });

  const service = broker.createService(AuthService);
  const { model } = service.adapter;

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe('Test actions', () => {
    describe('check action', () => {
      it('find the related jwt', async () => {
        const id = uuidv4();
        const entity = (await model.create({ _id: id, userId: defaultUserId })).toJSON();
        entity.userId = entity.userId.toString();

        const jwtId = await broker.call('v1.acl.auth.check', { id });

        expect(jwtId).toEqual(entity);
      });

      it('throw if no related jwt', async () => {
        await expect(broker.call('v1.acl.auth.check', { id: uuidv4() })).rejects.toThrow(
          expect.objectContaining({ code: 404 }),
        );
      });
    });

    describe('login action', () => {
      it('should create a jwt token from user', async () => {
        const body = {
          email: 'test@example.com',
          password: 'awesomeComplicated$3Password',
        };

        const token = await broker.call('v1.acl.auth.login', body);

        const rawToken = jwt.verify(token, conf.get('web:jwtSecret'));

        expect(rawToken.userId).toEqual(defaultUserId);
      });

      it('should save jwt in database', async () => {
        const body = {
          email: 'test@example.com',
          password: 'awesomeComplicated$3Password',
        };

        const token = await broker.call('v1.acl.auth.login', body);
        const rawToken = jwt.verify(token, conf.get('web:jwtSecret'));

        const entity = await model.findById(rawToken.jit);

        expect(entity).toBeDefined();
      });

      it('should be limited in time', async () => {
        const body = {
          email: 'test@example.com',
          password: 'awesomeComplicated$3Password',
          rememberMe: 60 * 24 * 5,
        };

        const token = await broker.call('v1.acl.auth.login', body);
        const rawToken = jwt.verify(token, conf.get('web:jwtSecret'));

        expect(rawToken.expiresIn).toBeDefined();
        expect(isSameDay(rawToken.expiresIn * 1000, addDays(new Date(), 5))).toBeTruthy();
      });
    });

    describe('logout action', () => {
      it('should delete entity after logout', async () => {
        const id = uuidv4();

        await model.create({ _id: id, userId: defaultUserId });

        await expect(broker.call(
          'v1.acl.auth.logout',
          {},
          { meta: { jit: id } },
        )).resolves.toBeUndefined();

        expect(await model.count({ _id: id })).toEqual(0);
      });
    });

    describe('revokeAll action', () => {
      it('should delete every token related to user', async () => {
        const userId = mongoose.Types.ObjectId().toString();
        await model.create({ _id: uuidv4(), userId });
        await model.create({ _id: uuidv4(), userId });
        await model.create({ _id: uuidv4(), userId });

        await expect(broker.call('v1.acl.auth.revokeAll', { userId })).resolves.toBeUndefined();

        expect(await model.count({ userId })).toEqual(0);
      });

      it('should not delete other users tokens', async () => {
        const user1 = mongoose.Types.ObjectId().toString();
        const user2 = mongoose.Types.ObjectId().toString();
        await model.create({ _id: uuidv4(), userId: user1 });
        await model.create({ _id: uuidv4(), userId: user2 });
        await model.create({ _id: uuidv4(), userId: user2 });

        await expect(broker.call('v1.acl.auth.revokeAll', { userId: user1 })).resolves.toBeUndefined();

        expect(await model.count({ userId: user1 })).toEqual(0);
        expect(await model.count({ userId: user2 })).toEqual(2);
      });
    });
  });
});
