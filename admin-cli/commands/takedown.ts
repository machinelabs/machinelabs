import * as chalk from 'chalk';
import { TakedownService } from '@machinelabs/supervisor';
import { DbRefBuilder } from '@machinelabs/core';
import { HardwareType } from '@machinelabs/models';
import { createDb } from '../lib/create-db';
import { getEnv } from '../lib/get-env';
import { printStatistic } from '../lib/print-statistic';
import { UsageStatisticService, CostCalculator, LiveMetricsService } from '@machinelabs/metrics';
import { empty } from 'rxjs/observable/empty';
import { filter, tap, mergeMap, finalize } from 'rxjs/operators';

const hasArgsForTakedown = argv => argv.cfg &&
                                   argv.cfg.firebase.privateKeyEnv &&
                                   argv.cfg.firebase.clientEmailEnv &&
                                   argv.cfg.firebase.databaseUrl;

const check = argv => {
  if (argv._.includes('takedown') && !hasArgsForTakedown(argv)) {
    throw new Error('Command needs `cfg.server.name`, `cfg.server.zone` and `cfg.googleProjectId`');
  }
}

export const takedown = (argv) => {
  if (hasArgsForTakedown(argv)) {
    let fbPrivateKey = getEnv(argv.cfg.firebase.privateKeyEnv);
    let fbClientEmail = getEnv(argv.cfg.firebase.clientEmailEnv);
    let fbDatabaseUrl = argv.cfg.firebase.databaseUrl;

    let db = createDb(fbPrivateKey, fbClientEmail, fbDatabaseUrl);
    let refBuilder = new DbRefBuilder(db);

    let liveMetricsService = new LiveMetricsService(<any>refBuilder);
    let takedownService = new TakedownService(<any>refBuilder);
    let svc = new UsageStatisticService(new CostCalculator(), liveMetricsService, <any>refBuilder);

    let isDryRun = !!argv['dry-run'];
    let dryRunPrefix = isDryRun ? `[Dry Run] ` : '';

    if (argv.execution) {
      console.log(chalk.red.bold(`\n${dryRunPrefix}Taking down execution ${argv.execution}`));
      takedownService.takedown(argv.execution);
      return;
    }


    if (isDryRun) {
      console.log(chalk.green.bold('This is a dry run. Not taking down any executions.'));
    }

    let takeDownMsg = (id:string) => console.log(chalk.yellow.bold(`Taking down execution ${id}`));

    svc.getUsageStatisticForAllCurrentlyActiveUsers()
      .pipe(
        filter(statistic => !!statistic),
        tap(statistic => printStatistic(statistic)),
        mergeMap(statistic => {
          if (statistic.cpuSecondsLeft <= 0 && statistic.gpuSecondsLeft <= 0) {
            console.log(chalk.red.bold(`\n${dryRunPrefix}Taking down all executions from user ${statistic.userId}...`));
            return isDryRun ? empty() : takedownService.takedownByUser(statistic.userId).pipe(tap(takeDownMsg));
          } else if (statistic.cpuSecondsLeft <= 0) {
            console.log(chalk.red.bold(`\n${dryRunPrefix}Taking down all CPU executions from user ${statistic.userId}...`));
            return isDryRun ? empty() : takedownService.takedownByUser(statistic.userId, [HardwareType.CPU]).pipe(tap(takeDownMsg));
          } else if (statistic.gpuSecondsLeft <= 0) {
            console.log(chalk.red.bold(`\n${dryRunPrefix}Taking down all GPU executions from user ${statistic.userId}...`));
            return isDryRun ? empty() : takedownService.takedownByUser(statistic.userId, [HardwareType.GPU]).pipe(tap(takeDownMsg));
          }

          return empty();
        }),
        finalize(() => console.log('\nDone...'))
      )
      .subscribe();
  }
}

export const takedownCommand = {
  run: takedown,
  check: check
};
