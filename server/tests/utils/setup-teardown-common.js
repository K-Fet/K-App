const express = require('express');
const request = require('request-promise-native');
const http = require('http');
const routes = require('../../app/routes/index');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 2356;
const BASE_URL = `http://localhost:${PORT}/api`;
const ACCOUNT = 'TEST_ADMIN';

const sequelize = require('../../db');
const models = require('../../app/models/index');

const { SpecialAccount, ConnectionInformation, Permission } = models;
const authService = require('../../app/services/auth-service');
const { hash } = require('../../utils/');
const { syncPermissions } = require('../../permissions-init');

app.use('/api/', routes);

let _baseRequest = null;

function startExpress() {
  return new Promise((resolve, reject) => {
    server.on('error', () => reject());
    server.on('listening', () => resolve());
    server.listen(PORT);
  });
}

function closeExpress() {
  return new Promise((resolve, reject) => {
    server.close(() => resolve());
  });
}

async function initDatabase() {
  if (sequelize._syncPromise) {
    await sequelize._syncPromise;
  } else {
    await sequelize.sync();
    await syncPermissions();
  }

  await startExpress();

  const admin = await SpecialAccount.create(
    {
      code: await hash('123456'),
      description: 'Administrator',
      connection: {
        password: await hash(ACCOUNT),
        username: ACCOUNT,
      },
      connectionId: -1,
    },
    {
      include: [
        {
          model: ConnectionInformation,
          as: 'connection',
        },
      ],
    },
  );

  const allPerms = await Permission.findAll();
  await admin.setPermissions(allPerms);

  _baseRequest = request.defaults({
    headers: {
      Authorization: `Bearer ${await authService.createJWT(admin.connection)}`,
    },
    json: true,
  });
}

async function clearDatabase() {
  await closeExpress();
  await sequelize.drop();

  sequelize._syncPromise = null;
}


module.exports = {
  initDatabase,
  clearDatabase,
  startExpress,
  closeExpress,

  site: {
    BASE_URL,
    get baseRequest() {
      return _baseRequest;
    },
  },

};
