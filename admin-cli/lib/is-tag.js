const execSync = require('child_process').execSync;
const isRootDir = require('./is-root-dir');
const failWith = require('./fail-with');

function isTag () {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }

  try {
    execSync('git describe --tags --exact-match', { stdio: 'pipe' });
    return true;
  }
  catch (e) {
    return false;
  }
}

module.exports = isTag;