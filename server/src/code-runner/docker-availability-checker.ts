import { Observable } from '@reactivex/rxjs';
import { ProcessStreamData, OutputType, SpawnFn } from '@machinelabs/core';

export enum DockerExecutable {
  NvidiaDocker = 'nvidia-docker',
  Docker = 'docker',
  None = 'none'
}

export class DockerAvailabilityChecker {
  constructor(private spawn: SpawnFn) {}

  hasDocker () {
    return this.doesNotFail('docker');
  }

  hasNvidiaDocker () {
    return this.doesNotFail('nvidia-docker');
  }

  getExecutable() {
    return Observable
            .forkJoin(this.hasDocker(), this.hasNvidiaDocker())
            .map(([hasDocker, hasNvidiaDocker]) => (hasNvidiaDocker && hasDocker) ? DockerExecutable.NvidiaDocker :
                                                     hasDocker ? DockerExecutable.Docker : DockerExecutable.None);
  }

  private doesNotFail (cmd: string) {
    return this.spawn(cmd, ['-v'])
                .map(val => val.origin === OutputType.Stderr ? false : true);
  }
}
