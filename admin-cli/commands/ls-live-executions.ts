import * as chalk from 'chalk';
import { DbRefBuilder } from '@machinelabs/core';
import { createDb } from '../lib/create-db';
import { getEnv } from '../lib/get-env';
import { LiveMetricsService } from '@machinelabs/metrics';
import { from } from 'rxjs';
import { map, filter, mergeMap } from 'rxjs/operators';
import { printExecutionHeader, printExecution } from '../lib/print-execution';

const hasArgsForCmd = argv =>
  argv.cfg && argv.cfg.firebase.privateKeyEnv && argv.cfg.firebase.clientEmailEnv && argv.cfg.firebase.databaseUrl;

const check = argv => {
  if (argv._.includes('ls-live-executions') && !hasArgsForCmd(argv)) {
    throw new Error('Command needs `cfg.server.name`, `cfg.server.zone` and `cfg.googleProjectId`');
  }
};

export const lsLiveExecutions = argv => {
  if (hasArgsForCmd(argv)) {
    const fbPrivateKey = getEnv(argv.cfg.firebase.privateKeyEnv);
    const fbClientEmail = getEnv(argv.cfg.firebase.clientEmailEnv);
    const fbDatabaseUrl = argv.cfg.firebase.databaseUrl;

    const db = createDb(fbPrivateKey, fbClientEmail, fbDatabaseUrl);
    const refBuilder = new DbRefBuilder(db);

    const liveMetricsService = new LiveMetricsService(<any>refBuilder);

    const getExecution = id =>
      refBuilder
        .executionRef(id)
        .onceValue()
        .pipe(map(s => s.val()));

    console.log(chalk.green.bold('Listing live executions...abort at any time.'));

    printExecutionHeader();

    liveMetricsService
      .getLiveExecutionsRef()
      .childAdded()
      .pipe(
        map(snapshot => snapshot.val()),
        filter(val => !!val && !!val.live),
        mergeMap(data => from(Object.keys(data.live)).pipe(mergeMap(id => getExecution(id))))
      )
      .subscribe(val => printExecution(val));
  }
};

export const lsLiveExecutionsCommand = {
  run: lsLiveExecutions,
  check: check
};
