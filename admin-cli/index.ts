#!/usr/bin/env node

import * as chalk from 'chalk';
import * as yargs from 'yargs';

import { deploy } from './commands/deploy';
import { login } from './commands/login';
import { cutCmd } from './commands/cut';
import { onboard } from './commands/onboard';
import { migrate } from './commands/migrate';

import { tryLoadTemplate } from './lib/load-template';

// set process directory to root directory so that
// we can assume all further commands are realtive to root
setRootDir();

let countTrue = (arr) => arr.reduce((acc,current) => acc + current, 0);
let usedAtLeastOnce = (arr) => countTrue(arr) > 0;
let usedMoreThanOnce = (arr) => countTrue(arr)  > 1;

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
      'noServer': {
        describe: 'Flag to suppress deployment of server',
        boolean: true,
      },
      'noFb': {
        describe: 'Flag to suppress deployment of firebase',
        boolean: true,
      },
      'noClient': {
        describe: 'Flag to suppress deployment of client',
        boolean: true,
      }
    }, sharedOptions), deploy)
    .command('login [<options>]', 'Login to server', sharedOptions, login)
    .command('cut [<options>]', 'Cut a release', {
      major: {
        describe: 'Cuts a new major release',
        boolean: true
      },
      minor: {
        describe: 'Cuts a new minor release',
        boolean: true
      },
      patch: {
        describe: 'Cuts a new patch release',
        boolean: true
      },
      dev: {
        describe: 'Cuts a development pre-release',
        boolean: true
      },
      'dry-run': {
        describe: 'Does a dry run',
        boolean: true
      },
      version: {
        describe: 'Cuts a new release with a specified version',
        type: 'string',
        requiresArg: true
      },
    }, cutCmd)
    .command('onboard [<options>]', 'Onboard waiting users', {
      'dry-run': {
        describe: 'Does a dry run',
        boolean: true
      }
    }, onboard)
    .command(
      'migrate [<options>]',
      `Migrates database with a migration file that contains a function
      with a reference to a firebase database to perform operations for
      migrations.`, {
        'file': {
          describe: `Path to migration file that contains a function
            with a reference to a firebase database to perform database
            operations for migrations.`,
          type: 'string',
          requiresArg: true
        }
    }, migrate)

    .coerce('cfg', cfg => {
      if (cfg.template) {
        if (cfg.target || cfg.env) {
          throw new Error("`cfg.template` option can't be used with `cfg.target` or `cfg.env`")
        }
        const templateConfig = tryLoadTemplate(cfg.template);
        cfg = Object.assign(cfg, templateConfig);
      }
      return cfg;
    })
    .check(argv => {
      if ((argv._.includes('deploy') || argv._.includes('login') || argv._.includes('migrate') || argv._.includes('onboard')) && (!argv.cfg || !argv.cfg.target)) {
        throw new Error('Command needs `target`');
      }

      if (argv.cfg && argv.cfg.target && (!argv.cfg.target.serverName || !argv.cfg.target.googleProjectId || !argv.cfg.target.zone)) {
        throw new Error('`target` option is incomplete');
      }

      if (countTrue([argv.noFb, argv.noServer, argv.noClient]) === 3) {
        throw new Error('`noFb`, `noServer` and `noClient` can not be used in full combination');
      }

      if (usedMoreThanOnce([argv.major, argv.minor, argv.patch, argv.dev])) {
        throw new Error('`major`, `minor`, `patch` and `dev` are mutually exclusive')
      }

      if (argv.version && usedAtLeastOnce([argv.major, argv.minor, argv.patch, argv.dev])) {
        throw new Error('`version` is mutually exclusive with `major`, `minor`, `patch` and `dev`');
      }

      if (argv._.includes('migrate') && !argv.file) {
        throw new Error('Please specify path to migration file using `file` option.');
      }

      if (!argv._.length) {
        yargs.showHelp();
      }

      return true;
    })
    .help()
    .argv;

function setRootDir() {
  process.chdir(__dirname);
  // FIXME: This is kind of fragile. We are going to directories up because we assume the CLI
  // is located at /projectRoot/admin-cli/dist. This would fail if the CLI was somewhere else
  process.chdir('../../');
}
