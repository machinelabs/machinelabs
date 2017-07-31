const chalk = require('chalk');
const execute = require('./execute')({displayErrors: true});
const spawn = require('child_process').spawn
const isRootDir = require('./is-root-dir');
const failWith = require('./fail-with');

function loginServer(googleProjectId, zone, serverName) {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }

  console.log(chalk.green(`SSH into ${googleProjectId}/${zone}/${serverName}`));
  
  var child = spawn(`gcloud`, [
    'compute',
    '--project',
    `${googleProjectId}`,
    'ssh',
    '--zone',
    `${zone}`,
    `root@${serverName}`
    ], { stdio: 'inherit' });

}

module.exports = loginServer;



