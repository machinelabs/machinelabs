import { spawn, exec } from 'child_process';
import * as fs from 'fs';
import { Observable } from '@ReactiveX/rxjs';
import { ProcessUtil } from '../util/process';
import { CodeRunner, ProcessStreamData } from './code-runner';
import { Lab, File } from '../models/lab';

const PROCESS_START_INDICATOR = '6d04bc0d-15eb-4189-9314-d56545aa1c1a';

/**
 * This is the Docker Runner that takes the code and runs it on a isolated docker container
 */
export class DockerRunner implements CodeRunner {
  run(lab: Lab): Observable<ProcessStreamData> {

    lab.files.forEach((file: File) => {
      // FixMe: Sync is bad. Kitten die. But this code has even more issues so keep calm. 
      fs.writeFileSync(`${process.cwd()}/labfs/${file.name}`, file.content);
    })

    let containerName = `${lab.id}-${Date.now()}`;

    // This may not catch all processes because there is asynchronism
    // happening on the OS level, too. The filter may return a list of
    // pids that isn't yet complete because of the time it takes for
    // other processes to start. Nevertheless, we still want it here
    // because we want to start killing unused processes as early as
    // we can.

    // If you are wondering why don't we just wait for the old process to
    // be killed before we spawn a new one the answer is simply, stopping
    // docker containers is quite slow and we want the UI to be fast. Read on.
    exec(`docker stop $(docker ps -a -q --filter="name=${lab.id}-")`)
    
    let ps = spawn(`docker`, [
                                'run',
                                '-i',
                                '--rm',
                                `--name`,
                                containerName,
                                '-v',
                                `${process.cwd()}/labfs:/labfs`,
                                'thoughtram/keras',
                                '/bin/bash',
                                '-c',
                                // We need to have a way to tell that our docker process started
                                // We put an echo before the actual python call so that
                                // we have something on STDOUT that tells us that the process
                                // is alive and kicking. If anyone knows a better way I'm all ears!
                                `echo ${PROCESS_START_INDICATOR} && python /labfs/main.py`
                                ]);

    // This may look weird and in fact it is! We want to wait for the process 
    // to begin because only than it is save to delete all the remaining old processes.
    // We may be able to clean that up in terms of Rx code but it needs some testing.
    return ProcessUtil.toObservableProcess(ps)
                      .do((data: ProcessStreamData) => {
                        if (data.str.trim() === PROCESS_START_INDICATOR){
                          console.log(`Killing all labs of ${lab.id} except ${containerName}`);
                          exec(`docker stop $(docker ps -a -q --filter="name=${lab.id}-" --filter="before=${containerName}")`);
                        }
                      })
                      .filter((data: ProcessStreamData) => data.str.trim() !== PROCESS_START_INDICATOR);

  }
}
