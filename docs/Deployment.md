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
ExecStart=/usr/bin/npm run prod
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog

[Install]
WantedBy=multi-user.target
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

### Ready, Set, Go! 

Everything is ready, we just need to launch an instance of the server.

For this, execute: `systemctl start kapp@3000.service`, 
where `3000` is the web port.

To let the server reboot after machine reboot, 
execute :`systemctl enable kapp@3000.service`

### Database

TODO:

- Create database
- Create user (with only the right database)


## Updating

To update the project, you just have to execute this script: 
`./tools/update.sh`

It will pull the latest release from git and restart everything.

## Proxying / Load balancing

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

### Caddy

[Caddy](https://caddyserver.com/) is a really good web server, with automatic HTTPS, 
and an easy configuration.

First, install _Caddy_ : `curl https://getcaddy.com | bash -s personal http.cache`.

Next create a `Caddyfile` anywhere you want:

```
kapp.example.com   # Your site's address

#####
##### TODO :
#####   - Add caching
#####   - Complete proxy
#####   - Compression
#####   - Loging

# API load balancer
proxy /api localhost:3000 localhost:3000


```

### Nginx

[`Nginx`](https://nginx.org/en/) is a well known web server. 
Documentation is available on their site.

