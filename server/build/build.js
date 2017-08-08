const executeFactory = require('./lib/execute');
const execute = executeFactory({displayErrors: true});
const copyConfig = require('./tasks/copy-config');
const execSync = require('child_process').execSync;

const setRootDir = () => {
  process.chdir(__dirname);
  // We are going one directory up to be in ./server
  process.chdir('../');
}

setRootDir();
execute('rm -rf ./dist');
copyConfig();
execute('tsc');

