/* eslint-disable require-jsdoc,no-unused-vars */
const { Types } = require('mongoose');
const { initModel } = require('k-app-server/bootstrap/sequelize');
const {
  ConnectionInformation, Barman, SpecialAccount, Permission, Role, Kommission,
} = require('k-app-server/app/models');

const createMap = async (co) => {
  const roles = await co.collection('roles').find({});
  const kommissions = await co.collection('kommissions').find({});

  return {
    roles: Object.fromEntries(roles.map(r => [r._oldId, r._id])),
    kommissions: Object.fromEntries(kommissions.map(k => [k._oldId, k._id])),
  };
};

module.exports = {
  async up(queryInterface, Sequelize, mongoose) {
    const { sequelize } = queryInterface;

    initModel(sequelize);

    await sequelize.sync();

    const { roles, kommissions } = await createMap(mongoose.connection);

    const users = await ConnectionInformation.findAll({
      include: [
        {
          model: Barman,
          as: 'barman',
          include: [
            {
              model: Kommission,
              as: 'kommissions',
            },
            {
              model: Role,
              as: 'roles',
            },
          ],
        },
        {
          model: SpecialAccount,
          as: 'specialAccount',
          include: [
            {
              model: Permission,
              as: 'permissions',
            },
          ],
        },
      ],
    });

    const toInsert = users
      .map(u => u.toJSON())
      .map(u => ({
        _id: Types.ObjectId(),
        email: u.email,
        password: u.password,
        passwordToken: u.passwordToken,
        emailToken: u.emailToken,
        accountType: u.barman ? 'BARMAN' : 'SERVICE',
        account: u.barman
          ? {
            _oldId: u.barman.id,
            firstName: u.barman.firstName,
            lastName: u.barman.lastName,
            nickName: u.barman.nickname,
            leaveAt: u.barman.leaveAt,
            facebook: u.barman.facebook,
            dateOfBirth: u.barman.dateOfBirth,
            godFather: u.barman.godFather,
            flow: u.barman.flow,
            roles: u.barman.roles.map(r => roles[r.id]),
            kommissions: u.barman.kommissions.map(k => kommissions[k.id]),
          }
          : {
            code: u.specialAccount.code,
            description: u.specialAccount.description,
            permissions: u.specialAccount.permissions.map(p => p.name),
          },
      }));

    // Set godFather
    toInsert
      .filter(u => u.accountType === 'BARMAN' && u.barman.godFather)
      .forEach((u) => {
        // eslint-disable-next-line no-param-reassign
        u.account.godFather = toInsert.find(({ account }) => account._oldId === u.account.godFather)._id;
      });

    console.log(`Migrating ${users.length} users from MySQL to MongoDB`);

    await mongoose.connection.collection('users').insertMany(toInsert);
  },

  async down(queryInterface, Sequelize, broker) {
    // Nothing needed, will just not use the admin upgrade permission
  },
};
