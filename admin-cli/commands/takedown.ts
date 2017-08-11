import * as chalk from 'chalk';
import { TakedownService } from '@machinelabs/supervisor';
import { DbRefBuilder } from '@machinelabs/core';
import { HardwareType } from '@machinelabs/models';
import { createDb } from '../lib/create-db';
import { getEnv } from '../lib/get-env';
import { printStatistic } from '../lib/print-statistic';
import { UsageStatisticService, CostCalculator } from '@machinelabs/metrics';
import { Observable } from '@reactivex/rxjs';

const hasArgsForTakedown = argv => argv.cfg &&
                                   argv.cfg.firebase.privateKeyEnv &&
                                   argv.cfg.firebase.clientEmailEnv &&
                                   argv.cfg.firebase.databaseUrl;

const check = argv => {
  if (!hasArgsForTakedown(argv)) {
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

    let takedownService = new TakedownService(<any>refBuilder);
    let svc = new UsageStatisticService(new CostCalculator(), <any>refBuilder);

    if (argv.execution) {
      takedownService.takedown(argv.execution);
      return;
    }

    let isDryRun = !!argv['dry-run'];

    if (isDryRun) {
      console.log(chalk.green.bold('This is a dry run. Not taking down any executions.'));
    }

    let takeDownMsg = (id:string) => console.log(chalk.yellow.bold(`Taking down execution ${id}`));

    svc.getUsageStatisticForAllCurrentlyActiveUsers()
      .filter(statistic => !!statistic)
      .do(statistic => printStatistic(statistic))
      .flatMap(statistic => {
        let dryRunPrefix = isDryRun ? `[Dry Run] ` : '';
        if (statistic.cpuSecondsLeft <= 0 && statistic.gpuSecondsLeft <= 0) {
          console.log(chalk.red.bold(`\n${dryRunPrefix}Taking down all executions from user ${statistic.userId}...`));
          return isDryRun ? Observable.empty() : takedownService.takedownByUser(statistic.userId).do(takeDownMsg);
        } else if (statistic.cpuSecondsLeft <= 0) {
          console.log(chalk.red.bold(`\n${dryRunPrefix}Taking down all CPU executions from user ${statistic.userId}...`));
          return isDryRun ? Observable.empty() : takedownService.takedownByUser(statistic.userId, [HardwareType.CPU]).do(takeDownMsg);
        } else if (statistic.gpuSecondsLeft <= 0) {
          console.log(chalk.red.bold(`\n${dryRunPrefix}Taking down all GPU executions from user ${statistic.userId}...`));
          return isDryRun ? Observable.empty() : takedownService.takedownByUser(statistic.userId, [HardwareType.GPU]).do(takeDownMsg);
        }

        return Observable.empty();
      })
      .finally(() => console.log('\nDone...'))
      .subscribe();
  }
}

export const takedownCommand = {
  run: takedown,
  check: check
};
