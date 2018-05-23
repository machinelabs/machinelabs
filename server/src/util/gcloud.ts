import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { trimNewLines, spawnShell } from '@machinelabs/core';

const spawnOptions = { stdio: 'pipe' };

export const getAccessToken = () => {
  return spawnShell(`gcloud auth print-access-token`).pipe(
    mergeMap(val => (val.origin === 'stderr' ? throwError(val.str) : of(trimNewLines(val.str))))
  );
};
