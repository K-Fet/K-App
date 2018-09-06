const path = require('path');
const fs = require('fs').promises;
// eslint-disable-next-line camelcase
const child_exec = require('child_process');
const util = require('util');
const { checkEnv } = require('../utils');

const exec = util.promisify(child_exec.exec);

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
  const command = `mysqldump -h ${host} -u ${username} -p ${password} ${database} | gzip -9 > ${filename}`;

  await exec(command);
  return filename;
}

async function run() {
  checkEnv(
    'DB_HOST',
    'DB_USER',
    'DB_PWD',
    'DB_DATABASE',
    'BACKUP_DIR',
    'KEEP_BACKUPS_FOR',
  );
  const {
    DB_HOST, DB_USER, DB_PWD, DB_DATABASE, BACKUP_DIR, KEEP_BACKUPS_FOR,
  } = process.env;

  console.log('[backup] Deleting old backups');
  const count = await deleteOldBackups(BACKUP_DIR, KEEP_BACKUPS_FOR);
  console.log(`[backup] Deleted ${count} old backups`);

  console.log(`[backup] Saving current database '${DB_DATABASE}'`);
  const filename = await saveDatabase(DB_HOST, DB_USER, DB_PWD, DB_DATABASE, BACKUP_DIR);
  console.log(`[backup] Database '${DB_DATABASE}' saved to '${filename}'`);
}

module.exports = {
  run,
};
