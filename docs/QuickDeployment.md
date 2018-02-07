# Quick deployment

This document is a shorter, recommended version of the [Deployment document](./Deployment.md).

## Requirements

To run the project you will need:
- [NodeJS](https://nodejs.org/en/) version 8.7.x or higher.
- [Yarn](https://yarnpkg.com)version 1.3.2 or higher.
- [MySQL](https://dev.mysql.com/downloads/mysql) version 5.7 or higher.
- [Git](https://git-scm.com)

After installing NodeJS,
you have to install `node-gyp` as recommended [here](https://www.npmjs.com/package/node-gyp#installation).

## Clone the sources and install dependencies

```bash
cd /srv/

# Clone the repo under the 'kapp' folder
git clone https://github.com/K-Fet/K-App.git kapp
cd kapp/

# Launch the update process
./tools/update.sh
```

## Configure the application

Before launching the app you **must** configure the application.
The easy way is to use this script:
```bash
./tools/init.js
```

It will ask you a bunch of question and install everything as wanted.
To do so, you have to launch this script as ***root***.

What does it do ? 
* Create the _sytemd_ service file 
* Create the database and users in the _mysql_ server
* Ask you if you want a proxy (and can even install one - [Caddy](https://caddyserver.com))
* Create a new secret for [JWT](https://jwt.io)
* Configure an automated backup as you want
* Create an admin account on the app
* Launch server

After this initialization script, everything should be in place!
