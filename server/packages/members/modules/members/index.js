const { loadRouter } = require('./routes');

async function load() {
  const router = loadRouter();

  return { router };
}

module.exports = {
  load,
};
