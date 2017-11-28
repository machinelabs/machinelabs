import { PlanCredits, HardwareType, Execution } from '@machinelabs/models';
import { UsageStatistic } from '@machinelabs/metrics';
import { prettyPrintDuration } from '../lib/pretty-print-duration';
import * as padStart from 'lodash.padstart';
import * as chalk from 'chalk';
import * as moment from 'moment';


const DATE_FORMAT = 'DD-MMM YYYY H:mm:ss';

export const printExecutionHeader = () => console.log(`
Execution                    Lab           User                              Started at                Duration           Server Info
=====================================================================================================================================`);

export const printExecution = (execution: Execution) => console.log(`
${execution.id}      ${execution.lab.id}     ${execution.user_id}      ${moment.utc(execution.started_at).format(DATE_FORMAT)}       ${prettyPrintDuration(Date.now() - execution.started_at)}       ${execution.server_info}
-------------------------------------------------------------------------------------------------------------------------------------`);
