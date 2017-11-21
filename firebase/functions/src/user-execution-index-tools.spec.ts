import 'jest';
import { appendEntryToMonthIndex, updateUserExecutions } from './user-execution-index-tools';

describe('appendEntryToMonthIndex', () => {
  it('should create index tree of months', () => {

    // 2012-04-30 09:01:23
    let startDate = 1335776483000;
    // 2012-05-01 05:01:32
    let endDate = 1335848492000;
    let firstExecutionId = 4711;
    let secondExecutionId = 4712;

    let index = {};
    appendEntryToMonthIndex(index, startDate, endDate, firstExecutionId);
    appendEntryToMonthIndex(index, startDate, endDate, secondExecutionId);

    let expected = {
      '2012':
      {
        'Apr': {
          '4711': true,
          '4712': true
        },
        'May': {
          '4711': true,
          '4712': true
        }
      }
    };

    expect(index).toEqual(expected);
  });
});


describe('updateUserExecutions', () => {
  it('should add live entry', () => {

    let delta = {};

    let execution = {
      id: '1',
      user_id: 'foo',
      started_at: 1000
    };

    let expected = {
      '/idx/user_executions/foo/live/1': true
    };

    updateUserExecutions(null, execution, delta);

    expect(delta).toEqual(expected);
  });

  it('should kill live entry and add 1970-Jan entry', () => {

    let delta = {};

    let execution = {
      id: '1',
      user_id: 'foo',
      started_at: 1000,
      finished_at: 1100
    };

    let expected = {
      '/idx/user_executions/foo/1970/Jan/1': true,
      '/idx/user_executions/foo/live/1': null,
    };

    updateUserExecutions(null, execution, delta);

    expect(delta).toEqual(expected);
  });

  it('should kill live entry and add 2001-Sep entry (stopped_at)', () => {

    let delta = {};

    let execution = {
      id: '1',
      user_id: 'foo',
      started_at:  1000000000000,
      stopped_at: 1001000000000,
      finished_at: 1002000000000
    };

    // we don't want to see Oct here because it should use the
    // `stopped_at` rather than `finished_at` value
    let expected = {
      '/idx/user_executions/foo/2001/Sep/1': true,
      '/idx/user_executions/foo/live/1': null,
    };

    updateUserExecutions(null, execution, delta);

    expect(delta).toEqual(expected);
  });

  it('should kill live entry and add 2001-Sep entry (failed_at)', () => {

    let delta = {};

    let execution = {
      id: '1',
      user_id: 'foo',
      started_at:  1000000000000,
      failed_at: 1001000000000,
      finished_at: 1002000000000
    };

    // we don't want to see Oct here because it should use the
    // `failed_at` rather than `finished_at` value
    let expected = {
      '/idx/user_executions/foo/2001/Sep/1': true,
      '/idx/user_executions/foo/live/1': null,
    };

    updateUserExecutions(null, execution, delta);

    expect(delta).toEqual(expected);
  });
});
