import { spawn } from 'child_process';
import * as fs from 'fs';
import { Observable } from '@ReactiveX/rxjs';
import { ProcessUtil } from '../util/process';
import { CodeRunner, ProcessStreamData } from './code-runner';
import { Lab, File } from '../models/lab';

/**
 * This is the Docker Runner that takes the code and runs it on a isolated docker container
 */
export class DockerRunner implements CodeRunner {
  run(lab: Lab): Observable<ProcessStreamData> {

    lab.files.forEach((file: File) => {
      // FixMe: Sync is bad. Kitten die. But this code has even more issues so keep calm. 
      fs.writeFileSync(`${process.cwd()}/labfs/${file.name}`, file.content);
    })

    return ProcessUtil
            .toObservableProcess(spawn(`docker`, [
                                                  'run',
                                                  '-i',
                                                  '--rm',
                                                  '-v',
                                                  `${process.cwd()}/labfs:/labfs`,
                                                  'thoughtram/keras',
                                                  'python',
                                                  '/labfs/main.py'
                                                  ]))
  }
}
