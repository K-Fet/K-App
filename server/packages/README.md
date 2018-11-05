# Structure of the folder

Your are in the folder `packages`. This folder contains every pieces of code related to business.

Each folder is independent and can't communicate.

## Example

Here is a example of how to structure a package:
```
packages
|-- auth
|   |-- models
|   |   |-- connection-information.js
|   |   |-- jwt.js
|   |   |-- index.js
|   |   |-- ...
|   |-- modules
|   |   |-- accounts
|   |   |   |-- controller.js
|   |   |   |-- index.js
|   |   |   |-- routes.js
|   |   |   `-- services.js
|   |   |-- jwts
|   |   |   |-- controller.js
|   |   |   |-- index.js
|   |   |   |-- routes.js
|   |   |   `-- services.js
|   `-- loader.js
|-- core
|   |-- modules
|   |   |-- ...
|   `-- loader.js
|-- package-loader.js
`-- README.md
```

A _package_ is composed of __modules__ and __models__.

### Modules

A module contains all objects who are highly related (e.g. A `Member` and a `Registration`).
A module should **always** have an `index.js` which export at least 2 things: 
```js
module.exports = {
  routes: "An express Router with services we want to expose",
  services: "An object with services we want to expose to other services from the same package",
}
```

Modules can communicate with each other where packages cannot. They will share _models_ or _utils_.
