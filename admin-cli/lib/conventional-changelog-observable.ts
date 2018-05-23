import * as process from 'process';
import * as conventionalChangelog from 'conventional-changelog';
import * as chalk from 'chalk';
import { Observable } from 'rxjs';

export function conventionalChangelogObservable(args) {
  return new Observable(observer => {
    conventionalChangelog(
      {
        preset: args.preset,
        releaseCount: args.releaseCount
      },
      {
        version: args.version,
        owner: args.owner,
        repository: args.repository
      }
    )
      .on('err', err => {
        observer.error(err);
      })
      .on('data', buffer => {
        observer.next(buffer);
      })
      .on('end', () => {
        observer.complete();
      });
  });
}
