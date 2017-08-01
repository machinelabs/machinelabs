const chalk = require('chalk');
const process = require('process');

const execute = require('../lib/execute')({displayErrors: true});
const deployServer = require('../lib/deploy-server');
const deployFirebase = require('../lib/deploy-firebase');
const deployClient = require('../lib/deploy-client');
const isTag = require('../lib/is-tag');

function deploy (argv) {
  console.log(chalk.green('Deployment mode'));

  if (!isTag()) {
    console.log(chalk.red('Deployments need to be made from tags. Run `cut --help`'));
    process.exit(1);
  }

  if (argv.cfg.target.serverName && argv.cfg.target.zone && !argv.cfg.noServer) {
    deployServer(argv.cfg.target.googleProjectId, argv.cfg.target.serverName, argv.cfg.target.zone, argv.cfg.env);
  }

  if (argv.cfg.target.googleProjectId && !argv.cfg.noFb) {
    deployFirebase(argv.cfg.target.googleProjectId);
  }

  if (argv.cfg.target.googleProjectId && argv.cfg.env && !argv.cfg.noClient) {
    deployClient(argv.cfg.target.googleProjectId, argv.cfg.env);
  }

  console.log(chalk.red('Uploading tags'));
  execute('git push --tags');
}

module.exports = deploy;