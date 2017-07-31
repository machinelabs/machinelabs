const chalk = require('chalk');
const execute = require('./execute')({displayErrors: true});
const isRootDir = require('./is-root-dir');
const failWith = require('./fail-with');

function deployFirebase(project) {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }

  console.log(chalk.green(`Deploying firebase project ${project}`));
  execute(`(cd ./firebase/functions; firebase use ${project} && npm run deploy)`);
}

module.exports = deployFirebase;