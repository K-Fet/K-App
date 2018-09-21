const config = require('./config');
const feed = require('./feed');
const ngrok = require('./ngrok');
const permissions = require('./permissions');
const environment = require('./environment');
const express = require('./express');
const sequelize = require('./sequelize');

async function boot(options = {}) {
  environment.start(options);

  // Launch first to be ready when feed start
  await ngrok.start(options);

  // We can now load config (public URL is known)
  config.start();

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
