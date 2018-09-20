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

For a production environment, please check [this document](./docs/Deployment.md) 
which explain everything :).


---

## Developing

To contribute to the project you will need:
- [NodeJS](https://nodejs.org/en/) version 10.0.x or higher.
- [Yarn](https://yarnpkg.com) version 1.9.0 or higher.
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

### CLI

The application comes with a small _cli_ which provide multiple actions. 
Some of them are used only in production, others are used only in development.

### Configuration

To configure your environment, copy `/tools/config-samples/.env.example` to `/.env`.
Then you just have to edit field as you want (`cp tools/config-samples/.env.example .env`).

P.S.: The file `.env` is already ignored by git.


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

## Testing (back only)

Launch the tests: `yarn test`

Create coverage report: `yarn run coverage`
