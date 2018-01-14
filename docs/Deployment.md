# Deployment

This document will explain how to deploy 
the application on a Debian 9 Linux.


A shorter version is available [here](./QuickDeployment.md).


## Backups 

To see how to make automatic backups, see [Backups](./Backups.md).

## First installation

### Requirements

To run the project you will need:
- [NodeJS](https://nodejs.org/en/) version 8.7.x or higher.
- [MySQL](https://dev.mysql.com/downloads/mysql) version 5.7 or higher.
- [Git](https://git-scm.com)


### Systemd configuration

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

# Do not serve directly internet
Environment=HOSTNAME=localhost

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


# JWT Secret
Environment=JWT_SECRET=UltraComplicatedSecret


### SERVER CONFIGURATION

# Launch

Type=simple
WorkingDirectory=/srv/kapp/
ExecStart=/usr/bin/npm run prod
Restart=on-failure
RestartSec=10

# Logging
StandardOutput=syslog
StandardError=syslog

# Security

DynamicUser=yes

# 'CAP_NET_BIND_SERVICE' if PORT is less than 1024
CapabilityBoundingSet=
NoNewPrivileges=yes
ProtectControlGroups=yes
ProtectKernelModules=yes

[Install]
WantedBy=multi-user.target
```


### Proxying / Load balancing

There are several tools that can be used as proxies.
Why add a proxy in front of the _NodeJS_ server?
- **Load balancing**: NodeJS run in a single threaded environment, 
if you want to use all the available CPU cores of your machine, 
you can launch multiple instance of the application and let the load balancer 
share the load between instances.

- **Caching, Compression**: The proxy can send the front app files 
to clients, with compression and cache control.

- **Security**: By default, the NodeJS ***does not*** use _HTTPS_. 
It can be configured in `/server/config/web.js`, but not by environment variables.
Instead, you can add HTTPS directly in the proxy 
(n.b.: data between _Proxy_ and _NodeJS_ ***will not*** be encrypted). 

#### Caddy

[Caddy](https://caddyserver.com/) is a really good web server, with automatic HTTPS, 
and an easy configuration.

First, install _Caddy_ : `curl https://getcaddy.com | bash -s personal http.cache`.

Next create a `Caddyfile` in a private folder (not accessible by the NodeJS server):
You can use `/etc/`

```
kapp.example.com  { # Your site's address

    # Serve client app
    root /srv/kapp/client/dist/
    
    # Compress responses
    gzip
    
    # Set usefull headers
    header / {
        # Cache application for one day
        Cache-Control "public, max-age=86400"
    }
    
    # Log everything to stdout, treated by journalctl
    log stdout
    
    # Proxy request for API
    proxy /api locahost:3000 {
        policy round_robin      # Use round robin for the backend
        fail_timeout 5m         # Time before considering a backend down
        try_duration 4s         # How long proxy will try to find a backend
        transparent             # Set headers as the proxy except
    }
}
```

#### Nginx

[`Nginx`](https://nginx.org/en/) is a well known web server. 
Documentation is available on their site.


### Database configuration

#### Create the database

First connect to mysql shell with ***root*** access,
then create the app database:

```mysql
CREATE DATABASE kapp;
```

Then Sequelize gonna create everything it wants to work.

#### Create the user

Let's start by making two new users within the MySQL shell:

```mysql
CREATE USER 'kapp-user'@'localhost' IDENTIFIED BY 'ComplicatedPassword';
CREATE USER 'kapp-backup'@'localhost' IDENTIFIED BY 'ComplicatedPassword';
```

The first will be for the application, the second will be used to backup data.
To grant access to the database, do this:

```mysql
GRANT ALL ON `kapp`.* TO 'kapp-user'@'localhost';
GRANT SELECT, LOCK TABLES ON `kapp`.* TO 'kapp-backup'@'localhost';
FLUSH PRIVILEGES;
```

### Get the sources

Now that everything is wired up, we can clone the project
and we will be almost done.

```bash
cd /srv/

# Clone the repo under the 'kapp' folder
git clone https://github.com/K-Fet/K-App.git kapp

# Launch the update process to init
./kapp/tools/update.sh
```


## Usage

### Launching

If you want to launch an instance of the server,
do this:

```bash
systemctl start kapp@3000.service
```
With `3000` as the web port. 


### Updating

Updating is quite simple, you just have to launch this script:
```bash
./kapp/tools/update.sh
```

It will pull the latest release from git and restart everything.


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

### One last thing

You will need an admin account to manage your application.

To do that you have to launch this script:
```bash
node ./kapp/tools/prod-scripts/account.js
```

### Ready, Set, Go! 

Everything is ready, we just need to launch an instance of the server.

For this, execute: `systemctl start kapp@3000.service`, 
where `3000` is the web port.

To let the server reboot after machine reboot, 
execute :`systemctl enable kapp@3000.service`
