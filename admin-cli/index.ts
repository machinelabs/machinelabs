#!/usr/bin/env node

import * as chalk from 'chalk';
import * as yargs from 'yargs';

import { deployCommand } from './commands/deploy';
import { loginCommand } from './commands/login';
import { cutCommand } from './commands/cut';
import { onboardCommand } from './commands/onboard';
import { exportUsersCommand } from './commands/export-users';
import { migrateCommand } from './commands/migrate';

import { tryLoadTemplate } from './lib/load-template';

// set process directory to root directory so that
// we can assume all further commands are realtive to root
setRootDir();

const commands = [ deployCommand, loginCommand, cutCommand, onboardCommand, migrateCommand];

let sharedOptions = {
      'cfg.template': {
        describe: `Preinitialize googleProjectId, serverName and zone
                   from a template configuration`,
        type: 'string',
        requiresArg: true
      },
      'cfg.googleProjectId': {
        describe: `GoogleProjectId to be used`,
        type: 'string',
        requiresArg: true
      },
      'cfg.server.name': {
        describe: `Name of server to be used`,
        type: 'string',
        requiresArg: true
      },
      'cfg.server.zone': {
        describe: `Zone of server`,
        type: 'string',
        requiresArg: true
      },
      'cfg.server.env': {
        describe: `Environment file for server`,
        type: 'string',
        requiresArg: true
      },
      'cfg.client.env': {
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
    }, sharedOptions), deployCommand.run)
    .command('login [<options>]', 'Login to server', sharedOptions, loginCommand.run)
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
    }, cutCommand.run)
    .command('onboard [<options>]', 'Onboard waiting users', {
      'dry-run': {
        describe: 'Does a dry run',
        boolean: true
      }
    }, onboardCommand.run)
    .command('export-users [<options>]', 'Export csv of all users', {
    }, exportUsersCommand.run)
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
    }, migrateCommand.run)

    .coerce('cfg', cfg => {
      if (cfg.template) {
        if (cfg.server || cfg.client || cfg.firebase) {
          throw new Error("`cfg.template` option can't be used with `cfg.server`, `cfg.client`, `cfg.firebase`")
        }
        const templateConfig = tryLoadTemplate(cfg.template);
        cfg = Object.assign(cfg, templateConfig);
      }
      return cfg;
    })
    .check(argv => {

      commands.forEach(command => command.check(argv));

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
