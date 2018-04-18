import 'jest';
import * as matchers from '../matchers';
import * as targaryen from 'targaryen';

const rules = require('../database.rules.json');

describe('/labs', () => {
  const currentUser = { uid: '1', email: 'foo@bar.com', provider: 'github' };

  const testLab = {
    id: '1',
    user_id: currentUser.uid,
    name: 'Lab name',
    description: '',
    tags: [],
    directory: '',
    hidden: false,
    is_private: false
  };

  beforeEach(() => {
    jest.addMatchers(matchers);

    targaryen.util.setFirebaseData({
      labs: {
        '1': { ...testLab }
      }
    });

    targaryen.util.setFirebaseRules(rules);
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
      const labWithLongTags = Object.assign({}, testLab, { tags: [string51] });
      expect(currentUser).cannotWrite('/labs/1/common/', labWithLongTags);
    });
  });
});
