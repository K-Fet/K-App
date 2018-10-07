const logger = require('../server/logger');
const config = require('../server/bootstrap/config');
const sequelize = require('../server/bootstrap/sequelize');
const { Member } = require('../server/app/models');

logger.info('Loading environment variables (dotenv)');
require('dotenv').config();

async function init() {
  config.start();
  await sequelize.start();
}

function formatName(name) {
  const newName = !name ? name
    : name.replace(/[\wÀ-ÿ]+(\S&-)*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
      .replace(/[`~!@#$%^&*()_|+=?;:'",.<>{}[]\\\/]/gi, '');
  return newName;
}

function findSchool(school) {
  if (!school) return 'Autre';

  const INSARegEx = /[insa]\w+/gi;
  const PolytechRegEx = /[pol]\w+/gi;
  const CPERegEx = /[cpe]\w+/gi;
  const Lyon1RegEx = /[cpe]\w+/gi;

  if (school.match(INSARegEx)) return 'INSA';
  if (school.match(PolytechRegEx)) return 'Polytech';
  if (school.match(CPERegEx)) return 'CPE';
  if (school.match(Lyon1RegEx)) return 'Lyon1';

  return 'Autre';
}

async function run() {
  const members = await Member.findAll();
  const promises = [];
  members.foreach((member) => {
    const newMember = member;
    newMember.firstName = formatName(member.firstName);
    newMember.lastName = formatName(member.lastName);
    newMember.school = findSchool(member.school);
    promises.push(newMember.save());
  });
  await Promise.all(promises);
}

init().then(() => run()).then(() => {
  logger.info('Script run succefully');
  process.exit();
}).catch((e) => {
  logger.warn('ERROR: %s', e);
  process.exit();
});
