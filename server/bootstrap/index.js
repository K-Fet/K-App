const feed = require('./feed');
const ngrok = require('./ngrok');
const permissions = require('./permissions');
const environment = require('./environment');
const express = require('./express');
const sequelize = require('./sequelize');
const logger = require('./logger');

async function boot(options = {}) {
  environment.start(options);
  logger.start(options);

  // Launch first to be ready when feed start
  await ngrok.start(options);

  await sequelize.start(options);

  await Promise.all([
    feed.start(options),
    permissions.start(options),
    express.start(options),
  ]);
}

module.exports = {
  boot,
};
