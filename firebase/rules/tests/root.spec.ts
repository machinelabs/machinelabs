import 'jest';
import * as matchers from '../matchers';
import * as targaryen from 'targaryen';

import { SYSTEM_USER } from '@machinelabs/models';

const anonymousUser = targaryen.util.users.anonymous;
const rules = require('../database.rules.json');

describe('/', () => {
  const currentUser = { uid: '1', email: 'foo@bar.com', provider: 'github' };
  const systemUser = { uid: SYSTEM_USER };

  beforeEach(() => {
    jest.addMatchers(matchers);

    targaryen.util.setFirebaseData();

    targaryen.util.setFirebaseRules(rules);
  });

  it('Only System-user can read into the root node', () => {
    expect(anonymousUser).cannotRead('/');
    expect(currentUser).cannotRead('/');
    expect(systemUser).canRead('/');
  });

  it('No users can write into the root node', () => {
    expect(anonymousUser).cannotWrite('/', '');
    expect(currentUser).cannotWrite('/', '');
    expect(systemUser).cannotWrite('/', '');
  });
});
