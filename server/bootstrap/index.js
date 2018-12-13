const config = require('./config');
const feed = require('./feed');
const ngrok = require('./ngrok');
const permissions = require('./permissions');
const environment = require('./environment');
const express = require('./express');
const sequelize = require('./sequelize');

async function boot(options = {}) {
  environment.start(options);

  // Load config first
  config.start();

  // First batch
  // - ngrok
  // - sequelize
  // - express
  await Promise.all([
    ngrok.start(options),
    sequelize.start(options),
    // Start express (and so moleculer) before synchronising permissions
    // in order to have loaded all auto-generated permissions
    await express.start(options),
  ]);

  // Second batch
  // - feed: Need ngrok
  // - permissions: Need sequelize
  await Promise.all([
    feed.start(options),
    permissions.start(options),
  ]);
}

module.exports = {
  boot,
};
