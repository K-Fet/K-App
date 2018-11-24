const mysql = require('mysql2/promise');
const { checkEnv, testConnection } = require('../utils');

function genQueryName(table, field) {
  const prefix = `UPDATE ${table} SET ${field} =`;
  const suffix = 'WHERE id!=0;\n';

  const q = `${prefix} LOWER(${field}) ${suffix}`
    + `${prefix} CONCAT(UPPER(SUBSTR(${field},1,1)),LOWER(SUBSTR(${field},2))) ${suffix}`;

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    .split('')
    .map(letter => `${prefix} REPLACE(${field}, ' ${letter.toLowerCase()}', ' ${letter}') ${suffix}`)
    .join('');

  return q + letters;
}

function genQuerySchool(table) {
  const schools = [
    {
      key: 'INSA',
      match: '^INSA[[:space:]]?(Lyon|$)',
    },
    {
      key: 'Polytech',
      match: 'po?l(y|i)((te)t?ech)?',
    },
    {
      key: 'CPE',
      match: '^CPE$',
    },
    {
      key: 'Lyon 1',
      match: '(Lyon[[:space:]]?1)|((D|I)UT (Gr(a|o))|Fey|GEA)|(^(D|I)UT$)',
    },
    {
      key: 'Lyon 2',
      match: 'Lyon[[:space:]]?2',
    },
    {
      key: 'Lyon 3',
      match: 'Lyon[[:space:]]?3',
    },
    {
      key: 'Autre',
      match: '(^-$)|(\\\\.+)|(^(pas|plus|nop|non))|(^.$)|(^[[:digit:]]+$)',
    },
  ];

  return schools
    .map(s => `UPDATE ${table} SET school = '${s.key}' WHERE school REGEXP '${s.match}';`)
    .join('\n');
}

function getQueries() {
  const firstNameQ = genQueryName('members', 'firstName');
  const lastNameQ = genQueryName('members', 'lastName');
  const schoolQ = genQuerySchool('members');

  return [firstNameQ, lastNameQ, schoolQ].join('\n');
}


async function run() {
  checkEnv(
    'DB__HOST',
    'DB__USERNAME',
    'DB__PASSWORD',
    'DB__DATABASE',
  );

  const co = await mysql.createConnection({
    host: process.env.DB__HOST,
    user: process.env.DB__USERNAME,
    password: process.env.DB__PASSWORD,
    database: process.env.DB__DATABASE,
    multipleStatements: true,
  });

  await testConnection(co);

  const queries = getQueries();
  await co.query(queries);

  console.log('[script][clean-members] Done');
}

module.exports = {
  run,
};
