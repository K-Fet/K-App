const feed = require('./feed');
const ngrok = require('./ngrok');
const permissions = require('./permissions');
const environment = require('./environment');
const express = require('./express');
const sequelize = require('./sequelize');
const logger = require('./logger');

async function boot() {
  environment.start();
  logger.start();

  // Launch first to be ready when feed start
  await ngrok.start();

  await sequelize.start();

  await Promise.all([
    feed.start(),
    permissions.start(),
    express.start(),
  ]);
}

module.exports = {
  boot,
};
