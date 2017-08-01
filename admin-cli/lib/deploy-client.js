const chalk = require('chalk');
const execute = require('./execute')({displayErrors: true});
const isRootDir = require('./is-root-dir');
const failWith = require('./fail-with');

function deployClient(project, env) {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }

  console.log(chalk.green(`Deploying client to ${project} with env=${env}`));

  execute(`(cd ./client &&
            npm run node_modules &&
            ng build --prod --environment=${env} &&
            firebase use ${project} &&
            firebase deploy)`);

  console.log(chalk.green('Everything live!'));
}

module.exports = deployClient;