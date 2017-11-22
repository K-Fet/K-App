# Backups

The server can backup the database automatically.
The automatic task is controlled by `systemd`.


## Backup script

Before creating the scheduler, we can configure the script
`save-all.sh` in the `tools` folder of the project.

The default location for backups is `/srv/kapp/backups/`,
it will delete backups older than 30 days and will only backup 
the `kapp` database.

To change these values, you just have to set your custom environment variables:

- `BACKUP_DIR`: Absolute path of the backup folder, __default__: `/srv/kapp/backups`.
- `MYSQL_UNAME`: Mysql user name, __default__: `root`
- `MYSQL_PWORD`: Mysql password, __default__: `''`
- `MYSQL_DATABASE_NAME`: Mysql database name to backup, __default__: `kapp`
- `KEEP_BACKUPS_FOR`: Days to keep a backup, __default__: `30`


## Configuring the automatic backups

To backup the database every X hours/days/weeks, we use 
a `systemd` _Timer_.

Create a file `/etc/systemd/system/kapp-save.timer`:

```
[Unit]
Description=Timer for daily backup of %i

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

And the related service `/etc/systemd/system/kapp-save.service`:

```
[Unit]
Description=schedule of a backup of the k-app database

[Service]
Type=oneshot
ExecStart=/srv/kapp/tools/save-all.sh

# Override default values
#Environment=BACKUP_DIR=
#Environment=MYSQL_UNAME=
#Environment=MYSQL_PWORD=MySQLPassword
#Environment=MYSQL_DATABASE_NAME=
#Environment=KEEP_BACKUPS_FOR=
```

## Restoring data

To restore the database execute this: 

```bash
gunzip [backupfile.sql.gz]
mysql -u [uname] -p[pass] kapp < [backupfile.sql]
```

NB: will be imported in the `kapp` database which must exists.
