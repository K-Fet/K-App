const request = require('supertest');
const permissions = require('../../bootstrap/permissions');
const express = require('../../bootstrap/express');
const sequelize = require('../../bootstrap/sequelize');

async function setup() {
  await sequelize.start();

  await Promise.all([
    permissions.start(),
    express.start({ skipHttpServer: true }),
  ]);
}

async function teardown() {
  await sequelize.sequelize.close();
}

module.exports = {
  setup,
  teardown,
  request() {
    return request(express.app);
  },
};
