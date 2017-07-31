export class DoneWhen {

  private expectedCalls: number;
  private actualCalls = 0;
  private fn: Function;

  constructor(private done) {
  }

  calledNTimes(n: number) {
    this.expectedCalls = n;
    return this;
  }

  call() {
    this.actualCalls++;
    this.callDoneIfQualified();
    return this;
  }

  assertBeforeDone(fn) {
    this.fn = fn;
  }

  private callDoneIfQualified() {
    if (this.actualCalls === this.expectedCalls) {
      if (this.fn) {
        this.fn();
      }

      this.done();
    }
  }


}
