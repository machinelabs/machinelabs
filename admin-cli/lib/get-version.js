const execute = require('./execute')({displayErrors: true});
const isRootDir = require('./is-root-dir');
const semver = require('semver');

function getVersion () {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }

  return semver.clean(execute(`(cd ./server && node -p -e "require('./package.json').version")`));
}

module.exports = getVersion;