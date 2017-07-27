
import * as moment from 'moment';
import * as merge from 'lodash.merge';

function resetToBeginOfMonth(date) {
  return date.date(1)
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

  let currentDate = startDate.clone();

  while (currentDate.isSameOrBefore(endDate)) {
    let year = currentDate.year();
    let month = currentDate.format('MMM');

    merge(index, { [year]: { [month]: { [executionId]: true } } });

    currentDate.add(1, 'month');
  }

  return index;
}
