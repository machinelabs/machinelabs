import { Observable } from '@reactivex/rxjs';
import { trimNewLines, spawnShell } from '@machinelabs/core';

const spawnOptions = { stdio: 'pipe' };

export const getAccessToken = () => {
  return spawnShell(`gcloud auth print-access-token`)
          .flatMap(val => val.origin === 'stderr' ? Observable.throw(val.str) : Observable.of(trimNewLines(val.str)));
};
