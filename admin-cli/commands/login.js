const loginServer = require('../lib/login-server');

function login (argv) {
  if (argv.target.serverName && argv.target.zone && argv.target.googleProjectId) {
    loginServer(argv.target.googleProjectId, argv.target.zone, argv.target.serverName);
  }
}

module.exports = login;