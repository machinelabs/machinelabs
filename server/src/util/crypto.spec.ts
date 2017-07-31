import 'jest';

import { Crypto } from './crypto';
import { Lab } from '../models/lab';

describe('.hash()', () => {
  it('should return correct hash for string', () => {
    let hash = Crypto.hash('foo');
    let expectedHash = '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae';
    expect(hash).toBe(expectedHash);
  });
});

describe('.hashLabFiles()', () => {
  it('should return correct hash for lab', () => {

    let lab: Lab = {
      id: 'test',
      directory: [
        {
          name: 'test',
          content: 'test'
        }
      ]
    };

    let hash = Crypto.getCacheHash(lab);
    let expectedHash = '99e84db3997fc16a78ddf71d9cf3c25b5a0f3712ab325c0b2ab5898e44f4df74';
    expect(hash).toBe(expectedHash);
  });
});
