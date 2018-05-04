import 'jest';
import * as matchers from '../matchers';
import * as targaryen from 'targaryen';

import { SYSTEM_USER } from '@machinelabs/models';

const anonymousUser = targaryen.util.users.anonymous;
const rules = require('../database.rules.json');

describe('/servers', () => {
  const currentUser = { uid: '1', email: 'foo@bar.com', provider: 'github' };
  const systemUser = { uid: SYSTEM_USER };

  beforeEach(() => {
    jest.addMatchers(matchers);

    targaryen.util.setFirebaseData();

    targaryen.util.setFirebaseRules(rules);
  });

  it('Only System-user can read into the servers node', () => {
    expect(anonymousUser).cannotRead('/servers');
    expect(currentUser).cannotRead('/servers');
    expect(systemUser).canRead('/servers');
  });

  it('No users can write into the servers node', () => {
    expect(anonymousUser).cannotWrite('/servers', '');
    expect(currentUser).cannotWrite('/servers', '');
    expect(systemUser).cannotWrite('/servers', '');
  });
});
