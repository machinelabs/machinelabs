import * as minimist from 'minimist';
import {task, src, dest} from 'gulp';
import * as rename from 'gulp-rename';
import * as fs from 'fs';

const argv = minimist(process.argv.slice(2));
const environmentConfigPath = `./src/environments/`;
const personalEnvironmentConfigPath = `./src/environments/personal/`;
const environmentActiveConfigName = 'environment.ts';

function getFilePath(envConfigPath, envName) {
  return `${envConfigPath}environment.${envName}.ts`
}

let isRegularConfig = fs.existsSync(getFilePath(environmentConfigPath, argv.env));
let isPersonalConfig = fs.existsSync(getFilePath(personalEnvironmentConfigPath, argv.env));

task(`config`, (cb) => {

  if (!argv.env) {
    return cb(new Error('passing an environment with --env=<environment name> is mandatory'));
  }
  if (!isRegularConfig && !isPersonalConfig) {
    return cb(new Error('Could not locate env file'));
  }

  return src(isPersonalConfig ? 
              getFilePath(personalEnvironmentConfigPath, argv.env) : 
              getFilePath(environmentConfigPath, argv.env))
            .pipe(rename(environmentActiveConfigName))
            .pipe(dest(`${environmentConfigPath}`));
});
