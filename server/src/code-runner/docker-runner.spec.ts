import 'jest';
import { of } from 'rxjs';
import { tap, concat } from 'rxjs/operators';
import { DockerRunner, DockerRunnerConfig } from './docker-runner';
import { stdout, ProcessStreamData, stdoutMsg } from '@machinelabs/core';
import { Lab } from '@machinelabs/models';
import { PublicLabConfiguration, InternalLabConfiguration } from '../models/lab-configuration';
import { Invocation, InvocationType, HardwareType } from '@machinelabs/models';
import { DockerExecutable } from './docker-availability-lookup';

describe('.run(lab)', () => {
  (it as any)('should create container, execute code and invoke uploader', (done: any) => {
    const containerId = 'awesome-id';
    const spawn = jest
      .fn()
      .mockReturnValueOnce(stdout(containerId))
      .mockReturnValue(stdout('execution output'));

    const spawnShell = jest.fn().mockReturnValue(stdout('spawnshell output'));

    const uploader: any = {
      handleUpload: jest.fn().mockReturnValue(stdout('uploader output'))
    };

    const downloader: any = {
      fetch: jest.fn().mockReturnValue(stdout('downloader output'))
    };

    const config = new DockerRunnerConfig();
    config.dockerExecutable = DockerExecutable.Docker;
    config.maxKernelMemoryKb = 1024;
    config.spawn = spawn;
    config.spawnShell = spawnShell;
    config.uploader = uploader;
    config.downloader = downloader;
    const runner = new DockerRunner(config);

    const inv: Invocation = {
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

    const conf: InternalLabConfiguration = {
      maxFileUploads: 5,
      maxUploadFileSizeMb: 20,
      maxWriteableContainerSizeInGb: 6,
      preExecutionCommand: '',
      imageWithDigest: 'bar',
      hardwareType: HardwareType.CPU,
      inputs: [],
      mountPoints: [],
      errors: [],
      parameters: [{ 'pass-as': '--learning_rate=5' }, { 'pass-as': '--max_steps=200' }]
    };

    const outgoingMessages: Array<ProcessStreamData> = [];

    runner
      .run(inv, conf)
      .pipe(
        tap(msg => outgoingMessages.push(msg)),
        tap(_ => expect(runner.count()).toBe(1)),
        // The concat ensures that all expectations will run after the finally block
        // of the Observable that is being returned from run
        concat(of())
      )
      .subscribe(null, null, () => {
        expect(runner.count()).toBe(0);
        expect(outgoingMessages.length).toBe(3);
        expect(outgoingMessages[0]).toEqual(stdoutMsg('downloader output'));
        expect(outgoingMessages[1]).toEqual(stdoutMsg('execution output'));
        expect(outgoingMessages[2]).toEqual(stdoutMsg('uploader output'));
        expect(spawn.mock.calls[0]).toEqual([
          'docker',
          [
            'create',
            '--cap-drop=ALL',
            '--kernel-memory=1024k',
            '--security-opt=no-new-privileges',
            '-t',
            '--read-only',
            '--tmpfs',
            '/run:rw,size=5g,mode=1777',
            '--tmpfs',
            '/tmp:rw,size=1g,mode=1777',
            '-v',
            '/tmp/4711:/lab:ro',
            '--name',
            '4711',
            'bar',
            '/bin/bash'
          ]
        ]);
        expect(spawn.mock.calls[1]).toEqual([
          'docker',
          ['exec', '-t', 'awesome-id', '/bin/bash', '-c', 'cp -R /lab/* /run']
        ]);
        expect(spawn.mock.calls[2]).toEqual([
          'docker',
          [
            'exec',
            '-t',
            containerId,
            '/bin/bash',
            '-c',
            `mkdir /run/outputs && cd /run && python main.py --learning_rate=5 --max_steps=200`
          ]
        ]);
        expect(uploader.handleUpload.mock.calls.length).toBe(1);
        done();
      });
  }, 10);
});
