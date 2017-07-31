import 'jest';
import { pathify } from './pathify';

describe('pathify', () => {
  it('should translate nested objects to paths', () => {

    let input = {
      '2012':
      {
        'Apr': {
          '4711': true,
          '4712': true
        },
        'May': {
          '4711': true,
          '4712': true
        }
      }
    };

    let expected = {
      '/2012/Apr/4711': true,
      '/2012/Apr/4712': true,
      '/2012/May/4711': true,
      '/2012/May/4712': true
    };

    expect(pathify(input)).toEqual(expected);
  });
});
