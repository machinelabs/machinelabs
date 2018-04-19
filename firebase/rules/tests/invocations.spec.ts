import 'jest';
import * as matchers from '../matchers';
import * as targaryen from 'targaryen';

import { SYSTEM_USER, Invocation, InvocationType } from '@machinelabs/models';

const anonymousUser = targaryen.util.users.anonymous;
const rules = require('../database.rules.json');

const dummyInvocationLab = {
  id: '1',
  directory: 'dummy/directory'
};

const dummyInvocationExecution = {
  execution_id: '1'
};

const dummyInvocation: Invocation = {
  id: '1',
  timestamp: Date.now(),
  user_id: null,
  type: Date.now() % 2 ? InvocationType.StartExecution : InvocationType.StopExecution,
  data: Date.now() % 2 ? dummyInvocationLab : dummyInvocationExecution
};

const invocationsData = {
  invocations: {
    '1': {
      common: {
        id: '1',
        timestamp: Date.now(),
        user_id: '1',
        type: InvocationType.StartExecution,
        data: dummyInvocationExecution
      }
    },
    '3': {
      common: {
        id: '3',
        timestamp: Date.now(),
        user_id: '2',
        type: InvocationType.StopExecution,
        data: dummyInvocationLab
      }
    }
  }
};

const invocationRateProof = {
  idx: {
    invocation_rate_proof: {
      '1': {
        key: '1'
      },
      '2': {
        key: '3'
      }
    }
  }
};

describe('/invocations', () => {
  let currentUser;
  let systemUser;

  let dummyInvocationCurrentUser: Invocation;
  let dummyInvocationSystemUser: Invocation;

  beforeEach(() => {
    jest.addMatchers(matchers);

    targaryen.util.setFirebaseData({
      ...invocationsData,
      ...invocationRateProof
    });

    currentUser = { uid: '1', id: '1', email: 'foo@bar.com', provider: 'github' };
    systemUser = { uid: SYSTEM_USER };

    dummyInvocationCurrentUser = { ...dummyInvocation, user_id: currentUser.uid };
    dummyInvocationSystemUser = { ...dummyInvocation, user_id: SYSTEM_USER };

    targaryen.util.setFirebaseRules(rules);
  });

  it('Authenticated and system users can read their own invocations', () => {
    expect(anonymousUser).cannotRead('/invocations/1/common');
    expect(currentUser).canRead('/invocations/1/common');
    expect(systemUser).canRead('/invocations/1/common');
  });

  it('Authenticated and system users can write into their own invocations', () => {
    expect(anonymousUser).cannotWrite('/invocations/1/common', dummyInvocation);
    expect(currentUser).canWrite('/invocations/1/common', dummyInvocationCurrentUser);
    expect(systemUser).canWrite('/invocations/1/common', dummyInvocationSystemUser);
  });

  it('Only system users can read complete invocation nodes', () => {
    expect(anonymousUser).cannotRead('/invocations/1');
    expect(currentUser).cannotRead('/invocations/1');
    expect(systemUser).canRead('/invocations/1');
  });

  it('Only system user can write into complete invocation nodes', () => {
    expect(anonymousUser).cannotWrite('/invocations/1', dummyInvocation);
    expect(currentUser).cannotWrite('/invocations/1', dummyInvocationCurrentUser);
    expect(systemUser).canWrite('/invocations/1', dummyInvocationSystemUser);
  });

  it('Only system users can read invocations of other users', () => {
    expect(anonymousUser).cannotRead('/invocations/3/common');
    expect(currentUser).cannotRead('/invocations/3/common');
    expect(systemUser).canRead('/invocations/3/common');
  });

  it('Only system users can write into invocations of other users', () => {
    expect(anonymousUser).cannotWrite('/invocations/3/common', dummyInvocation);
    expect(currentUser).cannotWrite('/invocations/3/common', dummyInvocationCurrentUser);
    expect(systemUser).canWrite('/invocations/3/common', dummyInvocationSystemUser);
  });

  it('Only a system user can write into an invocation if the rate proof is unsatisfied', () => {
    const unsatisfiedInvocationRateProofData = {
      idx: {
        invocation_rate_proof: {
          '1': {
            key: '11'
          }
        }
      }
    };

    targaryen.util.setFirebaseData({
      invocationsData,
      unsatisfiedInvocationRateProofData
    });

    expect(anonymousUser).cannotWrite('/invocations/1/common', dummyInvocation);
    expect(currentUser).cannotWrite('/invocations/1/common', dummyInvocationCurrentUser);
    expect(systemUser).canWrite('/invocations/1/common', dummyInvocationSystemUser);
  });
});
