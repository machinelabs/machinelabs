const executeFactory = require('./lib/execute');
const execute = executeFactory({displayErrors: true});
const copyConfig = require('./tasks/copy-config');
const execSync = require('child_process').execSync;

const setRootDir = () => {
  process.chdir(__dirname);
  // We are going one directory up to be in ./server
  process.chdir('../');
}

let skipShared = process.argv.includes('--skip-shared');

setRootDir();
execute('rm -rf ./dist');
copyConfig();
if (!skipShared) {
  console.log('Building shared libs before building the server');
  execute('(cd ../shared && node build.js)');
} else {
  console.log('--skip-shared used. Not building shared libs.');
}
execute('./node_modules/typescript/bin/tsc');

