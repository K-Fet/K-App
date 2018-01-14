# K-App
K-App application repository

[![license](https://img.shields.io/github/license/K-Fet/K-App.svg)](./LICENSE.md)
[![David](https://img.shields.io/david/K-Fet/K-App.svg)](https://david-dm.org/K-Fet/K-App)
[![David](https://img.shields.io/david/dev/K-Fet/K-App.svg)](https://david-dm.org/K-Fet/K-App)
[![Travis](https://img.shields.io/travis/K-Fet/K-App.svg)](https://travis-ci.org/K-Fet/K-App)
[![Codecov branch](https://img.shields.io/codecov/c/github/K-Fet/K-App.svg)](https://codecov.io/gh/K-Fet/K-App/)

## Usage

For a production environment, please check [this document](./docs/QuickDeployment.md) 
which explain everything :).

## Contribute

To contribute to the project you will need:
- [NodeJS](https://nodejs.org/en/) version 8.7.x or higher.
- [MySQL](https://dev.mysql.com/downloads/mysql) version 5.7 or higher.
- Git. For [windows](https://git-scm.com/downloads), for linux : `sudo apt-get install git`

Optional:
- Text editor: Visual code https://code.visualstudio.com/
- Or a full IDE: [Webstorm](https://www.jetbrains.com/webstorm/)
    (student licence available) 

### Environment

Clone the repo: `git clone https://github.com/K-Fet/K-App.git`.

Install dependencies: `npm install`.

**N.B.:** You will need to configure the database connection and 
also the JWT secret in order to test the app. 
You can quickly edit these settings in `/server/config` (be careful not to commit your changes).

### Launching server and client

#### Back

The back use [expressjs](https://expressjs.com). 
It can be launch with `npm run dev:back`.

It will be available at http://localhost:3000.
For now you have to restart it manually when you make modifications.

Also, a [linter](https://en.wikipedia.org/wiki/Lint_(software)) is configured.
You can check your files with: `npm run eslint`, or check while you edit files with
`npm run eslint:watch`.

Plugins exist for [VSCode](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
and [Webstorm](http://plugins.jetbrains.com/plugin/7494).

Don't forget to set needed environment variables (such as `DB_PWD`)

#### Front

The front is an angular 2 application. It uses _angular-cli_.
You can start developing front with `npm run dev:front`.

The app will be launch at http://localhost:4200. 
It will automatically be reloaded when you edit angular files. 

It will only launch the front so all API calls will not work.
(You can use `npm run dev` to start the back and the front).

All API requests made at the angular app will be transferred to the server.


## Testing (back only)

Launch the tests: `npm test`

Create coverage report: `npm run coverage`
