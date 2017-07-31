const chalk = require('chalk');

const deployServer = require('../lib/deploy-server');
const deployFirebase = require('../lib/deploy-firebase');
const deployClient = require('../lib/deploy-client');


function deploy (argv) {
  console.log(chalk.green('Deployment mode'));

  if (argv.cfg.target.serverName && argv.cfg.target.zone && !argv.cfg.noServer) {
    deployServer(argv.cfg.target.serverName, argv.cfg.target.zone, argv.cfg.env);
  }

  if (argv.cfg.target.googleProjectId && !argv.cfg.noFb) {
    deployFirebase(argv.cfg.target.googleProjectId);
  }

  if (argv.cfg.target.googleProjectId && argv.cfg.env && !argv.cfg.noClient) {
    deployClient(argv.cfg.target.googleProjectId, argv.cfg.env);
  }
}

module.exports = deploy;