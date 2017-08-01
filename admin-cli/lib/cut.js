const process = require('process');
const chalk = require('chalk');
const execute = require('./execute')({displayErrors: true});
const isRootDir = require('./is-root-dir');
const incVersion = require('./inc-version');
const getCurrentVersion = require('./get-version');
const moment = require('moment');
const semver = require('semver');

function cut (versionOrType, dryRun) {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }

  let buildnumber = moment().utc().format('utc.YYYY.MMM.DD-H.mm.ss');

  let newVersion;
  if (versionOrType === 'major' || versionOrType === 'minor' || versionOrType === 'patch') {
    newVersion = incVersion(versionOrType);
  } else if (versionOrType === 'dev') {
    // A dev build has the current version number with a dev appended
    // If the current release was already a dev release we make sure
    // to not double append the -dev suffix
    newVersion = `${getCurrentVersion()}-dev`.replace('-dev-dev', '-dev');
  } else {
    newVersion = versionOrType;
  }

  let versionWithBuild = `${newVersion}+${buildnumber}`
  console.log(chalk.green(`New version will be ${versionWithBuild}`));

  if (dryRun) {
    console.log(chalk.green(`Dry run...stopping`));
    process.exit(0);
  }

  let yarnVersionCmd = `yarn version --no-git-tag-version --new-version ${versionWithBuild}`;

  execute(`(cd ./server && ${yarnVersionCmd}) &&
           (cd ./client && ${yarnVersionCmd}) &&
           (cd ./firebase/functions && ${yarnVersionCmd}) &&
           (cd ./admin-cli && ${yarnVersionCmd})`);

  
  execute(`git add -A && 
           git commit -m "Cutting release ${newVersion}" && 
           git tag -a ${newVersion} -m "Cutting ${versionWithBuild}"`)
}

module.exports = cut;