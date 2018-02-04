import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { filter, take, share, map, mergeMap, merge, catchError, distinctUntilChanged, startWith } from 'rxjs/operators';
import { Invocation, PlanCredits, PlanId } from '@machinelabs/models';
import { getAccessToken } from '../../util/gcloud';
import { mute } from '../../rx/mute';
import { getCurlForUpload } from '../../util/file-upload';
import { environment } from '../../environments/environment';
import { ProcessStreamData, spawn, stdoutMsg, stderrMsg, stdout, OutputType } from '@machinelabs/core';
import { InternalLabConfiguration } from '../../models/lab-configuration';
import { bold } from '../../util/shellart';

class FileInfo {
  name: string;
  sizeBytes: number;
}

const BACKER_PLAN = PlanCredits.get(PlanId.BetaBacker);

const PATREON_URL = 'https://patreon.com/machinelabs';

export class DockerFileUploader {
  maxFileSize: number;

  constructor(private maxFileSizeMb: number) {
    this.maxFileSize = this.maxFileSizeMb * 1024 * 1024;
  }

  handleUpload(invocation: Invocation, containerId: string, config: InternalLabConfiguration) {

    let fileInfos$ = this.getFileList(containerId).pipe(share());
    let visibleOutput$ = this.generateUserVisibleOutput(fileInfos$, config);
    let uploadFiles$ = this.uploadFiles(fileInfos$, containerId, invocation, config);

    return uploadFiles$.pipe(merge(visibleOutput$));
  }

  private uploadFiles(files: Observable<FileInfo>, containerId: string, invocation: Invocation, config: InternalLabConfiguration) {
    let uploadFiles$ = files
      .pipe(
        filter(fileInfo => fileInfo.sizeBytes <= this.maxFileSize),
        take(config.maxFileUploads)
      );

    let genericError = 'An error occured during the upload';

    return getAccessToken()
      .pipe(
        mergeMap(token => uploadFiles$.pipe(map(fileInfo => ({ fileInfo, token })))),
        map(val => this.getCurlForUpload(invocation, val.fileInfo.name, val.token)),
        mergeMap(cmd => spawn('docker', ['exec', containerId, '/bin/bash', '-c', `cd /run/outputs && ${cmd}`])),
        map(val => {
          // For some reason stdout and stderr are swapped for the curl output (strangest thing!)
          // We work around it by muting everything except errors with --silent --show-errors
          // Errors will still appear on STDOUT but we know that when we make it this far that
          // it has to be an error even though it's coming through STDOUT
          console.error(genericError, val.str);
          return stderrMsg(`${genericError}\r\n`);
        }),
        // We don't want the generic error to show up n times (once per failure)
        distinctUntilChanged((a, b) => a.str == b.str),
        catchError(err => {
          console.error(`Could not get access token from gcloud`, err);
          return stdout(`${genericError}\r\n`);
        })
      );
  }

  private getFileList(containerId: string): Observable<FileInfo> {
    return spawn('docker', ['exec', containerId, '/bin/bash', '-c', 'cd /run/outputs && find . -maxdepth 1 -type f | xargs stat --printf "%n:::%s"'])
      .pipe(
        filter(val => val.origin === OutputType.Stdout),
        map(val => val.str.split('./').filter(name => name.length > 0).map(output => output.split(':::'))),
        mergeMap(fileList => from(fileList)),
        map(fileInfo => ({ name: fileInfo[0], sizeBytes: parseInt(fileInfo[1], 10) }))
      );
  }

  private generateUserVisibleOutput(files: Observable<FileInfo>, config: InternalLabConfiguration) {
    return files
      .pipe(
        map((info, index) => {
          if (index < config.maxFileUploads) {
            if (info.sizeBytes > this.maxFileSize) {
              return stdoutMsg(`Skipping file ${info.name}. File exceeds maximum size of ${this.maxFileSizeMb} Mb.\r\n`);
            } else {
              return stdoutMsg(`Uploading file ${info.name} (${info.sizeBytes / 1024} kB)\r\n`);
            }
          } else {
            return stdoutMsg(`
Skipping ${info.name} and any further files.\r
Your plan does not allow more than ${config.maxFileUploads} output files per execution.\r
Backers on ${bold(PATREON_URL)} can upload ${BACKER_PLAN.maxFileUploads} files per execution\r\n`);
          }
        }),
        take(config.maxFileUploads + 1),
        startWith(stdoutMsg('Uploading files from ./outputs (if any)...hold tight\r\n'))
      );
  }

  private getCurlForUpload(invocation: Invocation, file: string, token: string) {
    let headers = new Map([
      ['x-goog-meta-name', file],
      ['x-goog-meta-user_id', invocation.user_id],
      ['x-goog-meta-execution_id', invocation.id],
      ['x-goog-meta-type', 'execution_output']
    ]);

    return getCurlForUpload(environment.firebaseConfig.storageBucket,
      file,
      `executions/${invocation.id}/outputs/${file}`,
      token,
      headers);
  }

}
