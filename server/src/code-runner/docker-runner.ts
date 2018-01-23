import { exec } from 'child_process';
import { Observable } from '@reactivex/rxjs';
import { CodeRunner } from './code-runner';
import { File } from '@machinelabs/models';
import { createWriteLabDirectoryCmd } from '@machinelabs/core';
import { Invocation } from '@machinelabs/models';
import { InternalLabConfiguration } from '../models/lab-configuration';
import { trimNewLines, ProcessStreamData, stdoutMsg, SpawnShellFn, SpawnFn } from '@machinelabs/core';
import { mute } from '../rx/mute';
import { getAccessToken } from '../util/gcloud';
import { environment } from '../environments/environment';
import { getCurlForUpload } from '../util/file-upload';
import { DockerFileUploader } from './uploader/docker-file-uploader';
import { DockerFileDownloader } from './downloader/docker-file-downloader';
import { flatMap } from 'lodash';
import { DockerExecutable } from './docker-availability-lookup';

export class DockerRunnerConfig {
  runPartitionSize = '5g';
  runPartitionMode = '1777';
  tmpPartitionSize = '1g';
  tmpPartitionMode = '1777';
  dockerExecutable: DockerExecutable;
  maxKernelMemoryKb: number;
  spawn: SpawnFn;
  spawnShell: SpawnShellFn;
  uploader: DockerFileUploader;
  downloader: DockerFileDownloader;
}

/**
 * This is the Docker Runner that takes the code and runs it on a isolated docker container
 */
export class DockerRunner implements CodeRunner {

  constructor(private config: DockerRunnerConfig) {}

  private processCount = 0;

  run(invocation: Invocation, configuration: InternalLabConfiguration): Observable<ProcessStreamData> {

    // construct a shell command to create all files.
    // File creation happens inside the docker container. That means we don't have to map
    // any directory from the host into container. And if anything bad happens to the container there
    // is no way we could leave cruft behind on the host system.
    let writeCommand = createWriteLabDirectoryCmd(invocation.data.directory);

    this.processCount++;

    const args = configuration.parameters.map(param => param['pass-as']).join(' ');

    let mounts = flatMap(configuration.mountPoints, mp => ['-v', `${mp.source}:${mp.destination}:ro`]);

    return this.config.spawn(this.config.dockerExecutable, [
      'create',
      '--cap-drop=ALL',
      `--kernel-memory=${this.config.maxKernelMemoryKb}k`,
      '--security-opt=no-new-privileges',
      '-t',
      '--read-only',
      '--tmpfs',
      `/run:rw,size=${this.config.runPartitionSize},mode=${this.config.runPartitionMode}`,
      '--tmpfs',
      `/tmp:rw,size=${this.config.tmpPartitionSize},mode=${this.config.tmpPartitionMode}`,
      ...mounts,
      `--name`,
      invocation.id,
      configuration.imageWithDigest,
      '/bin/bash'
    ])
    .map(msg => trimNewLines(msg.str))
    .flatMap(containerId =>
      this.config.spawnShell(`docker start ${containerId}`).let(mute)
          .concat(this.config.downloader.fetch(containerId, configuration.inputs))
          .concat(this.config.spawn(this.config.dockerExecutable, [
            'exec',
            '-t',
            containerId,
            '/bin/bash',
            '-c',
            `mkdir /run/outputs && cd /run && (${writeCommand}) && python main.py ${args}`
          ]))
          .concat(this.config.uploader.handleUpload(invocation, containerId))
          .concat(this.config.spawnShell(`docker rm -f ${containerId}`).let(mute))
    )
    .finally(() => this.processCount--);
  }

  stop (id: string, attempt = 0) {
    console.log(`Stopping container with name: ${id}`);

    exec(`docker kill $(docker ps -a -q --filter="name=${id}")`, (error, stdout, stderr) => {
        if (error) {

          // If this errored it means the `docker ps` did not return a container and
          // called the kill without arguments. This can happen if we kill a container while
          // it is just in the process of creation (e.g. user hammers the run button)
          // If we miss to kill it here it will run forever (until it is finished)
          // For now, we just reschedule removal. It may be better to come up with something
          // like a garbage collector. Needs investigation.

          // It may happen that a container already terminated *before* we try to kill it manually.
          // If this happens, we would end up rescheduling termination for ever unless we have a treshold
          // Currently we make 10 attempts to kill a container. If there is no container with that id,
          // by that time it probably means it terminated already.

          // TODO: We need to investigate how that scales under load. If processes take really long to spawn
          // this system may fall apart again.
          if (attempt >= 10) {
            console.log(`Giving up on ${id}. (Container doesn't run anymore)`);
            return;
          }

          let currentAttempt = attempt + 1;
          console.log(`Failed to stop ${id}....rescheduling for stopping (${currentAttempt} attempt)`);
          setTimeout(() => this.stop(id, currentAttempt), 1000);
          return;
        }
      });
  }

  count() {
    return this.processCount;
  }

}
