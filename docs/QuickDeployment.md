# Quick deployment

This document is a shorter, recommended version of the [Deployment document](./Deployment.md).

## Requirements

To run the project you will need:
- [NodeJS](https://nodejs.org/en/) version 8.7.x or higher.
- [MySQL](https://dev.mysql.com/downloads/mysql) version 5.7 or higher.
- [Git](https://git-scm.com)


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
