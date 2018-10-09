function genQueryName(table, field) {
  const prefix = `UPDATE ${table} SET ${field} =`;
  const suffix = 'WHERE id!=0\n';

  const q = `${prefix} LOWER(${field}) ${suffix}`
    + `${prefix} CONCAT(UPPER(SUBSTR(${field},1,1)),LOWER(SUBSTR(${field},2))) ${suffix}`;

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    .split('')
    .map(letter => `${prefix} REPLACE(${field}, ${letter.toLowerCase()}, ${letter}) ${suffix}`)
    .join('');

  return q + letters;
}

function genQuerySchool(table) {
  const schools = [
    {
      key: 'INSA',
      match: '',
    },
    {
      key: 'Polytech',
      match: '',
    },
    {
      key: 'CPE',
      match: '',
    },
    {
      key: 'Lyon 1',
      match: 'Lyon[[:space:]]?1',
    },
    {
      key: 'Lyon 2',
      match: 'Lyon[[:space:]]?2',
    },
    {
      key: 'Autre',
      match: '',
    },
  ];

  return schools
    .map(s => `UPDATE ${table} SET school = ${s.key} WHERE school REGEXP '${s.match}'`)
    .join('\n');
}

function getQueries() {
  const firstNameQ = genQueryName('members', 'firstName');
  const lastNameQ = genQueryName('members', 'lastName');
  const schoolQ = genQuerySchool('members');

  return [firstNameQ, lastNameQ, schoolQ].join('\n');
}


async function run() {
  const queries = getQueries();
  // TODO Execute all of these queries
}

module.exports = {
  run,
};
