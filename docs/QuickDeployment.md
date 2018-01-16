# Quick deployment

This document is a shorter, recommended version of the [Deployment document](./Deployment.md).

## Requirements

To run the project you will need:
- [NodeJS](https://nodejs.org/en/) version 8.7.x or higher.
- [MySQL](https://dev.mysql.com/downloads/mysql) version 5.7 or higher.
- [Git](https://git-scm.com)

## Clone the sources and install dependencies

```bash
cd /srv/

# Clone the repo under the 'kapp' folder
git clone https://github.com/K-Fet/K-App.git kapp
cd kapp/

# Launch the update process
chmod +x ./tools/update.sh
chmod +x ./tools/init.js

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

After this initialization script, everything should be in place!

## Launching the application

Now that everything is configured, you just have to launch every instances you prepared:

```bash
# Launch each instance
systemctl start kapp@3000.service
systemctl start kapp@3001.service
systemctl start kapp@3002.service
systemctl start kapp@3003.service

# To enable auto-restart after rebooting the machine
systemctl enable kapp@3000.service
systemctl enable kapp@3001.service
systemctl enable kapp@3002.service
systemctl enable kapp@3003.service
```

`3000..3003` are deducted from the _first port_ and 
the _number of instances_ in the **init.js** script.
For example, here, there are **4** instances and 
the first port is **3000**.
