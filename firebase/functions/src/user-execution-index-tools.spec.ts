import 'jest';
import { appendEntryToMonthIndex, updateUserExecutions } from './user-execution-index-tools';

describe('appendEntryToMonthIndex', () => {
  it('should create index tree of months', () => {
    // 2012-04-30 09:01:23
    const startDate = 1335776483000;
    // 2012-05-01 05:01:32
    const endDate = 1335848492000;
    const firstExecutionId = 4711;
    const secondExecutionId = 4712;

    const index = {};
    appendEntryToMonthIndex(index, startDate, endDate, firstExecutionId);
    appendEntryToMonthIndex(index, startDate, endDate, secondExecutionId);

    const expected = {
      '2012': {
        Apr: {
          '4711': true,
          '4712': true
        },
        May: {
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
    const delta = {};

    const execution = {
      id: '1',
      user_id: 'foo',
      started_at: 1000
    };

    const expected = {
      '/idx/user_executions/foo/live/1': true
    };

    updateUserExecutions(null, execution, delta);

    expect(delta).toEqual(expected);
  });

  it('should kill live entry and add 1970-Jan entry', () => {
    const delta = {};

    const execution = {
      id: '1',
      user_id: 'foo',
      started_at: 1000,
      finished_at: 1100
    };

    const expected = {
      '/idx/user_executions/foo/1970/Jan/1': true,
      '/idx/user_executions/foo/live/1': null
    };

    updateUserExecutions(null, execution, delta);

    expect(delta).toEqual(expected);
  });

  it('should kill live entry and add 2001-Sep entry (stopped_at)', () => {
    const delta = {};

    const execution = {
      id: '1',
      user_id: 'foo',
      started_at: 1000000000000,
      stopped_at: 1001000000000,
      finished_at: 1002000000000
    };

    // we don't want to see Oct here because it should use the
    // `stopped_at` rather than `finished_at` value
    const expected = {
      '/idx/user_executions/foo/2001/Sep/1': true,
      '/idx/user_executions/foo/live/1': null
    };

    updateUserExecutions(null, execution, delta);

    expect(delta).toEqual(expected);
  });

  it('should kill live entry and add 2001-Sep entry (failed_at)', () => {
    const delta = {};

    const execution = {
      id: '1',
      user_id: 'foo',
      started_at: 1000000000000,
      failed_at: 1001000000000,
      finished_at: 1002000000000
    };

    // we don't want to see Oct here because it should use the
    // `failed_at` rather than `finished_at` value
    const expected = {
      '/idx/user_executions/foo/2001/Sep/1': true,
      '/idx/user_executions/foo/live/1': null
    };

    updateUserExecutions(null, execution, delta);

    expect(delta).toEqual(expected);
  });
});
