const chalk = require('chalk');
const execute = require('./execute')({displayErrors: true});
const isRootDir = require('./is-root-dir');
const getCurrentVersion = require('./get-version');
const semver = require('semver');

function incVersion (type) {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }

  console.log(chalk.green(`Current version is:`));
  // All version should be in sync. We use the server version as a reference
  let currentVersion = getCurrentVersion();
  
  return semver.inc(currentVersion, type);
}

module.exports = incVersion;