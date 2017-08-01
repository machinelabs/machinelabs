const chalk = require('chalk');
const execute = require('./execute')({displayErrors: true});
const isRootDir = require('./is-root-dir');
const failWith = require('./fail-with');
const fs = require('fs');

function deployServer(project, serverName, zone, env) {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }

  console.log(chalk.green('Deploying server'));
  execute(`(cd ./server && npm run node_modules && gulp build --env=${env})`);

  if (!fs.existsSync('./server/dist')) {
    console.log(chalk.red('Dist does not exist. Aborting'));
    process.exit(1);
  }

  // With our current setup transferring the ./dist isn't enough
  // We have to zip the entire directory (takes ages otherwise)
  // Send it over, and then unzip it on the other end

  // zip the server directory
  console.log(chalk.green('Zipping files for better performance'));
  execute(`tar -zcvf machinelabs-server.tar.gz ./server`);

  // copy over
  console.log(chalk.green('Transferring files to server'));
  execute(`gcloud compute copy-files ./machinelabs-server.tar.gz root@${serverName}:/var/machinelabs-server.tar.gz --project "${project}" --zone "${zone}"`);

  // unzip and run
  console.log(chalk.green('Unzipping and restarting services'));
  execute(`gcloud compute --project "${project}" ssh --zone "${zone}" "root@${serverName}" --command "cd /var && tar -zxvf machinelabs-server.tar.gz && rm -rf machinelabs-server && mv server machinelabs-server && pm2 restart all"`);

  console.log(chalk.green('Cleaning up'));

  // Cleanup
  execute(`rm -rf ./machinelabs-server.tar.gz`);
  console.log(chalk.green('Live'));
}

module.exports = deployServer;



