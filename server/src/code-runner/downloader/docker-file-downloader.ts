import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { merge } from 'rxjs/observable/merge';
import { concat as concatObservable } from 'rxjs/observable/concat';
import { map, concat } from 'rxjs/operators';
import * as ansi from 'ansi-escape-sequences';

import { ProcessStreamData, stdoutMsg, stderrMsg, stdout, OutputType, SpawnFn, SpawnShellFn } from '@machinelabs/core';
import { LabInput } from '../../models/lab-configuration';
import { newLine, bold } from '../../util/shellart';

export class DockerFileDownloader {
  // The lineHeight is the number of lines we use per input.
  // This is currently 3 which boils down to caption, progress bar and one line as spacing.
  private lineHeight = 3;

  constructor(private spawn: SpawnFn) {}

  public relativeOffset(index: number) {
    return (index + 1) * this.lineHeight;
  }

  // Writes captions for each progress bar. Then resets the cursor to be prepared for the actual progress bars
  private writeCaptions(inputs: Array<LabInput>) {
    const writeCaption = (value: LabInput) =>
      `${ansi.cursor.down(this.lineHeight)}\rDownloading ${bold(value.url)} to ${bold('./inputs/' + value.name)}`;

    return merge(...inputs.map((value, index) => stdout(writeCaption(value)))).pipe(
      // After the captions are written, reset the cursor for the actual progress bars
      concat(stdout(ansi.cursor.up(this.relativeOffset(inputs.length - 1) - 1)))
    );
  }

  private writeProgressbars(containerId: string, inputs: Array<LabInput>) {
    return merge(
      ...inputs.map((input, index) =>
        this.spawn('docker', [
          'exec',
          '-t',
          containerId,
          '/bin/bash',
          '-c',
          `mkdir -p /run/inputs && curl --progress-bar -o "/run/inputs/${input.name}" -L "${input.url}"`
        ]).pipe(
          // When the progress bar reaches 100 % it renders a new line which
          // then destroys all the other progress bars below, hence we filter it out.
          map(msg => ({
            ...msg,
            str: msg.str.replace('\n', '')
          })),
          map(msg => {
            const offset = this.relativeOffset(index);
            msg.str = ansi.cursor.down(offset) + msg.str + ansi.cursor.up(offset);
            return msg;
          })
        )
      ),
      // we make sure to set the cursor to the very end (relative to the first progress bar)
      // and end with a new line so that further output just works as usual
      concatObservable(stdout(`${ansi.cursor.down(this.relativeOffset(inputs.length)) + newLine()}`))
    );
  }

  fetch(containerId: string, inputs: Array<LabInput>) {
    return inputs.length > 0
      ? stdout(`Downloading inputs. Hold on.${newLine()}`).pipe(
          concat(this.writeCaptions(inputs)),
          concat(this.writeProgressbars(containerId, inputs)),
          concat(stdout(`Finished downloading inputs${newLine()}`))
        )
      : empty<ProcessStreamData>();
  }
}
