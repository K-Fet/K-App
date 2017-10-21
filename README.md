# K-App
K-App application repository

[![license](https://img.shields.io/github/license/K-fet/K-App.svg)](./LICENSE.md)
[![David](https://img.shields.io/david/K-fet/K-App.svg)](https://david-dm.org/K-fet/K-App)
[![David](https://img.shields.io/david/dev/K-fet/K-App.svg)](https://david-dm.org/K-fet/K-App)
[![Travis](https://img.shields.io/travis/K-fet/K-App.svg)](https://travis-ci.org/K-fet/K-App)
[![Codecov branch](https://img.shields.io/codecov/c/github/K-fet/K-App.svg)](https://codecov.io/gh/K-fet/K-App/)

## Usage

### Pre-Requisites

To launch the project you will need:
- [NodeJS](https://nodejs.org/en/) version 8.7.x or higher.
- [MySQL](https://dev.mysql.com/downloads/mysql) version 5.7 or higher.


### Getting the sources

You can download the latest release from [here](https://github.com/K-fet/K-App/releases).

### Configuring

All the configuration is in [here](/server/config) :
- _logger.js_: Configuration of the logger [winston](https://github.com/winstonjs/winston).
- _web.js_: Configuration of the web server, like ssl, port of the application, etc.


### Compiling assets and starting the server

1. Run `npm install`.
2. Run `npm build`.
3. Run `npm run prod`.


### Updating

TODO.


## Development

In addition to the default pre-requisites, you will need:

- Git. For [windows](https://git-scm.com/downloads), for linux : `sudo apt-get install git`

Optional:
- Text editor: Visual code https://code.visualstudio.com/
- Or a full IDE: [Webstorm](https://www.jetbrains.com/webstorm/)
    (student licence available) 

### Environment

Clone the repo: `git clone https://github.com/K-fet/K-App.git`.

Install dependencies: `npm install`.

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

## [Licence](./LICENSE)

