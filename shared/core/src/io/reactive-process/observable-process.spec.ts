import 'jest';
import { spawn } from 'child_process';

import { toObservableProcess } from './observable-process';

describe('.toObservableProcess()', () => {
  it('should get one message and then done', (done) => {
    let ps = spawn(`echo`, ['foo']);

    let actualMessages: Array<any> = [];
    let actualErrors: Array<any> = [];
    toObservableProcess(ps)
      .subscribe(
        msg => actualMessages.push(msg),
        (e) => actualErrors.push(e),
        () => {

          expect(actualMessages.length).toBe(1);
          expect(actualErrors.length).toBe(0);
          expect(actualMessages[0].origin).toEqual('stdout');
          expect(actualMessages[0].str).toEqual('foo\n');
          done();
        });

  });

  it('should get an stderr message for an invalid command', (done) => {
    let ps = spawn(`foo`, []);

    let actualMessages: Array<any> = [];
    let actualErrors: Array<any> = [];
    toObservableProcess(ps)
      .subscribe(
        msg => actualMessages.push(msg),
        (e) => actualErrors.push(e),
        () => {

          expect(actualMessages.length).toBe(1);
          expect(actualErrors.length).toBe(0);
          expect(actualMessages[0].origin).toEqual('stderr');
          expect(actualMessages[0].str).toEqual('Error: spawn foo ENOENT');
          done();
        });

  });

  it('should get four async messages in order, sterr, stdout, stderr and stdout again', (done) => {
    let ps = spawn(`node -e "setTimeout(() => console.error('error'), 50);
                             setTimeout(() => console.log('foo'), 100);
                             setTimeout(() => console.error('error'), 150);
                             setTimeout(() => console.log('bar'), 200);"`, [], { shell: true });

    let actualMessages: Array<any> = [];
    let actualErrors: Array<any> = [];
    toObservableProcess(ps)
      .subscribe(
        msg => actualMessages.push(msg),
        (e) => actualErrors.push(e),
        () => {
          expect(actualMessages.length).toBe(4);
          expect(actualErrors.length).toBe(0);
          expect(actualMessages[0].origin).toEqual('stderr');
          expect(actualMessages[1].origin).toEqual('stdout');
          expect(actualMessages[1].str).toEqual('foo\n');
          expect(actualMessages[2].origin).toEqual('stderr');
          expect(actualMessages[3].origin).toEqual('stdout');
          expect(actualMessages[3].str).toEqual('bar\n');
          done();
        });

  });
});
