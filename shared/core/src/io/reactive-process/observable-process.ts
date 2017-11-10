import { ChildProcess, exec } from 'child_process';
import { Observable } from '@reactivex/rxjs';
import { OutputType } from './process-stream-data';

export const toObservableProcess = (process: ChildProcess) => {
  // a simple mapping function to preserve meta info around the data so that we
  // can pump stdout and stderr through one common stream.
  let mapFrom = (origin: OutputType) => (data: Buffer | string) => ({ origin: origin, raw: data, str: data.toString() });

  let stdOutStream = Observable
    .fromEvent(process.stdout, 'data')
    .map(mapFrom(OutputType.Stdout))
    .share();

  // Since STDERR is a stream just like STDOUT it doesn't
  // really work to propagate that with Observable/error.
  // Instead we combine STDOUT and STDERR to one stream.
  let stdErrStream = Observable
    .fromEvent(process.stderr, 'data')
    .map(mapFrom(OutputType.Stderr))
    .share();

  // In contrast to STDERR these are errors directly related to the
  // spawning of the process. We still want them to treat them as if
  // it was a regular STDERR case.
  let spawnErrStream = Observable.fromEvent(process, 'error')
                            .map(mapFrom(OutputType.Stderr))
                            // we duplicate the message because we need one to propagate as STDERR
                            // and the second one to stop the entire stream
                            .flatMap(val => [val, val])
                            .share();

  let closeStream = Observable.fromEvent(process, 'close').share();

  return Observable.merge(stdOutStream, stdErrStream, spawnErrStream)
                   .takeUntil(closeStream)
                   // we listen for the second message of `spawnErrStream` because we want one
                   // message to go through to just propagate as a regular STDERR message
                   .takeUntil(spawnErrStream.skip(1));
};
