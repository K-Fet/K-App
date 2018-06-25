const DEV_MAIL = ['contact@fake.com'];

module.exports = {
  CONCERT_MAIL: process.env.CONTACT_CONCERT_MAIL ? process.env.CONTACT_CONCERT_MAIL.split(',') : DEV_MAIL,
  EVENT_MAIL: process.env.CONTACT_EVENT_MAIL ? process.env.CONTACT_EVENT_MAIL.split(',') : DEV_MAIL,
  LOST_MAIL: process.env.CONTACT_LOST_MAIL ? process.env.CONTACT_LOST_MAIL.split(',') : DEV_MAIL,
  WEBSITE_MAIL: process.env.CONTACT_WEBSITE_MAIL ? process.env.CONTACT_WEBSITE_MAIL.split(',') : DEV_MAIL,
  RECAPTCHA: {
    SECRET: process.env.RECAPTCHA_SECRET || '6LfIS1gUAAAAAKFZgZm1ZOVhzEFDMrD8GcV2W2X2',
  },
};
