const DEV_MAIL = ['contact@fake.com'];

function getMails(name) {
  const row = process.env[`CONTACT_${name}_MAIl`];

  if (!row) return DEV_MAIL;
  return row.split(',').map(m => m.trim());
}

module.exports = {
  CONCERT_MAIL: getMails('CONCERT'),
  EVENT_MAIL: getMails('EVENT'),
  LOST_MAIL: getMails('LOST'),
  WEBSITE_MAIL: getMails('WEBSITE'),
  RECAPTCHA: {
    SECRET: process.env.RECAPTCHA_SECRET || '6LfIS1gUAAAAAKFZgZm1ZOVhzEFDMrD8GcV2W2X2',
  },
};
