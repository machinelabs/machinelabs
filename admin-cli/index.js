#!/usr/bin/env node

const chalk = require('chalk');

const templates = require('./target-templates/templates');
const deployCmd = require('./commands/deploy');
const loginCmd = require('./commands/login');

const yargs = require('yargs');


// set process directory to root directory so that
// we can assume all further commands are realtive to root
setRootDir();

let sharedOptions = {
      'target.template': {
        describe: `Preinitialize googleProjectId, serverName and zone
                   from a template configuration`,
        type: 'string',
        requiresArg: true
      },
      'target.googleProjectId': {
        describe: `GoogleProjectId to be used`,
        type: 'string',
        requiresArg: true
      },
      'target.serverName': {
        describe: `Name of server to be used`,
        type: 'string',
        requiresArg: true
      },
      'target.zone': {
        describe: `Zone of server`,
        type: 'string',
        requiresArg: true
      }
    };

let argv = yargs(process.argv.slice(2))
    .usage('$0 <cmd> [args]')
    .command('deploy [<options>]', 'Deploy MachineLabs', Object.assign({
      noServer: {
        describe: 'Flag to suppress deployment of server',
        boolean: true,
      },
      noFb: {
        describe: 'Flag to suppress deployment of firebase',
        boolean: true,
      }
    }, sharedOptions), deployCmd)
    .command('login [<options>]', 'Login to server', sharedOptions, loginCmd)
    .coerce('target', target => {

      if (target.template && (target.serverName || target.zone || target.googleProjectId)) {
        throw new Error("`target.template` option can't be used with `target.serverName`, `target.zone` or `target.googleProjectId`.")
      }

      if (target.template && templates[target.template]) {
        target.serverName = templates[target.template].serverName;
        target.zone = templates[target.template].zone;
        target.googleProjectId = templates[target.template].googleProjectId;
      } else if (target.template) {
        throw new Error(`Can't find template ${target.template}`);
      }
      return target;
    })
    .check(argv => {
      if (!argv.target) {
        throw new Error('`target` option is mandatory');
      }

      if (argv.noFb && argv.noServer){
        throw new Error('`noFb` and `noServer` are mutually exclusive');
      }

      return true;
    })
    .help()
    .argv;

function setRootDir() {
  process.chdir(__dirname);
  process.chdir('../');
}