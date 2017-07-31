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
      'cfg.template': {
        describe: `Preinitialize googleProjectId, serverName and zone
                   from a template configuration`,
        type: 'string',
        requiresArg: true
      },
      'cfg.target.googleProjectId': {
        describe: `GoogleProjectId to be used`,
        type: 'string',
        requiresArg: true
      },
      'cfg.target.serverName': {
        describe: `Name of server to be used`,
        type: 'string',
        requiresArg: true
      },
      'cfg.target.zone': {
        describe: `Zone of server`,
        type: 'string',
        requiresArg: true
      },
      'cfg.env': {
        describe: `Environment file for server`,
        type: 'string',
        requiresArg: true
      }
    };

let argv = yargs(process.argv.slice(2))
    .usage('$0 <cmd> [args]')
    .command('deploy [<options>]', 'Deploy MachineLabs', Object.assign({
      'cfg.noServer': {
        describe: 'Flag to suppress deployment of server',
        boolean: true,
      },
      'cfg.noFb': {
        describe: 'Flag to suppress deployment of firebase',
        boolean: true,
      },
      'cfg.noClient': {
        describe: 'Flag to suppress deployment of client',
        boolean: true,
      }
    }, sharedOptions), deployCmd)
    .command('login [<options>]', 'Login to server', sharedOptions, loginCmd)
    .coerce('cfg', cfg => {

      if (cfg.template && (cfg.target || cfg.env)) {
        throw new Error("`cfg.template` option can't be used with `cfg.target` or `cfg.env`")
      }

      if (cfg.template && templates[cfg.template]) {
        cfg.target = templates[cfg.template].target;
        cfg.env = templates[cfg.template].env;
      } else if (cfg.template) {
        throw new Error(`Can't find template ${cfg.template}`);
      }
      return cfg;
    })
    .check(argv => {
      if (!argv.cfg.target) {
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