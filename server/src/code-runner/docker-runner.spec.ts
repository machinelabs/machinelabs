import 'jest';
import { Observable } from '@reactivex/rxjs';
import { DockerRunner } from './docker-runner';
import { stdout, ProcessStreamData, stdoutMsg } from '@machinelabs/core';
import { Lab } from '@machinelabs/models';
import { PublicLabConfiguration, InternalLabConfiguration } from '../models/lab-configuration';
import { Invocation, InvocationType } from '../models/invocation';

describe('.run(lab)', () => {

  it('should create container, execute code and invoke uploader', (done) => {

    let containerId = 'awesome-id';
    let spawn = jest.fn()
                    .mockReturnValueOnce(stdout(containerId))
                    .mockReturnValue(stdout('execution output'));

    let spawnShell = jest.fn()
                         .mockReturnValue(stdout('spawnshell output'));

    let uploader: any = {
      handleUpload: jest.fn().mockReturnValue(stdout('uploader output'))
    };

    let downloader: any = {
      fetch: jest.fn().mockReturnValue(stdout('downloader output'))
    };

    let runner = new DockerRunner(spawn, spawnShell, uploader, downloader);


    let inv: Invocation = {
      id: '4711',
      timestamp: Date.now(),
      user_id: 'me',
      type: InvocationType.StartExecution,
      data: {
        directory: [
          {
            name: 'foo.py',
            content: 'foo'
          }
        ]
      }
    };

    let conf: InternalLabConfiguration = {
      dockerImageId: 'foo',
      imageWithDigest: 'bar',
      inputs: [],
      parameters: [
        { 'pass-as': '--learning_rate=5' },
        { 'pass-as': '--max_steps=200' }
      ]
    };

    let outgoingMessages: Array<ProcessStreamData> = [];

    runner.run(inv, conf)
       .do(msg => outgoingMessages.push(msg))
       .do(_ => expect(runner.count()).toBe(1))
       // The concat ensures that all expectations will run after the finally block
       // of the Observable that is being returned from run
       .concat(Observable.of())
       .subscribe(null, null, () => {
         expect(runner.count()).toBe(0);
         expect(outgoingMessages.length).toBe(3);
         expect(outgoingMessages[0]).toEqual(stdoutMsg('downloader output'));
         expect(outgoingMessages[1]).toEqual(stdoutMsg('execution output'));
         expect(outgoingMessages[2]).toEqual(stdoutMsg('uploader output'));
         // tslint:disable-next-line
         expect(spawn.mock.calls[0]).toEqual(['docker', ['create', '--cap-drop=ALL', '--security-opt=no-new-privileges', '-t', '--read-only', '--tmpfs', '/run:rw,size=5g,mode=1777', '--tmpfs', '/tmp:rw,size=1g,mode=1777', '--name', '4711', 'bar', '/bin/bash']]);
         // tslint:disable-next-line
         expect(spawn.mock.calls[1]).toEqual(['docker', ['exec', '-t', containerId, '/bin/bash', '-c', `mkdir /run/outputs && cd /run && ({ cat <<'EOL' > foo.py
foo
EOL
}) && python main.py --learning_rate=5 --max_steps=200`]]);
         expect(uploader.handleUpload.mock.calls.length).toBe(1);
         done();
       });
  });

});
