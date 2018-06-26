function start() {
  // Set global environment

  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  switch (process.env.NODE_ENV) {
    case 'development':
      break;
    case 'production':
      break;
    default:
      break;
  }
}

module.exports = {
  start,
};
