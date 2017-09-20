import 'jest';
import { Observable } from '@reactivex/rxjs';
import { DockerFileDownloader } from './docker-file-downloader';
import { stdout, ProcessStreamData, stdoutMsg } from '@machinelabs/core';
import { newLine, bold } from '../../util/shellart';
import * as ansi from 'ansi-escape-sequences';


describe('.fetch(...)', () => {

  it('triggers download and reports progress', (done) => {

    let containerId = '4711';

    let spawn = jest.fn()
        .mockReturnValueOnce(stdout('progress 1st file\n'))
        .mockReturnValueOnce(stdout('progress 2nd file\n'));

    let downloader = new DockerFileDownloader(spawn);

    let inputs = [
      { name: 'foo.zip', url: 'http://foo.com/foo.zip' },
      { name: 'bar.zip', url: 'http://foo.com/bar.zip' }
    ];

    let outgoingMessages: Array<ProcessStreamData> = [];

    downloader
      .fetch(containerId, inputs)
      .do(msg => outgoingMessages.push(msg))
      .subscribe(null, null, () => {
        expect(outgoingMessages.length).toBe(8);
        expect(outgoingMessages[0]).toEqual(stdoutMsg(`Downloading inputs. Hold on.${newLine()}`));
        // tslint:disable-next-line
        expect(outgoingMessages[1]).toEqual(stdoutMsg(`${ansi.cursor.down(3)}\rDownloading ${bold(inputs[0].url)} to ${bold( './inputs/' + inputs[0].name)}`));
        expect(outgoingMessages[2]).toEqual(stdoutMsg(`${ansi.cursor.down(3)}\rDownloading ${bold(inputs[1].url)} to ${bold( './inputs/' + inputs[1].name)}`));
        // jump 5 lines up after both captions are written
        expect(outgoingMessages[3]).toEqual(stdoutMsg(ansi.cursor.up(5)));
        // tslint:disable-next-line
        expect(outgoingMessages[4]).toEqual(stdoutMsg(ansi.cursor.down(downloader.relativeOffset(0)) + `progress 1st file` + ansi.cursor.up(downloader.relativeOffset(0))));
        expect(outgoingMessages[5]).toEqual(stdoutMsg(ansi.cursor.down(downloader.relativeOffset(1)) + `progress 2nd file` + ansi.cursor.up(downloader.relativeOffset(1))));
        // jump 9 lines down and write a new line after both downloads completed
        expect(outgoingMessages[6]).toEqual(stdoutMsg(ansi.cursor.down(9) + newLine()));
        expect(outgoingMessages[7]).toEqual(stdoutMsg(`Finished downloading inputs${newLine()}`));
        done();
      });
  });
});

