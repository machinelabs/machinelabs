import 'jest';
import * as matchers from '../matchers';
import * as targaryen from 'targaryen';

import { SYSTEM_USER, HardwareType, ExecutionStatus, MessageKind } from '@machinelabs/models';

const anonymousUser = targaryen.util.users.anonymous;
const rules = require('../database.rules.json');

describe('/executions', () => {
  const currentUser = { uid: '1', email: 'foo@bar.com', provider: 'github' };
  const systemUser = { uid: SYSTEM_USER };

  const testExecutionLab = {
    id: '1',
    directory: 'some-directory'
  };

  const testExecution = {
    id: '1',
    cache_hash: 'some-hash',
    started_at: Date.now(),
    server_id: 'some-server-id',
    server_info: 'some-server-info',
    hardware_type: HardwareType.GPU,
    user_id: '1',
    lab: { ...testExecutionLab },
    status: ExecutionStatus.Executing
  };

  const testExecutionMessage = {
    id: '1',
    index: 1,
    virtual_index: 1,
    data: 'data',
    kind: MessageKind.ExecutionStarted,
    timestamp: Date.now(),
    terminal_mode: true
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

  it('Only system-user can write into common executions', () => {
    expect(anonymousUser).cannotWrite('/executions/1/common', testExecution);
    expect(currentUser).cannotWrite('/executions/1/common', testExecution);
    expect(systemUser).canWrite('/executions/1/common', testExecution);
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

  it('System-user and authenticated users can write into the hidden property of common executions', () => {
    expect(anonymousUser).cannotWrite('/executions/1/common/hidden', true);
    expect(currentUser).canWrite('/executions/1/common/hidden', true);
    expect(systemUser).canWrite('/executions/1/common/hidden', true);
  });

  it('System-user and authenticated users can write into the name property of common executions', () => {
    expect(anonymousUser).cannotWrite('/executions/1/common/name', 'some-name');
    expect(currentUser).canWrite('/executions/1/common/name', 'some-name');
    expect(systemUser).canWrite('/executions/1/common/name', 'some-name');
  });

  it('Only system-user can write an execution message node', () => {
    expect(anonymousUser).cannotWrite('/executions/1/messages', { '1': testExecutionMessage });
    expect(currentUser).cannotWrite('/executions/1/messages', { '1': testExecutionMessage });
    expect(systemUser).canWrite('/executions/1/messages', { '1': testExecutionMessage });
  });

  it('Only system-user can write into an execution message', () => {
    expect(anonymousUser).cannotWrite('/executions/1/messages/2', testExecutionMessage);
    expect(currentUser).cannotWrite('/executions/1/messages/2', testExecutionMessage);
    expect(systemUser).canWrite('/executions/1/messages/2', testExecutionMessage);
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
});
