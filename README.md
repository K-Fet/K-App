# K-App
K-App application repository

# Require

You need to install:
- NodeJS (npm is included): https://nodejs.org/en/
- Git
  - Windows user: https://git-scm.com/downloads
  - Linux user: sudo apt-get install git

Optional:
- Text editor: Visual code https://code.visualstudio.com/

# Dev

Install project (from root): 
```bash
npm install
```

Launch dev mode (from root): 
```bash
npm run dev
```

It will first launch the server (backend) and then launch angular (frontend).
There will have two things :
* The server who will be available at http://localhost:3000
* The angular app who will be available at http://localhost:4200

All api requests made at the angular app will be transferred to the server.
