import { stdout } from "@machinelabs/core";
import { defer } from 'rxjs/observable/defer';

export const processify = (fn: any) => {
  return defer(() => {
    fn();
    return stdout("");
  });
}