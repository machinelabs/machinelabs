import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { map } from 'rxjs/operators';
import { ProcessStreamData, OutputType, SpawnFn } from '@machinelabs/core';

export enum DockerExecutable {
  NvidiaDocker = 'nvidia-docker',
  Docker = 'docker',
  None = 'none'
}

export class DockerAvailabilityLookup {
  constructor(private spawn: SpawnFn) {}

  hasDocker() {
    return this.doesNotFail('docker');
  }

  hasNvidiaDocker() {
    return this.doesNotFail('nvidia-docker');
  }

  getExecutable() {
    return forkJoin(this.hasDocker(), this.hasNvidiaDocker()).pipe(
      map(
        ([hasDocker, hasNvidiaDocker]) =>
          hasNvidiaDocker && hasDocker
            ? DockerExecutable.NvidiaDocker
            : hasDocker ? DockerExecutable.Docker : DockerExecutable.None
      )
    );
  }

  private doesNotFail(cmd: string) {
    return this.spawn(cmd, ['-v']).pipe(map(val => (val.origin === OutputType.Stderr ? false : true)));
  }
}
