import * as prettyMs from 'pretty-ms';

// prettyMs can't deal with negative durations and infinite numbers, so we have to help a little.
export const prettyPrintDuration = (duration: number) =>
  duration === Number.POSITIVE_INFINITY ? '∞' : duration > 0 ? prettyMs(duration) : '-' + prettyMs(duration * -1);
