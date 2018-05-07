import * as moment from 'moment';
import * as merge from 'lodash.merge';
import { pathify } from './util/pathify';

function resetToBeginOfMonth(date) {
  return date
    .date(1)
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
}

export function appendEntryToMonthIndex(index, startDate, endDate, executionId) {
  startDate = moment.utc(startDate);
  endDate = moment.utc(endDate);

  // set to common point in month to reduce loop to month steps
  resetToBeginOfMonth(startDate);
  resetToBeginOfMonth(endDate);

  if (endDate.isBefore(startDate)) {
    throw 'End date must be greater than start date.';
  }

  const currentDate = startDate.clone();

  while (currentDate.isSameOrBefore(endDate)) {
    const year = currentDate.year();
    const month = currentDate.format('MMM');
    merge(index, { [year]: { [month]: { [executionId]: true } } });

    currentDate.add(1, 'month');
  }

  return index;
}

export function updateUserExecutions(context, data, delta) {
  const finalized = data.finished_at || data.stopped_at || data.failed_at;

  if (data.started_at && finalized) {
    const userIdx = {};
    const idx = {
      idx: {
        user_executions: {
          [data.user_id]: userIdx
        }
      }
    };

    const finalizedAt = data.stopped_at ? data.stopped_at : data.failed_at ? data.failed_at : data.finished_at;

    appendEntryToMonthIndex(userIdx, data.started_at, finalizedAt, data.id);
    Object.assign(delta, pathify(idx));
  }

  delta[`/idx/user_executions/${data.user_id}/live/${data.id}`] = finalized ? null : true;
}
