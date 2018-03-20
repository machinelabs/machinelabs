import 'jest';

import { Crypto } from './crypto';
import { Lab } from '@machinelabs/models';

describe('.hash()', () => {
  it('should return correct hash for string', () => {
    const hash = Crypto.hash('foo');
    const expectedHash = '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae';
    expect(hash).toBe(expectedHash);
  });
});

describe('.hashLabFiles()', () => {
  it('should return correct hash for lab', () => {
    const lab: Lab = {
      id: 'test',
      name: '',
      description: '',
      tags: [],
      user_id: '',
      created_at: Date.now(),
      modified_at: Date.now(),
      hidden: false,
      directory: [
        {
          name: 'test',
          content: 'test'
        }
      ],
      is_private: false
    };

    const hash = Crypto.getCacheHash(lab);
    const expectedHash = '99e84db3997fc16a78ddf71d9cf3c25b5a0f3712ab325c0b2ab5898e44f4df74';
    expect(hash).toBe(expectedHash);
  });
});
