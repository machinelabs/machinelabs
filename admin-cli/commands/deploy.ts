import * as chalk from 'chalk';
import * as process from 'process';
import { Observable, concat } from 'rxjs';

import { factory } from '../lib/execute';
import { deployServer } from '../lib/deploy-server';
import { deployFirebase } from '../lib/deploy-firebase';
import { deployClient } from '../lib/deploy-client';
import { deployRestApi } from '../lib/deploy-rest-api';
import { isTag } from '../lib/is-tag';
import { isCleanWorkingDir } from '../lib/is-clean-working-dir';
import { OutputType, ProcessStreamData } from '@machinelabs/core';
import { Command } from './command';
import { countTrue } from '../lib/utils';

const execute = factory({ displayErrors: true });

const hasArgsForServerDeploy = argv =>
  argv.cfg && argv.cfg.server.name && argv.cfg.server.zone && argv.cfg.server.env && argv.cfg.googleProjectId;
const hasArgsForFirebaseDeploy = argv => argv.cfg && argv.cfg.googleProjectId;
const hasArgsForRestApiDeploy = argv => argv.cfg && argv.cfg.googleProjectId && argv.cfg.rest.env;
const hasArgsForClientDeploy = argv => argv.cfg && argv.cfg.googleProjectId && argv.cfg.client.env;

const deploy = argv => {
  console.log(chalk.green('Deployment mode'));

  const tasks: Array<Observable<ProcessStreamData>> = [];

  if (!isTag()) {
    console.log(chalk.red('Deployments need to be made from tags. Run `cut --help`'));
    process.exit(1);
  }

  if (!isCleanWorkingDir()) {
    console.log(chalk.red('Working directory needs to be clean for deployments'));
    process.exit(1);
  }

  if (hasArgsForServerDeploy(argv) && !argv.noServer) {
    tasks.push(deployServer(argv.cfg.googleProjectId, argv.cfg.server.name, argv.cfg.server.zone, argv.cfg.server.env));
  }

  if (hasArgsForFirebaseDeploy(argv) && !argv.noFb) {
    tasks.push(deployFirebase(argv.cfg.googleProjectId));
  }

  if (hasArgsForClientDeploy(argv) && !argv.noClient) {
    tasks.push(deployClient(argv.cfg.googleProjectId, argv.cfg.client.env));
  }

  if (hasArgsForRestApiDeploy(argv) && !argv.noRest) {
    tasks.push(deployRestApi(argv.cfg.googleProjectId, argv.cfg.rest.env));
  }

  concat(...tasks).subscribe(
    val => {
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
    }
  );
};

const check = argv => {
  if (argv._.includes('deploy')) {
    if (!argv._.includes('noServer') && !hasArgsForServerDeploy(argv)) {
      throw new Error(
        'Command needs `cfg.server.name`, `cfg.server.zone`, `argv.server.env` and `cfg.googleProjectId`'
      );
    }

    if (!argv._.includes('noFb') && !hasArgsForFirebaseDeploy(argv)) {
      throw new Error('Command needs `cfg.googleProjectId`');
    }

    if (!argv._.includes('noClient') && !hasArgsForClientDeploy(argv)) {
      throw new Error('Command needs `cfg.googleProjectId` and `cfg.client.env`');
    }

    if (!argv._.includes('noRest') && !hasArgsForRestApiDeploy(argv)) {
      throw new Error('Command needs `cfg.googleProjectId` and `cfg.rest.env`');
    }
  }

  if (countTrue([argv.noFb, argv.noServer, argv.noClient, argv.noRest]) === 4) {
    throw new Error('`noFb`, `noServer`, `noClient` and `noRest` can not be used in full combination');
  }
};

export const deployCommand = {
  run: deploy,
  check: check
};
