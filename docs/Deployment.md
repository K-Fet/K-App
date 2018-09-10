# Deployment

This document explain how the server is deployed.

## Requirements

To run the project you will need:
- [NodeJS](https://nodejs.org/en/) version 10.0.X or higher.
- [Yarn](https://yarnpkg.com)version 1.9.0 or higher.
- [MySQL](https://dev.mysql.com/downloads/mysql) version 5.7 or higher.
- [Git](https://git-scm.com)
- [sudo](https://www.sudo.ws/)

After installing NodeJS,
you have to install `node-gyp` as recommended [here](https://www.npmjs.com/package/node-gyp#installation).

## Process

The application work in a continuous deployment system, 
where everything put on master is deployed directly on a _staging_ environment 
and when a new release is made through Github, the server automatically update it-self.

### The server

In a fully configured server, there are multiple things working together:

#### systemd

Systemd is the service manager in Linux. 
It will handle for us _auto-restart_ in case of failure and on reboot.
It will also provide a secure environment for the application.

_Config files are located at_:
- `/etc/systemd/system/<name>@.service`
- `/etc/systemd/system/<name>-backup.service`
- `/etc/systemd/system/<name>-backup.timer`

`<name>`: `kapp` or `kapp-staging` (e.g.)

#### Caddyserver

[Caddy](https://caddyserver.com/) is a really, really good web-server.
We use it for a lot of things:
- SSL/HTTPS for free
- Proxy/Load balancing for NodeJS
- Git hooks (continuous deployment)
- Serving static files

_Config files are located at_:
- `/srv/caddy/Caddyfile`
- `/etc/systemd/system/caddy.service`

#### NodeJS

NodeJS is used by the app. 
It can be launch as many time as we want (with different PORT of course).

_Config files are located at_:
- `/srv/kapp/.env`
- `/srv/kapp-staging/.env`

Each application environment (_production_, _staging_, etc.) needs its own folder.

### Github webhooks

Github must be configured to send a notification to the server 
when a new release is created (production) or when a PR is merge on `master` (staging)


### Releasing a new version

In order to update the server, just release a new version with the script:

```bash
yarn run cli release <version>
```

> `<version>` must be a SemVer version

After that, a new tag is created and you **must** create a Github release (it will update the server).

## First time

### Clone the sources and install dependencies

```bash
cd /srv/

# Clone the repo under the 'kapp' folder
git clone https://github.com/K-Fet/K-App.git kapp
cd kapp/

# Install dependencies
yarn

# Run cli and follow instructions
yarn run cli install
```

### Configure `sudo`

In order to be able to do continuous deployment, we have to let Caddy server restart
the kapp.

Caddy run with the user `www-data` and should be able to do 2 commands:
- `systemctl restart kapp@`
- `systemctl restart kapp-staging@`

To do this, we use `sudo`:

<!-- TODO Sudo -->
