# Deployment

This document will explain how to deploy 
the application on a Debian 9 Linux.

## First installation

### Requirements

First of all, let's install all the required modules.

#### NodeJS

```bash
sudo apt-get -y install curl
curl -sL https://deb.nodesource.com/setup_8.x | sudo bash -
sudo apt-get -y install nodejs
```


### Create a specified user

You don't want to run the app as `root` :)

Execute : `adduser kapp -m -s /bin/null`

- `-m`: Create a home directory (where we will set the server)
- `-s`: User's login shell. Set to null, we don't want somebody to start a bash


### Service file

We will use `systemd` to monitor our app.
We need to create a new file containing the service configuration.

Create a new file `/etc/systemd/system/kapp@.service` with: 

```
[Unit]
Description=K-App provide a large panel of useful tools for associations
Documentation=https://github.com/K-Fet/K-App
After=network.target mysql.service

[Service]
Environment=PORT=%i
Type=simple
User=kapp
WorkingDirectory=/home/kapp/K-App/
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

### Configuring the automatic backups

To backup safely the database every X hours/days/weeks, we use 
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
ExecStart=/home/kapp/K-App/tools/save-all.sh
```

