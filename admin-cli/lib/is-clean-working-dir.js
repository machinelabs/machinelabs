const execute = require('./execute')({displayErrors: true});
const isRootDir = require('./is-root-dir');
const failWith = require('./fail-with');

function isCleanWorkingDir () {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }
  let ret = execute('git status --porcelain').trim();
  console.log('ret');
  console.log(ret);
  return execute('git status --porcelain').trim() === 0;
}

module.exports = isCleanWorkingDir;