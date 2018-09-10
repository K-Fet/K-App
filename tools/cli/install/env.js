function envSetup() {
  console.log('[install] To setup the environment, copy the file `config-samples/.env.example`');
  console.log('[install]    to `.env` (at the project root)');
  console.log('[install]');
  console.log('[install] Be careful to change WEB__JWT_SECRET by a long generated secret.');
}

module.exports = {
  envSetup,
};
