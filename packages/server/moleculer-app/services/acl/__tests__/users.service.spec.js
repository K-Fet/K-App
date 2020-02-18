const { ServiceBroker, Errors: { MoleculerClientError, MoleculerServerError } } = require('moleculer');
const JoiValidator = require('../../../utils/joi.validator');
const UsersService = require('../users.service');
const MailService = require('../../service/mail.service');
const { hash, verify } = require('../../../../utils');

describe('Test acl.users.service', () => {
  const broker = new ServiceBroker({
    logger: false,
    validator: new JoiValidator(),
    middlewares: [],
  });

  const mailSend = jest.fn();
  broker.createService(MailService, {
    methods: {
      sendEmail: mailSend,
    },
  });

  const revokeAll = jest.fn();
  broker.createService({
    name: 'acl.auth',
    version: 1,
    actions: {
      revokeAll,
    },
  });

  const service = broker.createService(UsersService);

  const resetPassword = jest.fn();
  broker.createService(UsersService, {
    name: 'user-create',
    actions: {
      resetPassword: {
        handler: resetPassword,
      },
    },
  });

  const adminMeta = {
    user: { accountType: 'SERVICE' },
    userPermissions: ['user.create'],
  };

  const { model } = service.adapter;

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  beforeEach(async () => {
    await model.deleteMany({});
    resetPassword.mockClear();
    mailSend.mockClear();
    revokeAll.mockClear();
  });

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

  describe('Test actions', () => {
    describe('create action', () => {
      it('should create a simple barman', async () => {
        const data = {
          email: 'test+barman@example.com',
          accountType: 'BARMAN',
          account: {
            firstName: 'John',
            lastName: 'Doe',
            nickName: 'Jo',
            dateOfBirth: new Date(1997, 3, 23),
          },
        };

        const user = await broker.call('v1.user-create.create', data, { meta: adminMeta });

        expect(user).toMatchObject(data);
        expect(resetPassword).toHaveBeenCalledTimes(1);
        expect(mailSend).toHaveBeenCalledTimes(1);
      });

      it('should create a simple service account', async () => {
        const data = {
          email: 'test+service@example.com',
          accountType: 'SERVICE',
          account: {
            code: '1234',
            description: 'Example service account',
          },
        };

        const user = await broker.call('v1.user-create.create', data, { meta: adminMeta });

        expect(user).toMatchObject(data);
        expect(resetPassword).toHaveBeenCalledTimes(1);
        expect(mailSend).toHaveBeenCalledTimes(1);
      });

      it('should prevent setting password', async () => {
        const data = {
          email: 'test+service@example.com',
          password: 'password',
          accountType: 'SERVICE',
          account: {
            code: '1234',
            description: 'Example service account',
          },
        };

        await expect(broker.call('v1.user-create.create', data, { meta: adminMeta })).rejects
          .toHaveProperty('type', 'VALIDATION_ERROR');
      });
    });

    describe('list action', () => {
      it('should list all users', async () => {
        await model.insertMany([
          { accountType: 'BARMAN', account: {}, email: 'test+1@example.com' },
          { accountType: 'BARMAN', account: {}, email: 'test+2@example.com' },
          { accountType: 'SERVICE', account: {}, email: 'test+3@example.com' },
        ]);

        const list = await broker.call('v1.acl.users.list', {});

        expect(list).toMatchObject({
          rows: [
            expect.objectContaining({ email: 'test+1@example.com' }),
            expect.objectContaining({ email: 'test+2@example.com' }),
            expect.objectContaining({ email: 'test+3@example.com' }),
          ],
        });
      });

      it('should list only barmen', async () => {
        await model.insertMany([
          { accountType: 'BARMAN', account: {}, email: 'test+1@example.com' },
          { accountType: 'BARMAN', account: {}, email: 'test+2@example.com' },
          { accountType: 'SERVICE', account: {}, email: 'test+3@example.com' },
        ]);

        const list = await broker.call('v1.acl.users.list', { accountType: 'BARMAN' });

        expect(list).toMatchObject({
          rows: [
            expect.objectContaining({ email: 'test+1@example.com' }),
            expect.objectContaining({ email: 'test+2@example.com' }),
          ],
        });
      });

      it('should list only service accounts', async () => {
        await model.insertMany([
          { accountType: 'BARMAN', account: {}, email: 'test+1@example.com' },
          { accountType: 'BARMAN', account: {}, email: 'test+2@example.com' },
          { accountType: 'SERVICE', account: {}, email: 'test+3@example.com' },
        ]);

        const list = await broker.call('v1.acl.users.list', { accountType: 'SERVICE' });

        expect(list).toMatchObject({
          rows: [
            expect.objectContaining({ email: 'test+3@example.com' }),
          ],
        });
      });

      it('should list only active barmen', async () => {
        await model.insertMany([
          {
            accountType: 'BARMAN',
            account: { leaveAt: new Date(2018, 1, 21) },
            email: 'test+1@example.com',
          },
          { accountType: 'BARMAN', account: {}, email: 'test+2@example.com' },
        ]);

        const list = await broker.call('v1.acl.users.list', { accountType: 'BARMAN', onlyActive: true });

        expect(list).toMatchObject({
          rows: [
            expect.objectContaining({ email: 'test+2@example.com' }),
          ],
        });
      });

      it('should not apply onlyActive if accountType is SERVICE', async () => {
        await model.insertMany([
          { accountType: 'BARMAN', account: {}, email: 'test+1@example.com' },
          { accountType: 'SERVICE', account: {}, email: 'test+2@example.com' },
        ]);

        const list = await broker.call('v1.acl.users.list', { accountType: 'SERVICE', onlyActive: true });

        expect(list).toMatchObject({
          rows: [
            expect.objectContaining({ email: 'test+2@example.com' }),
          ],
        });
      });
    });

    describe('update action', () => {
      it('should update simple user', async () => {
        const user = (await model.create({
          email: 'test@example.com',
          accountType: 'SERVICE',
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        })).toObject();

        user._id = user._id.toString();
        user.id = user._id;
        user.account.description = 'New description';

        const updated = await broker.call('v1.acl.users.update', user, { meta: adminMeta });
        const dbUser = await model.findById(user._id).lean();

        expect(updated.account.description).toEqual('New description');
        expect(dbUser.account.description).toEqual('New description');
      });

      it('should fail if user update email while having passwordToken', async () => {
        const user = (await model.create({
          email: 'test@example.com',
          passwordToken: 'bigToken',
          accountType: 'SERVICE',
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        })).toObject();

        user._id = user._id.toString();
        user.id = user._id;
        user.email = 'test+new@example.com';

        await expect(broker.call('v1.acl.users.update', user, { meta: adminMeta })).rejects
          .toHaveProperty('message', expect.stringContaining('You must define a password'));
      });

      it('should keep current email even if updating it', async () => {
        const user = (await model.create({
          email: 'test@example.com',
          accountType: 'SERVICE',
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        })).toObject();

        user._id = user._id.toString();
        user.id = user._id;
        user.email = 'test+new@example.com';

        const updated = await broker.call('v1.acl.users.update', user, { meta: adminMeta });
        const dbUser = await model.findById(user._id).lean();

        expect(updated.email).toEqual('test@example.com');
        expect(dbUser.email).toEqual('test@example.com');
      });

      it('should send email to current email and new email', async () => {
        const user = (await model.create({
          email: 'test@example.com',
          accountType: 'SERVICE',
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        })).toObject();

        user._id = user._id.toString();
        user.id = user._id;
        user.email = 'test+new@example.com';

        await broker.call('v1.acl.users.update', user, { meta: adminMeta });
        const dbUser = await model.findById(user._id).lean();

        expect(mailSend).toHaveBeenCalledTimes(2);
        expect(dbUser.emailToken).toBeDefined();
      });

      it('should throw server error if unable to send email', async () => {
        const user = (await model.create({
          email: 'test@example.com',
          accountType: 'SERVICE',
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        })).toObject();

        user._id = user._id.toString();
        user.id = user._id;
        user.email = 'test+new@example.com';

        mailSend.mockImplementationOnce(() => { throw new Error(); });

        await expect(broker.call('v1.acl.users.update', user, { meta: adminMeta })).rejects
          .toBeInstanceOf(MoleculerServerError);

        expect(mailSend).toHaveBeenCalledTimes(1);
      });
    });

    describe('me action', () => {
      it('should return authenticated user', async () => {
        const user = (await model.create({
          email: 'test@example.com',
          accountType: 'SERVICE',
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        })).toObject();

        const meUser = await broker.call('v1.acl.users.me', {}, { meta: { user: { _id: user._id.toString() } } });

        expect(meUser).toEqual({
          ...user,
          _id: user._id.toString(),
          permissions: [],
        });
      });
    });

    describe('resetPassword action', () => {
      it('should reset password', async () => {
        const user = (await model.create({
          email: 'test@example.com',
          accountType: 'SERVICE',
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        })).toObject();

        user._id = user._id.toString();
        user.id = user._id;

        const res = await broker.call('v1.acl.users.resetPassword', { email: user.email }, { meta: { user } });
        const dbUser = await model.findById(user._id).lean();

        expect(dbUser.passwordToken).toBeDefined();
        expect(res).not.toBeDefined();
        expect(mailSend).toHaveBeenCalledTimes(1);
      });

      it('should prevent reset if email not valid', async () => {
        const user = (await model.create({
          email: 'test@example.com',
          accountType: 'SERVICE',
          emailToken: 'somebigtoken',
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        })).toObject();

        user._id = user._id.toString();
        user.id = user._id;

        await expect(broker.call('v1.acl.users.resetPassword', { email: user.email }, { meta: { user } }))
          .rejects.toBeInstanceOf(MoleculerClientError);
      });

      it('should fail silently if email not found', async () => {
        const user = (await model.create({
          email: 'test@example.com',
          accountType: 'SERVICE',
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        })).toObject();

        user._id = user._id.toString();
        user.id = user._id;

        const res = await broker.call('v1.acl.users.resetPassword', { email: 'unknown@example.com' }, { meta: { user } });

        expect(res).not.toBeDefined();
      });

      it('should fail if unable to send email', async () => {
        const user = (await model.create({
          email: 'test@example.com',
          accountType: 'SERVICE',
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        })).toObject();

        user._id = user._id.toString();
        user.id = user._id;

        mailSend.mockImplementationOnce(() => { throw new Error(); });

        await expect(broker.call('v1.acl.users.resetPassword', { email: user.email }, { meta: { user } }))
          .rejects.toBeInstanceOf(MoleculerServerError);
      });
    });

    describe('definePassword action', () => {
      it('should update password from old password', async () => {
        const user = (await model.create({
          email: 'test@example.com',
          accountType: 'SERVICE',
          password: await hash('oldPassword'),
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        })).toObject();

        await broker.call('v1.acl.users.definePassword', {
          email: user.email,
          oldPassword: 'oldPassword',
          password: 'newPassword123',
        });
        const dbUser = await model.findById(user._id).lean();

        expect(await verify(dbUser.password, 'newPassword123')).toBeTruthy();
      });

      it('should update password from passwordToken', async () => {
        const user = (await model.create({
          email: 'test@example.com',
          accountType: 'SERVICE',
          password: await hash('oldPassword'),
          passwordToken: await hash('token'),
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        })).toObject();

        await broker.call('v1.acl.users.definePassword', {
          email: user.email,
          passwordToken: 'token',
          password: 'newPassword123',
        });
        const dbUser = await model.findById(user._id).lean();

        expect(await verify(dbUser.password, 'newPassword123')).toBeTruthy();
        expect(dbUser.passwordToken).toBeNull();
      });

      it('should send a mail after update', async () => {
        const user = (await model.create({
          email: 'test@example.com',
          accountType: 'SERVICE',
          password: await hash('oldPassword'),
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        })).toObject();

        await broker.call('v1.acl.users.definePassword', {
          email: user.email,
          oldPassword: 'oldPassword',
          password: 'newPassword123',
        });

        expect(mailSend).toHaveBeenCalledTimes(1);
      });

      it('should revoke all token at the end', async () => {
        const user = (await model.create({
          email: 'test@example.com',
          accountType: 'SERVICE',
          password: await hash('oldPassword'),
          passwordToken: await hash('token'),
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        })).toObject();

        await broker.call('v1.acl.users.definePassword', {
          email: user.email,
          passwordToken: 'token',
          password: 'newPassword123',
        });

        expect(revokeAll).toHaveBeenCalledTimes(1);
      });

      it('should fail if no user found with passwordToken', async () => {
        await model.create({
          email: 'test@example.com',
          accountType: 'SERVICE',
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        });

        await expect(broker.call('v1.acl.users.definePassword', {
          email: 'unknown@example.com',
          passwordToken: 'token',
          password: 'newPassword123',
        })).rejects.toHaveProperty('type', 'InvalidRequest');
      });

      it('should fail if no user found with oldPassword', async () => {
        await model.create({
          email: 'test@example.com',
          accountType: 'SERVICE',
          password: await hash('oldPassword'),
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        });

        await expect(broker.call('v1.acl.users.definePassword', {
          email: 'unknown@example.com',
          oldPassword: 'oldPassword',
          password: 'newPassword123',
        })).rejects.toHaveProperty('type', 'LoginError');
      });

      it('should fail if no passwordToken in db', async () => {
        const user = (await model.create({
          email: 'test@example.com',
          accountType: 'SERVICE',
          password: await hash('oldPassword'),
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        })).toObject();

        await expect(broker.call('v1.acl.users.definePassword', {
          email: user.email,
          passwordToken: 'token',
          password: 'newPassword123',
        })).rejects.toHaveProperty('type', 'InvalidRequest');
      });

      it('should fail if passwordToken does not match', async () => {
        const user = (await model.create({
          email: 'test@example.com',
          accountType: 'SERVICE',
          password: await hash('oldPassword'),
          passwordToken: await hash('token'),
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        })).toObject();

        await expect(broker.call('v1.acl.users.definePassword', {
          email: user.email,
          passwordToken: 'notAToken',
          password: 'newPassword123',
        })).rejects.toHaveProperty('type', 'InvalidRequest');
      });

      it('should fail if oldPassword does not match', async () => {
        const user = (await model.create({
          email: 'test@example.com',
          accountType: 'SERVICE',
          password: await hash('oldPassword'),
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        })).toObject();

        await expect(broker.call('v1.acl.users.definePassword', {
          email: user.email,
          oldPassword: 'badPassword',
          password: 'newPassword123',
        })).rejects.toHaveProperty('type', 'LoginError');
      });

      it('should fail if emailToken is already defined', async () => {
        const user = (await model.create({
          email: 'test@example.com',
          accountType: 'SERVICE',
          password: await hash('oldPassword'),
          emailToken: 'exist',
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        })).toObject();

        await expect(broker.call('v1.acl.users.definePassword', {
          email: user.email,
          oldPassword: 'oldPassword',
          password: 'newPassword123',
        })).rejects.toHaveProperty('type', 'UnverifiedEmail');
      });

      it('should work even if mail does not send', async () => {
        const user = (await model.create({
          email: 'test@example.com',
          accountType: 'SERVICE',
          password: await hash('oldPassword'),
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        })).toObject();

        mailSend.mockImplementationOnce(() => { throw new Error(); });

        await broker.call('v1.acl.users.definePassword', {
          email: user.email,
          oldPassword: 'oldPassword',
          password: 'newPassword123',
        });

        expect(revokeAll).toHaveBeenCalledTimes(1);
      });
    });


    describe('authenticate action', () => {
      it('should fail if no user found with passwordToken', async () => {
        await model.create({
          email: 'test@example.com',
          accountType: 'SERVICE',
          account: {
            code: '1234',
            description: 'Test account',
            permissions: [],
          },
        });

        await expect(broker.call('v1.acl.users.definePassword', {
          email: 'unknown@example.com',
          passwordToken: 'token',
          password: 'newPassword123',
        })).rejects.toHaveProperty('type', 'InvalidRequest');
      });
    });
  });
});
