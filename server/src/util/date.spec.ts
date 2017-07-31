import 'jest';

import { DateUtil } from './date';
import { Month } from '../models/months';

describe('.getUTCBeginOfMonth()', () => {
  it('should return correct instant in time', () => {
    let instant = DateUtil.getUTCBeginOfMonth(2017, Month.July);
    expect(instant).toBe(1498867200000);
  });
});

describe('.getUTCEndOfMonth()', () => {
  it('should return correct instant in time', () => {
    let instant = DateUtil.getUTCEndOfMonth(2017, Month.July);
    expect(instant).toBe(1501545599999);
  });
});
