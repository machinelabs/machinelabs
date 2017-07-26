const loginServer = require('../lib/login-server');

function login (argv) {
  if (argv.cfg.target.serverName && argv.cfg.target.zone && argv.cfg.target.googleProjectId) {
    loginServer(argv.cfg.target.googleProjectId, argv.cfg.target.zone, argv.cfg.target.serverName);
  }
}

module.exports = login;