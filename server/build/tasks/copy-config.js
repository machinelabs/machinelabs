const minimist = require('minimist');
const fs = require('fs');
const executeFactory = require('../lib/execute');

const argv = minimist(process.argv.slice(2));
const environmentConfigPath = `./src/environments/`;
const personalEnvironmentConfigPath = `./src/environments/personal/`;
const environmentActiveConfigName = 'environment.ts';

const execute = executeFactory({displayErrors: true});

function getFilePath(envConfigPath, envName) {
  return `${envConfigPath}environment.${envName}.ts`
}

module.exports = function () {
  let isRegularConfig = fs.existsSync(getFilePath(environmentConfigPath, argv.env));
  let isPersonalConfig = fs.existsSync(getFilePath(personalEnvironmentConfigPath, argv.env));

  if (!argv.env) {
    throw new Error('passing an environment with --env=<environment name> is mandatory');
  }

  if (!isRegularConfig && !isPersonalConfig) {
    throw new Error('Could not locate env file');
  }

  let filePath = isPersonalConfig ? 
                    getFilePath(personalEnvironmentConfigPath, argv.env) : 
                    getFilePath(environmentConfigPath, argv.env);

  let cmd = `cp ${filePath} ${environmentConfigPath}${environmentActiveConfigName}`;

  console.log(cmd);
  execute(cmd);
}