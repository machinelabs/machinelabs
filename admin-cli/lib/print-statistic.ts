import { PlanCredits, HardwareType } from '@machinelabs/models';
import { UsageStatistic } from '@machinelabs/metrics';
import { prettyPrintDuration } from '../lib/pretty-print-duration';
import * as padStart from 'lodash.padstart';
import * as chalk from 'chalk';

export const printStatistic = (statistic: UsageStatistic) => {
  const credits = PlanCredits.get(statistic.planId);
  console.log(statistic);
  const hoursToMs = (hours: number) => hours * 60 * 60 * 1000;

  const freeCpuTime = prettyPrintDuration(hoursToMs(credits.cpuHoursPerMonth));
  const actualCpuTime = prettyPrintDuration(statistic.costReport.getSecondsPerHardware(HardwareType.CPU) * 1000);
  const tmpLeftCpuTime = statistic.cpuSecondsLeft * 1000;
  const leftCpuTime = prettyPrintDuration(statistic.cpuSecondsLeft * 1000);
  const cpuCosts = statistic.costReport.getCostPerHardware(HardwareType.CPU);

  const freeGpuTime = prettyPrintDuration(hoursToMs(credits.gpuHoursPerMonth));
  const actualGpuTime = prettyPrintDuration(statistic.costReport.getSecondsPerHardware(HardwareType.GPU) * 1000);
  const leftGpuTime = prettyPrintDuration(statistic.gpuSecondsLeft * 1000);
  const gpuCosts = statistic.costReport.getCostPerHardware(HardwareType.GPU);

  const pad = 17;

  const colorize = (negOrPos, str) => (negOrPos > 0 ? chalk.green.bold(str) : chalk.red.bold(str));

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
  ########################################`);
};
