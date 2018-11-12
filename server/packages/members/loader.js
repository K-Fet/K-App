const { Router } = require('express');

const MODULES = [
  {
    name: 'members',
    // eslint-disable-next-line global-require
    loader: require('./modules/members'),
  },
];

async function load({ express }) {
  const apiRouter = Router();

  express.use('members/api', apiRouter);

  MODULES.map(m => m.loader.load());
}


module.exports = {
  load,
};
