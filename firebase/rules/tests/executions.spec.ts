import 'jest';
import * as matchers from '../matchers';
import * as targaryen from 'targaryen';

const anonymousUser = targaryen.util.users.anonymous;
const rules = require('../database.rules.json');

describe('/executions', () => {
  const currentUser = { id: '1', uid: '1', email: 'foo@bar.com', provider: 'github' };
  const systemUser = { uid: 'SYSTEM_USER' };

  const testExecutionLab = {
    id: '1',
    directory: ''
  };

  const testExecution = {
    id: '1',
    cache_hash: 'some-hash',
    started_at: Date.now(),
    server_id: 'some-server-id',
    server_info: 'some-server-info',
    hardware_type: 'some-hardware-type',
    user_id: '1',
    lab: { ...testExecutionLab },
    status: 'some-status'
  };

  beforeEach(() => {
    jest.addMatchers(matchers);

    targaryen.util.setFirebaseData({
      executions: {
        '1': {
          common: {
            ...testExecution
          }
        }
      }
    });

    targaryen.util.setFirebaseRules(rules);
  });

  describe('Validation', () => {
    const string51 = new Array(51).fill('0').join('');
    const string101 = new Array(101).fill('0').join('');

    it('Execution id cannot be longer than 100 characters', () => {
      expect(currentUser).cannotWrite('/executions/1/common/id', string101);
    });

    it('Execution cache_hash cannot be longer than 100 characters', () => {
      expect(currentUser).cannotWrite('/executions/1/common/cache_hash', string101);
    });

    it('Execution server_id cannot be longer than 100 characters', () => {
      expect(currentUser).cannotWrite('/executions/1/common/server_id', string101);
    });

    it('Execution server_info cannot be longer than 100 characters', () => {
      expect(currentUser).cannotWrite('/executions/1/common/server_info', string101);
    });

    it('Execution hardware_type cannot be longer than 100 characters', () => {
      expect(currentUser).cannotWrite('/executions/1/common/hardware_type', string101);
    });

    it('Execution user_id cannot be longer than 100 characters', () => {
      expect(currentUser).cannotWrite('/executions/1/common/user_id', string101);
    });

    it('Execution status cannot be longer than 100 characters', () => {
      expect(currentUser).cannotWrite('/executions/1/common/user_id', string101);
    });

    it('Execution message id cannot be longer than 100 characters', () => {
      expect(systemUser).cannotWrite('/executions/1/messages/id', string101);
    });

    it('Execution message kind cannot be longer than 50 characters', () => {
      expect(systemUser).cannotWrite('/executions/1/messages/kind', string51);
    });
  });

  it('Only system-user can write into common lab property of executions', () => {
    const newExecutionLab = {
      id: '2',
      directory: 'test'
    };

    expect(anonymousUser).cannotWrite('/executions/1/common/lab', newExecutionLab);
    expect(currentUser).cannotWrite('/executions/1/common/lab', newExecutionLab);
    expect(systemUser).canWrite('/executions/1/common/lab', newExecutionLab);
  });
});
