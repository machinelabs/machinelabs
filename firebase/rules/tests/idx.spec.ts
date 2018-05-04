import 'jest';
import * as matchers from '../matchers';
import * as targaryen from 'targaryen';

import { SYSTEM_USER } from '@machinelabs/models';

const anonymousUser = targaryen.util.users.anonymous;
const rules = require('../database.rules.json');

describe('/idx', () => {
  const currentUser = { uid: '1', email: 'foo@bar.com', provider: 'github' };
  const systemUser = { uid: SYSTEM_USER };

  beforeEach(() => {
    jest.addMatchers(matchers);

    targaryen.util.setFirebaseData({
      idx: {
        recent_labs: {
          '1': {}
        },
        user_labs: {
          '1': {}
        },
        lab_executions: {
          '1': {}
        },
        lab_visible_executions: {
          '1': {}
        },
        user_executions: {
          '1': {}
        },
        user_visible_executions: {
          '1': {}
        },
        user_visible_labs: {
          '1': {}
        }
      }
    });

    targaryen.util.setFirebaseRules(rules);
  });

  it('No users can write into idx recent labs', () => {
    expect(anonymousUser).cannotWrite('/idx/recent_labs/1', '');
    expect(currentUser).cannotWrite('/idx/recent_labs/1', '');
    expect(systemUser).cannotWrite('/idx/recent_labs/1', '');
  });

  it('No users can write into idx user labs', () => {
    expect(anonymousUser).cannotWrite('/idx/user_labs/1', '');
    expect(currentUser).cannotWrite('/idx/user_labs/1', '');
    expect(systemUser).cannotWrite('/idx/user_labs/1', '');
  });

  it('No users can write into idx lab executions', () => {
    expect(anonymousUser).cannotWrite('/idx/lab_executions/1', '');
    expect(currentUser).cannotWrite('/idx/lab_executions/1', '');
    expect(systemUser).cannotWrite('/idx/lab_executions/1', '');
  });

  it('No users can write into idx visible lab executions', () => {
    expect(anonymousUser).cannotWrite('/idx/lab_visible_executions/1', '');
    expect(currentUser).cannotWrite('/idx/lab_visible_executions/1', '');
    expect(systemUser).cannotWrite('/idx/lab_visible_executions/1', '');
  });

  it('Only system-user read into idx user executions', () => {
    expect(anonymousUser).cannotRead('/idx/user_executions/1');
    expect(currentUser).cannotRead('/idx/user_executions/1');
    expect(systemUser).canRead('/idx/user_executions/1');
  });

  it('No users can write into idx user executions', () => {
    expect(anonymousUser).cannotWrite('/idx/user_executions/1', '');
    expect(currentUser).cannotWrite('/idx/user_executions/1', '');
    expect(systemUser).cannotWrite('/idx/user_executions/1', '');
  });

  it('No users can write into idx visible user executions', () => {
    expect(anonymousUser).cannotWrite('/idx/user_visible_executions/1', '');
    expect(currentUser).cannotWrite('/idx/user_visible_executions/1', '');
    expect(systemUser).cannotWrite('/idx/user_visible_executions/1', '');
  });

  it('No users can write into idx visible user labs', () => {
    expect(anonymousUser).cannotWrite('/idx/user_visible_labs/1', '');
    expect(currentUser).cannotWrite('/idx/user_visible_labs/1', '');
    expect(systemUser).cannotWrite('/idx/user_visible_labs/1', '');
  });
});
