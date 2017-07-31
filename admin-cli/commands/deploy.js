const chalk = require('chalk');

const deployServer = require('../lib/deploy-server');
const deployFirebase = require('../lib/deploy-firebase');


function deploy (argv) {
  console.log(chalk.green('Deployment mode'));

  if (argv.cfg.target.serverName && argv.cfg.target.zone && !argv.cfg.noServer) {
    deployServer(argv.cfg.target.serverName, argv.cfg.target.zone, argv.cfg.env);
  }

  if (argv.cfg.target.googleProjectId && !argv.cfg.noFb) {
    deployFirebase(argv.cfg.target.googleProjectId);
  }
}

module.exports = deploy;