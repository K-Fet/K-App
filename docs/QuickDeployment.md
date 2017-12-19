# Quick deployment

This document is a shorter, recommended version of the [Deployment document](./Deployment.md).

## Requirements

To run the project you will need:
- [NodeJS](https://nodejs.org/en/) version 8.7.x or higher.
- [MySQL](https://dev.mysql.com/downloads/mysql) version 5.7 or higher.
- [Git](https://git-scm.com)

## Database

You have to configure MySQL for the application.

### Create the database

First connect to _mysql_ shell with ***root*** access,
then create the app database:

```mysql
CREATE DATABASE kapp;
```

Then Sequelize gonna create everything it wants to work.


### Create the user

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


## Clone the sources

```bash
cd /srv/

# Clone the repo under the 'kapp' folder
git clone https://github.com/K-Fet/K-App.git kapp

# Launch the update process
./kapp/tools/update.sh

# Launch the init script and follow instructions
./kapp/tools/init.js
```


## Launching instances

Now that everything is configured, you just have to launch every instances:

```bash
# Launch each instance
systemctl start kapp@3000.service
systemctl start kapp@3001.service
systemctl start kapp@3002.service
systemctl start kapp@3003.service

# To relaunch nodejs after a reboot
systemctl enable kapp@3000.service
systemctl enable kapp@3001.service
systemctl enable kapp@3002.service
systemctl enable kapp@3003.service
```

`3000..3003` are deducted from the _first port_ and 
the _number of instances_ in the **init.js** script.
For example, here, there are **4** instances and 
the first port is **3000**.
