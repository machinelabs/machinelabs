const chalk = require('chalk');

const deployServer = require('../lib/deploy-server');
const deployFirebase = require('../lib/deploy-firebase');


function deploy (argv) {
  console.log(chalk.green('Deployment mode'));

  if (argv.target.serverName && argv.target.zone && !argv.target.noServer) {
    deployServer(argv.target.serverName, argv.target.zone);
  }

  if (argv.target.googleProjectId && !argv.target.noFb) {
    deployFirebase(argv.target.googleProjectId);
  }
}

module.exports = deploy;