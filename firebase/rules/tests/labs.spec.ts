import 'jest';
import * as matchers from '../matchers';
import * as targaryen from 'targaryen';

import { SYSTEM_USER } from '@machinelabs/models';

const anonymousUser = targaryen.util.users.anonymous;
const rules = require('../database.rules.json');

describe('/labs', () => {
  const currentUser = { uid: '1', email: 'foo@bar.com', provider: 'github' };
  const systemUser = { uid: SYSTEM_USER };

  const testLab = {
    id: '1',
    user_id: currentUser.uid,
    name: 'some-name',
    description: 'some-description',
    tags: ['t', 'a', 'g', 's'],
    directory: 'some-directory',
    created_at: Date.now(),
    modified_at: Date.now(),
    hidden: false,
    is_private: false
  };

  beforeEach(() => {
    jest.addMatchers(matchers);

    targaryen.util.setFirebaseData({
      users: {
        '1': {
          plan: {
            plan_id: 'not-beta'
          }
        },
        '2': {
          plan: {
            plan_id: 'beta'
          }
        }
      },
      labs: {
        '1': {
          common: {
            ...testLab
          }
        },
        '2': {
          common: {
            ...testLab,
            is_private: true
          }
        },
        '3': {
          common: {
            ...testLab,
            id: '3',
            user_id: '2',
            is_private: true
          }
        },
        '4': {
          common: {
            ...testLab,
            id: '4',
            user_id: '3',
            is_private: true
          }
        }
      }
    });

    targaryen.util.setFirebaseRules(rules);
  });

  it('Only System-user can read into all labs', () => {
    expect(anonymousUser).cannotRead('/labs/3/common');
    expect(currentUser).cannotRead('/labs/3/common');
    expect(systemUser).canRead('/labs/3/common');

    expect(anonymousUser).cannotRead('/labs/4/common');
    expect(currentUser).cannotRead('/labs/4/common');
    expect(systemUser).canRead('/labs/4/common');
  });

  it('Only System-user can write into all labs', () => {
    expect(anonymousUser).cannotWrite('/labs/3/common', testLab);
    expect(currentUser).cannotWrite('/labs/3/common', testLab);
    expect(systemUser).canWrite('/labs/3/common', testLab);

    const testLab2 = { ...testLab, is_private: true };

    expect(anonymousUser).cannotWrite('/labs/4/common', testLab2);
    expect(currentUser).cannotWrite('/labs/4/common', testLab2);
    expect(systemUser).canWrite('/labs/4/common', testLab2);
  });

  it('All users can read into public labs', () => {
    expect(anonymousUser).canRead('/labs/1/common');
    expect(currentUser).canRead('/labs/1/common');
    expect(systemUser).canRead('/labs/1/common');
  });

  it('System-user and authenticated users can write into their public labs', () => {
    expect(anonymousUser).cannotWrite('/labs/1/common', testLab);
    expect(currentUser).canWrite('/labs/1/common', testLab);
    expect(systemUser).canWrite('/labs/1/common', testLab);
  });

  it('System-user and authenticated users with a none beta plan can read into their private labs', () => {
    expect(anonymousUser).cannotRead('/labs/2/common');
    expect(currentUser).canRead('/labs/2/common');
    expect(systemUser).canRead('/labs/2/common');
  });

  it('System-user and authenticated users with a none beta plan can write into their private labs', () => {
    const testLab2 = { ...testLab, is_private: true };

    expect(anonymousUser).cannotWrite('/labs/2/common', testLab2);
    expect(currentUser).canWrite('/labs/2/common', testLab2);
    expect(systemUser).canWrite('/labs/2/common', testLab2);
  });

  it('Authenticated users with a beta plan cannot read into their private labs', () => {
    const currentUser2 = { ...currentUser, uid: '2' };

    expect(anonymousUser).cannotRead('/labs/3/common');
    expect(currentUser2).cannotRead('/labs/3/common');
    expect(systemUser).canRead('/labs/3/common');
  });

  it('Authenticated users with a beta plan cannot write into their private labs', () => {
    const currentUser2 = { ...currentUser, uid: '2' };
    const testLab2 = { ...testLab, id: '3', user_id: '2', is_private: true };

    expect(anonymousUser).cannotWrite('/labs/3/common', testLab2);
    expect(currentUser2).cannotWrite('/labs/3/common', testLab2);
    expect(systemUser).canWrite('/labs/3/common', testLab2);
  });

  describe('Validation', () => {
    const string51 = new Array(51).fill('0').join('');
    const string101 = new Array(101).fill('0').join('');
    const string501 = new Array(501).fill('0').join('');

    it('Lab id cannot be longer than 100 characters', () => {
      expect(currentUser).cannotWrite('/labs/1/common/id', string101);
    });

    it('Lab user_id cannot be longer than 100 characters', () => {
      expect(currentUser).cannotWrite('/labs/1/common/user_id', string101);
    });

    it('Lab name cannot be longer than 100 characters', () => {
      expect(currentUser).cannotWrite('/labs/1/common/name', string101);
    });

    it('Lab description cannot be longer than 500 characters', () => {
      expect(currentUser).cannotWrite('/labs/1/common/description', string501);
    });

    it('Lab tags cannot be longer than 50 characters', () => {
      const labWithLongTags = {
        ...testLab,
        tags: [string51],
        created_at: undefined,
        modified_at: undefined
      };

      expect(currentUser).cannotWrite('/labs/1/common/', labWithLongTags);
    });
  });
});
