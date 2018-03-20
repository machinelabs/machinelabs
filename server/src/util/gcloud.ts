import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { mergeMap } from 'rxjs/operators';
import { trimNewLines, spawnShell } from '@machinelabs/core';

const spawnOptions = { stdio: 'pipe' };

export const getAccessToken = () => {
  return spawnShell(`gcloud auth print-access-token`).pipe(
    mergeMap(val => (val.origin === 'stderr' ? _throw(val.str) : of(trimNewLines(val.str))))
  );
};
