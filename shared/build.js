// The reason we have this here and not in the admin-cli is
// because the admin-cli depends on the shared libs itself what
// kinda brings us into a chicken egg situation. Notice however
// that the admin-cli has a `build-shared` command that basically
// just invokes this script as a convenience command.

const execute = require('child_process').execSync;

let sharedLibs = new Map();
sharedLibs.set('models', []);
sharedLibs.set('core', ['@machinelabs/models']);
sharedLibs.set('metrics', ['@machinelabs/models', '@machinelabs/core']);
sharedLibs.set('supervisor', ['@machinelabs/models', '@machinelabs/core']);

const buildShared = (argv) => {
  console.log('Building shared libs');
  
  sharedLibs.forEach((val, key) => {

    let upgrades = val.reduce((prev, cur) => `${prev} && yarn upgrade ${cur}`, '');
    execute(`(cd ${key} && yarn install ${upgrades} && ./node_modules/typescript/bin/tsc)`, { stdio: 'inherit' });
  });
}

buildShared();
