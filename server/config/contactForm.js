module.exports = {
  CONCERT_MAIL: process.env.CONTACT_CONCERT_MAIL ? process.env.CONTACT_CONCERT_MAIL.split(',') : 'contact@fake.com',
  EVENT_MAIL: process.env.CONTACT_EVENT_MAIL ? process.env.CONTACT_EVENT_MAIL.split(',') : 'contact@fake.com',
  LOST_MAIL: process.env.CONTACT_LOST_MAIL ? process.env.CONTACT_LOST_MAIL.split(',') : 'contact@fake.com',
  WEBSITE_MAIL: process.env.CONTACT_WEBSITE_MAIL ? process.env.CONTACT_WEBSITE_MAIL.split(',') : 'contact@fake.com',
  RECAPTCHA: {
    SECRET: process.env.RECAPTCHA_SECRET || '6LfIS1gUAAAAAKFZgZm1ZOVhzEFDMrD8GcV2W2X2',
  },
};
