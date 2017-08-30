import * as chalk from 'chalk';
import * as process from 'process';
import { Observable } from '@reactivex/rxjs';

import { factory } from '../lib/execute';
import { deployServer } from '../lib/deploy-server';
import { deployFirebase } from '../lib/deploy-firebase';
import { deployClient } from '../lib/deploy-client';
import { isTag } from '../lib/is-tag';
import { isCleanWorkingDir } from '../lib/is-clean-working-dir';
import { OutputType, ProcessStreamData } from '@machinelabs/core';

let execute = factory({displayErrors: true});

export function deploy (argv) {
  console.log(chalk.green('Deployment mode'));

  let tasks: Array<Observable<ProcessStreamData>> = [];

  if (!isTag()) {
    console.log(chalk.red('Deployments need to be made from tags. Run `cut --help`'));
    process.exit(1);
  }

  if (!isCleanWorkingDir()) {
    console.log(chalk.red('Working directory needs to be clean for deployments'));
    process.exit(1);
  }

  if (argv.cfg.target.serverName && argv.cfg.target.zone && !argv.noServer) {
    tasks.push(deployServer(argv.cfg.target.googleProjectId, argv.cfg.target.serverName, argv.cfg.target.zone, argv.cfg.env));
  }

  if (argv.cfg.target.googleProjectId && !argv.noFb) {
    tasks.push(deployFirebase(argv.cfg.target.googleProjectId));
  }

  if (argv.cfg.target.googleProjectId && argv.cfg.env && !argv.noClient) {
    tasks.push(deployClient(argv.cfg.target.googleProjectId, argv.cfg.env));
  }

  Observable.concat(...tasks)
            .subscribe(val => {
              if (val.origin === OutputType.Stdout) {
                console.log(val.str);
              } else {
                console.error(chalk.red(val.str));
              }
            }, 
            e => console.error(e), 
            () => {
              console.log(chalk.red('Uploading tags'));
              execute('git push --tags');
            });
}
