# Deployment

This document explain how the server is deployed.

## Requirements

To run the project you will need:
- [NodeJS](https://nodejs.org/en/) version 10.0.X or higher.
- [Yarn](https://yarnpkg.com) version 1.9.0 or higher.
- [MySQL](https://dev.mysql.com/downloads/mysql) version 5.7 or higher.
- [MongoDB](https://www.mongodb.com/download-center/community) version 4.0 or higher.
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

Where `<name>` can be anything like `kapp` or `kapp-staging` (e.g.)

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


### MySQL

Some notes about MySQL:

- MySQL 8+ uses a new authentification process which is not handled yet by node-mysql.
  In order to use MySQL, you need to use the old system with this command :
  `alter user 'USER'@'localhost' identified with mysql_native_password by 'PASSWORD';`.

- By default, mysql on linux is case sensitive, but it must be configured to be insensitive with [this](https://dba.stackexchange.com/questions/59407/).

### MongoDB

There is a work in progress to move everything to a NoSQL database.
It means that we must use two different databases simultaneously for now.

### Releasing a new version

In order to update the server, just use the yarn command:

```bash
yarn version
```

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

N.B.: It's important to name the database exactly the same name as the folder!

### Configure `polkit`

In order to be able to do continuous deployment, we have to let Caddy server restart
the kapp.

Caddy run with the user `www-data` and should be able to do 2 commands:
- `systemctl restart kapp@*`
- `systemctl restart kapp-staging@*`

To do this, we use `polkit`.

Because `debian` uses polkit version 0.105 and we need at least version 0.106,
we must install it ourselves.

#### Install dependencies

We will use `polkit-1.0.115`:

Debian packages are already provided in `tools/config-samples/polkit/debs/`,
to install, run:

```bash
# Install the old version first to have the proper config
apt install policykit-1 
# Install all libs
dpkg -i lib*.deb
# Install polkit
dpkg -i tools/config-samples/polkit/debs/policykit-1_0.115-1_amd64.deb
```

#### Add custom rule

We just need to copy the `.rules` file to the polkit config folder:

```bash
cp tools/config-samples/polkit/42-kapp-restart-instances.rules /etc/polkit-1/rules.d/
```
