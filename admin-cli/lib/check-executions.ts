import { UsageStatisticService, CostCalculator, UsageStatistic } from '@machinelabs/metrics';
import { DbRefBuilder, ObservableDbRef } from '@machinelabs/core';
import { Observable } from '@reactivex/rxjs';
import * as padStart from 'lodash.padstart';
import * as chalk from 'chalk';

export const checkExecutions = (db) => {
  console.log(`Checking overtime executions`);

  let svc = new UsageStatisticService(new CostCalculator(), <any>new DbRefBuilder(db))

  new ObservableDbRef(db.ref('/idx/user_executions'))
    .childAdded()
    .flatMap(snapshot => {
      let val = snapshot.val();
      let userId = snapshot.key;

      if (val && val.live) {
        return svc.getStatisticForCurrentMonth(userId)
          .map(statistic => ({ userId, statistic }));
      }

      return Observable.empty();
    })
    .subscribe((val: { userId: string, statistic: UsageStatistic }) => {

      let freeH = 75;
      let freeM = 75 * 60;
      let freeS = freeM * 60;

      let usageS = val.statistic.costReport.totalSeconds;
      let usageM = (usageS / 60).toFixed(2)
      let usageH = (usageS / 60 / 60).toFixed(2);

      let leftS = freeS - usageS;
      let leftM = (leftS / 60).toFixed(2);
      let leftH = (leftS / 60 / 60).toFixed(2);

      let pad = 8;

      let colorText = leftS > 0 ? chalk.green.bold : chalk.red.bold;

      console.log(`

User: ${val.userId}

                    | Seconds | Minutes | Hours   |
---------------------------------------------------
Free CPU time:      |${padStart(freeS, pad)} |${padStart(freeM, pad)} |${padStart(freeH, pad)} |
---------------------------------------------------
Actual Usage:       |${padStart(usageS, pad)} |${padStart(usageM, pad)} |${padStart(usageH, pad)} |
---------------------------------------------------
${colorText(`Left:               |${padStart(leftS, pad)} |${padStart(leftM, pad)} |${padStart(leftH, pad)} |`)}
###################################################
Costs (USD):        | ${padStart(val.statistic.costReport.totalCost, 20)}
---------------------------------------------------
`)

    if (leftS <= 0) {

    }


    }, e => {
      console.error(e);
    }, () => {
      console.log('Finished');
    });
};

export class TakeDownService {
  constructor (private db: admin.database.Database) {}

  takedown(executionId: string) {
    let id = this.db.ref().push().key;
    this.db.ref(`/invocations/${id}`).update({
      
    })
  }
}