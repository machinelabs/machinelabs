var Rx = require('@reactivex/rxjs');

export class ProcessUtil {
  static toObservableProcess(process) {
    // a simple mapping function to preserve meta info around the data so that we
    // can pump stdout and stderr through one common stream.
    let mapFrom = origin => data => ({ origin: origin, raw: data, str: data.toString() });

    let stdOutStream = Rx.Observable
                        .fromEvent(process.stdout, 'data')
                        .map(mapFrom('stdout'))
                        .share();

    // Since STDERR is a stream just like STDOUT it doesn't 
    // really work to propagate that with Observable/error.
    // Instead we combine STDOUT and STDERR to one stream.
    let stdErrStream = Rx.Observable
                        .fromEvent(process.stderr, 'data')
                        .map(mapFrom('stderr'))
                        .share();

    let closeStream = Rx.Observable.fromEvent(process, 'close').share();

    return Rx.Observable.merge(stdOutStream, stdErrStream).takeUntil(closeStream)
  }
}