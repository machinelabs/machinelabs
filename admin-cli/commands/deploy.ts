import * as chalk from 'chalk';
import * as process from 'process';

import { factory } from '../lib/execute';
import { deployServer } from '../lib/deploy-server';
import { deployFirebase } from '../lib/deploy-firebase';
import { deployClient } from '../lib/deploy-client';
import { isTag } from '../lib/is-tag';
import { isCleanWorkingDir } from '../lib/is-clean-working-dir';

let execute = factory({displayErrors: true});

export function deploy (argv) {
  console.log(chalk.green('Deployment mode'));

  if (!isTag()) {
    console.log(chalk.red('Deployments need to be made from tags. Run `cut --help`'));
    process.exit(1);
  }

  if (!isCleanWorkingDir()) {
    console.log(chalk.red('Working directory needs to be clean for deployments'));
    process.exit(1);
  }

  if (argv.cfg.target.serverName && argv.cfg.target.zone && !argv.noServer) {
    deployServer(argv.cfg.target.googleProjectId, argv.cfg.target.serverName, argv.cfg.target.zone, argv.cfg.env);
  }

  if (argv.cfg.target.googleProjectId && !argv.noFb) {
    deployFirebase(argv.cfg.target.googleProjectId);
  }

  if (argv.cfg.target.googleProjectId && argv.cfg.env && !argv.noClient) {
    deployClient(argv.cfg.target.googleProjectId, argv.cfg.env);
  }

  console.log(chalk.red('Uploading tags'));
  execute('git push --tags');
}
