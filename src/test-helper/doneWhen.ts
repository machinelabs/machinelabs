export class DoneWhen {

  private expectedCalls: number;
  private actualCalls = 0;

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

  private callDoneIfQualified() {
    if (this.actualCalls === this.expectedCalls) {
      this.done();
    }
  }
}
