import { spawn, exec } from 'child_process';
import * as fs from 'fs';
import { Observable } from '@reactivex/rxjs';
import { ProcessUtil } from '../util/process';
import { CodeRunner, ProcessStreamData } from './code-runner';
import { Lab, File } from '../models/lab';
import { Run } from '../models/run';

/**
 * This is the Docker Runner that takes the code and runs it on a isolated docker container
 */
export class DockerRunner implements CodeRunner {
  run(run: Run): Observable<ProcessStreamData> {

    // construct a shell command to create all files.
    // The `&` makes sure that file creation happens asynchronously rather than sequentially.
    // File creation happens inside the docker container. That means we don't have to map
    // any directory from the host into container. And if anything bad happens to the container there
    // is no way we could leave cruft behind on the host system.

    // ATTENTION: The formatting is important here. We have to use a Here Doc because of multi line strings
    // http://stackoverflow.com/questions/2953081/how-can-i-write-a-here-doc-to-a-file-in-bash-script/2954835#2954835
    let writeCommand = run.lab.files.map((file: File) =>`{ cat <<'EOL' > ${file.name}
${file.content}
EOL
}`)
                                .join(` & `);

    let ps = spawn(`docker`, [
                                'run',
                                '--cap-drop=ALL',
                                '--memory=128m',
                                '--net=none',
                                '--security-opt=no-new-privileges',
                                '-i',
                                '--rm',
                                `--name`,
                                run.id,
                                'thoughtram/keras',
                                '/bin/bash',
                                '-c',
                                `(${writeCommand}) && python main.py`
                                ]);

    return ProcessUtil.toObservableProcess(ps);
  }

  stop (run: Run, attempt = 0) {
    console.log(`Stopping container with name: ${run.id}`);
    
    exec(`docker kill $(docker ps -a -q --filter="name=${run.id}")`, (error, stdout, stderr) => {
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
            console.log(`Giving up on ${run.id}. (Container doesn't run anymore)`);
            return;
          }
          
          let currentAttempt = attempt + 1;
          console.log(`Failed to stop ${run.id}....rescheduling for stopping (${currentAttempt} attempt)`);
          setTimeout(() => this.stop(run, currentAttempt), 1000)
          return;
        }
      });
  }


}
