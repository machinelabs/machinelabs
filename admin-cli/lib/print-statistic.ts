import { PlanCredits, HardwareType } from '@machinelabs/models';
import { UsageStatistic } from '@machinelabs/metrics';
import { prettyPrintDuration } from '../lib/pretty-print-duration';
import * as padStart from 'lodash.padstart';
import * as chalk from 'chalk';

export const printStatistic = (statistic: UsageStatistic) => {
  let credits = PlanCredits.get(statistic.planId);
        console.log(statistic);
        let hoursToMs = (hours: number) => hours * 60 * 60 * 1000;

        let freeCpuTime = prettyPrintDuration(hoursToMs(credits.cpuHoursPerMonth))
        let actualCpuTime = prettyPrintDuration(statistic.costReport.getSecondsPerHardware(HardwareType.CPU) * 1000);
        let tmpLeftCpuTime = statistic.cpuSecondsLeft * 1000;
        let leftCpuTime = prettyPrintDuration(statistic.cpuSecondsLeft * 1000);
        let cpuCosts = statistic.costReport.getCostPerHardware(HardwareType.CPU);

        let freeGpuTime = prettyPrintDuration(hoursToMs(credits.gpuHoursPerMonth))
        let actualGpuTime = prettyPrintDuration(statistic.costReport.getSecondsPerHardware(HardwareType.GPU) * 1000);
        let leftGpuTime = prettyPrintDuration(statistic.gpuSecondsLeft * 1000);
        let gpuCosts = statistic.costReport.getCostPerHardware(HardwareType.GPU);

        let pad = 17;

        let colorize = (negOrPos, str) => negOrPos > 0 ? chalk.green.bold(str) : chalk.red.bold(str);

        console.log(`

  User: ${statistic.userId}

                      |     Duration     |
  ----------------------------------------
  Free CPU time:      |${padStart(freeCpuTime, pad)} |
  ----------------------------------------
  Actual Usage:       |${padStart(actualCpuTime, pad)} |
  ----------------------------------------
  ${colorize(statistic.cpuSecondsLeft, `Left CPU time:      |${padStart(leftCpuTime, pad)} |`)}
  ----------------------------------------
  Costs (USD):        |${padStart(cpuCosts, pad)} |
  ========================================
  Free GPU time:      |${padStart(freeGpuTime, pad)} |
  ----------------------------------------
  Actual Usage:       |${padStart(actualGpuTime, pad)} |
  ----------------------------------------
  ${colorize(statistic.gpuSecondsLeft, `Left GPU time:      |${padStart(leftGpuTime, pad)} |`)}
  ----------------------------------------
  Costs (USD):        |${padStart(gpuCosts, pad)} |
  ########################################`)
}