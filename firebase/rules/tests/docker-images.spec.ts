import 'jest';
import * as matchers from '../matchers';
import * as targaryen from 'targaryen';

import { SYSTEM_USER } from '@machinelabs/models';

const anonymousUser = targaryen.util.users.anonymous;
const rules = require('../database.rules.json');

describe('/docker_images', () => {
  const currentUser = { uid: '1', email: 'foo@bar.com', provider: 'github' };
  const systemUser = { uid: SYSTEM_USER };

  beforeEach(() => {
    jest.addMatchers(matchers);

    targaryen.util.setFirebaseData();

    targaryen.util.setFirebaseRules(rules);
  });

  it('No users can write into docker common images', () => {
    expect(anonymousUser).cannotWrite('/docker_images/common', '');
    expect(currentUser).cannotWrite('/docker_images/common', '');
    expect(systemUser).cannotWrite('/docker_images/common', '');
  });
});
