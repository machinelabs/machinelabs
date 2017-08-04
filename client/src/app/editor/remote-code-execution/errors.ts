export class RateLimitError extends Error {
  constructor(public executionId, public message) {
    super(message);
    // tslint:disable-next-line
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class TimeoutError extends Error {
  constructor(public executionId, public message) {
    super(message);
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}
