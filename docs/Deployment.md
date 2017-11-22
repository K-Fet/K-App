# Deployment

This document will explain how to deploy 
the application on a Debian 9 Linux.

## Backups 

To see how to make automatic backups, see [Backups](./Backups.md).

## First installation

### Requirements

To run the project you will need:
- [NodeJS](https://nodejs.org/en/) version 8.7.x or higher.
- [MySQL](https://dev.mysql.com/downloads/mysql) version 5.7 or higher.


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
Environment=HOSTNAME=localhost      # Do not serve directly internet

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


### SERVER CONFIGURATION

# Launch

Type=simple                         # No child process
WorkingDirectory=/srv/kapp/         # Set working directory
ExecStart=/usr/bin/npm run prod     # Run command line
Restart=on-failure                  # Restart only on failure (exit > 0)
RestartSec=10                       # Minimum duration the server must be up

# Logging
StandardOutput=syslog
StandardError=syslog

# Security

DynamicUser=yes                     # See https://www.freedesktop.org/software/systemd/man/systemd.exec.html#DynamicUser=
CapabilityBoundingSet=              # 'CAP_NET_BIND_SERVICE' if PORT is less than 1024
NoNewPrivileges=yes                 # Prevent privilege escalation
ProtectControlGroups=yes
ProtectKernelModules=yes

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

#### Create the database

First connect to mysql shell with ***root*** access,
then create the app database:

```mysql
CREATE DATABASE kapp;
```

Then launch the script `/tools/sql/init.sql` to create the database structure:
```mysql
source /path/to/tools/sql/init.sql;
```


#### Create the user

Let's start by making a new user within the MySQL shell:

```mysql
CREATE USER 'kapp'@'localhost' IDENTIFIED BY 'ComplicatedPassword';
```

This user has no permissions to do anything (even login). 
To grant access to the database, do this:

```mysql
GRANT USAGE, SELECT, INSERT, UPDATE, DELETE ON `kapp`.* TO 'kapp'@'localhost';
FLUSH PRIVILEGES;
```


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

### Nginx

[`Nginx`](https://nginx.org/en/) is a well known web server. 
Documentation is available on their site.

