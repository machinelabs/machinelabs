import { stdout } from '@machinelabs/core';
import { defer } from 'rxjs';

export const processify = (fn: Function) => {
  return defer(() => {
    fn();
    return stdout('');
  });
};
