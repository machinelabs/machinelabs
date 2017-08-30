import { stdout } from "@machinelabs/core";
import { Observable } from '@reactivex/rxjs';

export const processify = (fn: any) => {
  return Observable.defer(() => {
    fn();
    return stdout("");
  });
}