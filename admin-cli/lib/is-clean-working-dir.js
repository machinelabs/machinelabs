const execute = require('./execute')({displayErrors: true});
const isRootDir = require('./is-root-dir');
const failWith = require('./fail-with');

function isCleanWorkingDir () {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }
  return execute('git status --porcelain').trim().length === 0;
}

module.exports = isCleanWorkingDir;