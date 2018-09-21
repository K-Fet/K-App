# Backups

The server can automatically make backups (using systemd).

N.B.: Don't forget to enable the service (as told on `yarn run cli install`) 


## Force backup

You can quickly backup data by running:
```bash
yarn run cli backup
```

## Restoring data

To restore the database execute this: 

```bash
gunzip [backupfile.sql.gz]
mysql -u [uname] -p[pass] kapp < [backupfile.sql]
```

N.B.: will be imported in the `kapp` database which must exists.
