const path = require('path');
const fs = require('fs').promises;
const { checkEnv, exec } = require('../utils');

async function deleteOldBackups(backupDir, maxOld) {
  const folderFiles = await fs.readdir(backupDir);

  const backups = await Promise.all(folderFiles
    .filter(f => f.endsWith('.sql.gz'))
    .map(async (b) => {
      const { mtimeMs } = await fs.stat(path.join(backupDir, b));
      return {
        file: b,
        mtimeMs,
      };
    }));

  // maxOld is in number of days
  const limitMs = Date.now() - (maxOld * 1000 * 60 * 60 * 24);

  const deletedFiles = await Promise.all(backups
    .filter(({ mtimeMs }) => mtimeMs < limitMs)
    .map(({ file }) => fs.unlink(file)));

  return deletedFiles.length;
}

async function saveDatabase(host, username, password, database, backupDir) {
  const filename = path.join(backupDir, `${(new Date().toISOString())}.${database}.sql.gz`);
  const command = `mysqldump -h ${host} -u ${username} -p${password} ${database} | gzip -9 > ${filename}`;

  await exec(command);
  return filename;
}

async function run() {
  checkEnv(
    'DB__HOST',
    'DB__USERNAME',
    'DB__PASSWORD',
    'DB__DATABASE',
    'BACKUP_DIR',
    'KEEP_BACKUPS_FOR',
  );
  const {
    DB__HOST, DB__USERNAME, DB__PASSWORD, DB__DATABASE, BACKUP_DIR, KEEP_BACKUPS_FOR,
  } = process.env;

  console.log('[backup] Deleting old backups');
  const count = await deleteOldBackups(BACKUP_DIR, KEEP_BACKUPS_FOR);
  console.log(`[backup] Deleted ${count} old backups`);

  console.log(`[backup] Saving current database '${DB__DATABASE}'`);
  const filename = await saveDatabase(DB__HOST, DB__USERNAME, DB__PASSWORD, DB__DATABASE, BACKUP_DIR);
  console.log(`[backup] Database '${DB__DATABASE}' saved to '${filename}'`);
}

module.exports = {
  run,
};
