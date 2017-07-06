const appendIndexEntry = require('./user-execution-index-tools');

describe('appendEntryToMonthIndex', () => {
  it('should create index tree of months', () => {

    // 2012-04-30 09:01:23
    let startDate = 1335776483000;
    //2012-05-01 05:01:32
    let endDate = 1335848492000;
    let firstExecutionId = 4711;
    let secondExecutionId = 4712;

    let index = {};
    appendIndexEntry(index, startDate, endDate, firstExecutionId);
    appendIndexEntry(index, startDate, endDate, secondExecutionId);

    let expected = {
      "2012":
      {
        "Apr": {
          "4711": true,
          "4712": true
        },
        "May": {
          "4711": true,
          "4712": true
        }
      }
    };

    expect(index).toEqual(expected);
  });
});