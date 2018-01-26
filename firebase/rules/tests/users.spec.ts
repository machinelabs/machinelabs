import 'jest';
import * as matchers from '../matchers';
import * as targaryen from 'targaryen';

const anonymousUser = targaryen.util.users.anonymous;
const rules = require('../database.rules.json');

describe('/users', () => {
  let currentUser;
  let systemUser;

  beforeEach(() => {
    jest.addMatchers(matchers);

    targaryen.util.setFirebaseData({
      users: {
        '1': {
          common: {
            id: '1',
            displayName: 'Foo Bar',
            email: 'foo.bar@example.com',
            bio: '',
            isAnonymous: false,
            photoUrl: 'avatars.com/1'
          }
        },
        '2': {
          common: {
            id: '2',
            displayName: 'Fizz Buzz',
            email: 'fizz.buzz@example.com',
            bio: '',
            isAnonymous: false,
            photoUrl: 'avatars.com/2'
          }
        }
      }
    });

    currentUser = { uid: '1', email: 'foo@bar.com', provider: 'github' };
    systemUser = { uid: 'SYSTEM_USER' };

    targaryen.util.setFirebaseRules(rules);
  });

  it('User can not set is isAnonymous to be different from auth.isAnonymous', () => {
    expect(currentUser).cannotWrite('/users/1/common/isAnonymous', true);
  });

  it('Anonymous user can read any profile', () => {
    expect(anonymousUser).canRead('/users/1/common');
    expect(anonymousUser).canRead('/users/2/common');
  });

  it('Users cannot write into other users profile', () => {
    expect(anonymousUser).cannotWrite('/users/1/common/displayName', 'FooBar');
    expect(anonymousUser).cannotWrite('/users/2/common/displayName', 'FooBar');
    expect(currentUser).cannotWrite('/users/2/common/displayName', 'FooBar');
  });

  it('Current user can update single properties of his profile', () => {
    expect(currentUser).canWrite('/users/1/common/displayName', 'FooBar');
    expect(currentUser).canWrite('/users/1/common/bio', 'This is a Bio');
    expect(currentUser).canWrite('/users/1/common/photoUrl', 'www.test.de');
  });

  it('Current user cannot use a different email', () => {
    expect(currentUser).cannotWrite('/users/1/common/email', 'new@mail.com');
  });

  it('Current user cannot change his id', () => {
    expect(currentUser).cannotWrite('/users/1/common/id', '3');
  });

  it('Users can only read but not update their own plan', () => {
    const newPlan = { plan_id: 'admin' };

    expect(currentUser).canRead('/users/1/plan');
    expect(currentUser).cannotWrite('/users/1/plan', newPlan);
  });

  it('Users cannot read the plan from any other user', () => {
    expect(currentUser).cannotRead('/users/2/plan');
  });

  it('System-user can read the plan of all users', () => {
    expect(systemUser).canRead('/users/1/plan');
    expect(systemUser).canRead('/users/2/plan');
  });
});
