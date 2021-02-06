const { Service } = require('node-windows');
const path = require('path');
const pkg = require('../package');

if (process.platform !== 'win32') {
  console.error('This script is only for Windows for now!');
  process.exit(1);
}

// Create a new service object
const svc = new Service({
  name: pkg.name,
  description: pkg.description,
  script: path.join(__dirname, '..', 'index.js'),
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall', () => {
  console.log('Uninstall complete.');
  console.log('The service exists: ', svc.exists);
});

// Uninstall the service.
svc.uninstall();
