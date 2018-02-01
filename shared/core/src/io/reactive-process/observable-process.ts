import { ChildProcess, exec } from 'child_process';
import { Observable } from 'rxjs/Observable';
import { map, share, mergeMap, skip, takeUntil } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { OutputType } from './process-stream-data';

export const toObservableProcess = (process: ChildProcess) => {
  // a simple mapping function to preserve meta info around the data so that we
  // can pump stdout and stderr through one common stream.
  let mapFrom = (origin: OutputType) => (data: Buffer | string) => ({ origin: origin, raw: data, str: data.toString() });

  let stdOutStream = fromEvent(process.stdout, 'data')
    .pipe(
      map(mapFrom(OutputType.Stdout)),
      share()
    );

  // Since STDERR is a stream just like STDOUT it doesn't
  // really work to propagate that with Observable/error.
  // Instead we combine STDOUT and STDERR to one stream.
  let stdErrStream = fromEvent(process.stderr, 'data')
    .pipe(
      map(mapFrom(OutputType.Stderr)),
      share()
    );

  // In contrast to STDERR these are errors directly related to the
  // spawning of the process. We still want them to treat them as if
  // it was a regular STDERR case.
  let spawnErrStream = fromEvent(process, 'error')
    .pipe(
      map(mapFrom(OutputType.Stderr)),
      // we duplicate the message because we need one to propagate as STDERR
      // and the second one to stop the entire stream
      mergeMap(val => [val, val]),
      share()
    );

  let closeStream = fromEvent(process, 'close').pipe(share());

  return merge(stdOutStream, stdErrStream, spawnErrStream)
    .pipe(
      takeUntil(closeStream),
      // we listen for the second message of `spawnErrStream` because we want one
      // message to go through to just propagate as a regular STDERR message
      takeUntil(spawnErrStream.pipe(skip(1)))
    );
};
