# Deployment

This document will explain how to deploy 
the application on a Debian 9 Linux.

## Backups 

To see how to make automatic backups, see [Backups](./Backups.md).

## First installation

### Requirements

First of all, let's install all the required modules.

#### NodeJS

The server need NodeJS v8.4 and higher only.

```bash
sudo apt-get -y install curl
curl -sL https://deb.nodesource.com/setup_8.x | sudo bash -
sudo apt-get -y install nodejs
```

### Get the latest release

```bash
cd /srv/

# Clone the repo under the 'kapp' folder
git clone https://github.com/K-Fet/K-App.git kapp

# Launch the update process
./kapp/tools/update.sh

```

Here we use the `/srv/kapp` base folder for our app. 
Be free to change it, but this will change 
the service config and the backup config.


### Create a specified user

You don't want to run the app as `root` :)

Execute : `adduser kapp -s /bin/null`

- `-s`: User's login shell. Set to null, we don't want somebody to start a bash


### Service file

We will use `systemd` to monitor and control our app.
We need to create a new file containing the service configuration.

Create a new file `/etc/systemd/system/kapp@.service` with: 

```
[Unit]
Description=K-App provide a large panel of useful tools for associations
Documentation=https://github.com/K-Fet/K-App
After=network.target mysql.service

[Service]

######################################################
##
##      NODEJS SERVER CONFIGURATION
##

# Port where the server will listen
# With '%i' we can launch app with `systemctl start kapp@3000`
Environment=PORT=%i                     

#  Database configuration
#       Default can be found in the /server/config/ folder of the project.

# MySQL address
#Environment=DB_HOST=myexternaldatabase.com:4245

# Login user/password
Environment=DB_USER=kapp
Environment=DB_PWD=ComplicatedPassword

# Database to use
#   Warning: if define, backup config must also be changed.
#Environment=DB_DATABASE=my_awesome_database


######################################################
##
##      SERVICE CONFIGURATION
##
Type=simple
User=kapp
WorkingDirectory=/srv/kapp/
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```


### Database

TODO:

- Create database
- Create user (with only the right database)


## Updating

To update the project, you just have to execute this script: 
`./tools/update.sh`

It will pull the latest release from git and restart everything.
