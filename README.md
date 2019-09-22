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
- [Eslint](https://eslint.org/), [TSlint](https://palantir.github.io/tslint/), [StyleLint](https://stylelint.io/) as linters.

And we use *MySQL* and *MongoDB* as databases.

## Usage

For a production environment, please check [this document](./docs/Deployment.md) 
which explain everything :).


---

## Developing - No Docker

To contribute to the project you will need:
- [NodeJS](https://nodejs.org/en/) version 10.0.x or higher.
- [Yarn](https://yarnpkg.com) version 1.9.0 or higher.
- [MySQL](https://dev.mysql.com/downloads/mysql) version 5.7 or higher. Please note that your MYSQL server must be configured as `case insensitive` in order to perform migration scripts ([how to](https://dba.stackexchange.com/a/69330))
- [MongoDB](https://www.mongodb.com/download-center/community) version 4.0 or higher.
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

### CLI

The application comes with a small _cli_ which provide multiple actions. 
Some of them are used only in production, others are used only in development.

### Configuration

#### `.env`
To configure your environment, copy `/tools/config-samples/.env.example` to `/.env`.
Then you just have to edit field as you want (`cp tools/config-samples/.env.example .env`).

P.S.: The file `.env` is already ignored by git.

#### `proxy.conf.json`

As the project could be used in two different dev env, we need two different configurations for the proxy of the front.

Here, we want to use the docker configuration. So just copy the `local.proxy.conf.json` file using: `cp local.proxy.conf.json proxy.conf.json`

P.S.: The file `.proxy.conf.json` is already ignored by git.


### Environment variables

Environment variables are parsed with [nconf](https://github.com/indexzero/nconf/).
The separator used is `__` and words are transformed into camelCase.

E.g.: `WEB__JWT_SECRET` will be access with `conf.get('web:jwtSecret')`.


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

---

## Developing - Docker

To contribute to the project you will need:
- [docker](https://docs.docker.com/install/): version 19.0.x or higher
- [docker-compose](https://docs.docker.com/compose/install/): version 1.24.0 or higher

Use `cd` to the root directory of the project.

### Configuration

#### `.env` file

To configure your environment, copy `/tools/config-samples/.env.docker.example` to `/.env`.
Then you just have to edit field as you want (`cp tools/config-samples/.env.docker.example .env`).

P.S.: The file `.env` is already ignored by git.

#### `proxy.conf.json`

As the project could be used in two different dev env, we need two different configurations for the proxy of the front.

Here, we want to use the docker configuration. So just copy the `docker.proxy.conf.json` file using: `cp docker.proxy.conf.json proxy.conf.json`

P.S.: The file `.proxy.conf.json` is already ignored by git.

### Lunch containers!

Then: `docker-compose up`

`docker-compose` will create 4 different containers:
- `k-app-mongo`: a mongodb server
- `k-app-mysql`: a mongodb mysql
- `k-app-back`: which run the node process of the backend
- `k-app-front`: which run the process of the frontend 

---

## Testing (back only)

Launch the tests: `yarn test`

Create coverage report: `yarn run coverage`
