const { format } = require('date-fns');

async function read(db, { lastSucceededRun }) {
  const from = format(lastSucceededRun, 'yyyyMMddHHmmss');

  console.log(`Reading every events since ${lastSucceededRun} (${from})`);

  const query = `
    SELECT h.DATE, a.IDART, a.DEF, h.Q_VAR
    FROM (
      Article a INNER JOIN HISTO_STOCK h
      ON a.IDART = h.IDART
    )
    WHERE h.NATURE='V' AND h.DATE>'${from}'
    ORDER BY h.DATE ASC
  `.trim();

  const res = await db.query(query);

  console.log(`Got ${res.length} new events since then`, res);
  return res;
}

module.exports = {
  read,
};
