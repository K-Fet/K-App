#!/usr/bin/env bash
#==============================================================================
#TITLE:            save-all.sh
#DESCRIPTION:      Script to save the mysql database.
#AUTHOR:           tleish - Marc-Antoine Fernandes
#DATE:             2017-11-16
#VERSION:          0.5
#USAGE:            ./save-all.sh

#RESTORE FROM BACKUP
  #$ gunzip < [backupfile.sql.gz] | mysql -u [uname] -p[pass] [dbname]

#==============================================================================
# CUSTOM SETTINGS
#==============================================================================

# directory to put the backup files
${BACKUP_DIR:=/srv/kapp/backups}        # Default backup dir '/srv/kapp/backups'

# MYSQL Parameters
${MYSQL_UNAME:=root}                   # Default username to 'root'
${MYSQL_PWORD:=}                       # Default password to ''
${MYSQL_DATABASE_NAME:=kapp}   # Default database to 'kapp'

# include mysql and mysqldump binaries for cron bash user
PATH=$PATH:/usr/local/mysql/bin

# Number of days to keep backups
${KEEP_BACKUPS_FOR:=30}           # Default is 30 days

#==============================================================================
# METHODS
#==============================================================================

# YYYY-MM-DD
TIMESTAMP="$(date +%F)-$(date +%T)"

function delete_old_backups() {
  if [ -z "$KEEP_BACKUPS_FOR" ]; then
    echo "Skip deleting old backups"
  else
    echo "Deleting $BACKUP_DIR/*.sql.gz older than $KEEP_BACKUPS_FOR days"
    find ${BACKUP_DIR} -type f -name "*.sql.gz" -mtime +${KEEP_BACKUPS_FOR} -exec rm {} \;
  fi
}

function mysql_login() {
  local mysql_login="-u $MYSQL_UNAME"
  if [ -n "$MYSQL_PWORD" ]; then
    local mysql_login+=" -p$MYSQL_PWORD"
  fi
  echo ${mysql_login}
}

function echo_status() {
  printf '\r';
  printf ' %0.s' {0..100}
  printf '\r';
  printf "$1"'\r'
}

function backup_database() {
    backup_file="$BACKUP_DIR/$TIMESTAMP.$1.sql.gz"
    output+="$1 => $backup_file\n"
    echo_status "...backing up $2 of $3 databases: $1"
    $(mysqldump $(mysql_login) $1 | gzip -9 > ${backup_file})
}

function backup_databases() {
    local output=""
    backup_database ${MYSQL_DATABASE_NAME} 1 1
    echo -ne ${output} | column -t
}

function hr(){
  printf '=%.0s' {1..100}
  printf "\n"
}

#==============================================================================
# RUN SCRIPT
#==============================================================================

# Set current directory to here
cd "${0%/*}"
cd ..

# Load error handler
source 'tools/lib/lib.trap.sh'

delete_old_backups
hr
backup_databases
hr
printf "All backed up!\n\n"
exit 0
