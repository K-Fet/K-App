# K-App
K-App application repository

[![license](https://img.shields.io/github/license/K-Fet/K-App.svg)](./LICENSE.md)
[![David](https://img.shields.io/david/K-Fet/K-App.svg)](https://david-dm.org/K-Fet/K-App)
[![David](https://img.shields.io/david/dev/K-Fet/K-App.svg)](https://david-dm.org/K-Fet/K-App)
[![Travis](https://img.shields.io/travis/K-Fet/K-App.svg)](https://travis-ci.org/K-Fet/K-App)
[![Codecov branch](https://img.shields.io/codecov/c/github/K-Fet/K-App.svg)](https://codecov.io/gh/K-Fet/K-App/)


## Introduction

This repo contains the application used to manage the association.

It is written in javascript (back) and typescript (front).
It uses these frameworks:
- [Express](https://expressjs.com) for the web server.
- [Sequelize](http://sequelizejs.com) as ORM.
- [Angular 6](https://angular.io/) for the front app.
- [Eslint](https://eslint.org/) and [TSlint](https://palantir.github.io/tslint/) for linter.

And we use *MySQL* as database.

## Usage

For a production environment, please check [this document](./docs/QuickDeployment.md) 
which explain everything :).


---

## Developing

To contribute to the project you will need:
- [NodeJS](https://nodejs.org/en/) version 8.7.x or higher.
- [Yarn](https://yarnpkg.com) version 1.3.2 or higher.
- [MySQL](https://dev.mysql.com/downloads/mysql) version 5.7 or higher.
- [Python 3](https://www.python.org/download/releases/3.0/) latest version.
- Git. For [windows](https://git-scm.com/downloads), for linux : `sudo apt-get install git`

After installing NodeJS,
you have to install `node-gyp` as recommended 
[here](https://www.npmjs.com/package/node-gyp#installation).

Optional:
- Text editor: Visual code https://code.visualstudio.com/
- Or a full IDE: [Webstorm](https://www.jetbrains.com/webstorm/)
    (student licence available) 

Clone the repo with `git clone https://github.com/K-Fet/K-App.git`.

Then, run `yarn`.

### Configuration

To configure your environnement, you have two choices:

1. Go to `/server/config/` and edit each files with your values.
 Be careful to **NOT COMMIT** these files.

2. Launch the server with environment variables.

### Environment variables

Here are a list _(usually updated)_ of all the environment variables:

###### Database 

* `DB_HOST`: Host for the mysql server (default: `localhost`)
* `DB_USER`: Username for the mysql server (default: `root`)
* `DB_PWD`:  Password for the mysql server (default: ``)
* `DB_DATABASE`: Name of the database (default: `kapp`)
* `DB_DIALECT`: Dialect used (default: `mysql`)

###### Web

* `PORT`: Port for the web app (default: `3000`)
* `HOSTNAME`: Hostname to serve (default: _all interfaces_)
* `TRUSTED_PROXY`: Value for [express's proxy configuration](https://expressjs.com/en/guide/behind-proxies.html)
* `PUBLIC_URL`: Website URL.

###### Email

* `EMAIL_HOST`: SMTP url.
* `EMAIL_PORT`: Port use for SMTP.
* `EMAIL_USER`: Email used to send mail.
* `EMAIL_PASS`: Password of the email.

###### Contact emails

Each variable is a list of email addresses separated by commas (without spaces).

* `CONTACT_CONCERT_MAIL`: Concert events emails
* `CONTACT_EVENT_MAIL`:  Event emails
* `CONTACT_LOST_MAIL`: Lost objects emails
* `CONTACT_WEBSITE_MAIL`: Website problem emails

###### Recaptacha

* `RECAPTCHA_SITE_KEY`: Key used in client side at compilation time (not needed in dev).
* `RECAPTCHA_SECRET`: Secret for the server side (not needed in dev).

###### JWT

* `JWT_SECRET`: JWT secret to use (default: `devModeSecret` only in development)

### Launch server

To launch the app, run: `yarn run dev:back` and `yarn run dev:front` in two terminal instances.

The front will be available at _http://localhost:4200_ and the back at _http://localhost:3000_.

All API calls made to the front will be transferred to the back.

### Notes

As you have to follow *eslint* and *tslint* configured guidelines, 
you can install these plugins to watch linter errors.

* For [VSCode](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
* For [Webstorm](http://plugins.jetbrains.com/plugin/7494)


The app uses [nodemon](https://nodemon.io/) to watch for code change.
The app will restart or reload when you edit the code.

#### Dev scripts

The folder `/tools/` offer scripts to ease development:

- `node tools/prod-scripts/account.js`: Use it to create a default account in the app.
- `node tools/dev-scripts/populate-db.js`: Use it to create fake data.

## Testing (back only)

Launch the tests: `yarn test`

Create coverage report: `yarn run coverage`
