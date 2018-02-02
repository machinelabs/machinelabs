import * as chalk from 'chalk';
import { concat } from 'rxjs/observable/concat';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { defer } from 'rxjs/observable/defer';
import { takeWhile, mergeMap } from 'rxjs/operators';
import { OutputType, stdout, spawnShell } from '@machinelabs/core';
import { factory } from './execute';
import * as fs from 'fs';
import * as pty from 'node-pty';

import { isRootDir } from './is-root-dir';
import { failWith } from './fail-with';
import { processify } from './processify';

export function deployServer(project, serverName, zone, env) {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }

  return concat(
    stdout(chalk.green('Deploying server')),

    spawnShell(`(cd ./server && npm run node_modules && npm run build -- --env=${env})`),

    processify(() => {
      if (!fs.existsSync('./server/dist')) {
        console.log(chalk.red('Dist does not exist. Aborting'));
        process.exit(1);
      }
    }),

    // With our current setup transferring the ./dist isn't enough
    // We have to zip the entire directory (takes ages otherwise)
    // Send it over, and then unzip it on the other end

    // zip the server directory
    stdout(chalk.green('Zipping files for better performance')),

    // -h dereferences symlinks which is needed to "inline" shared libs
    spawnShell(`tar -h -zcf machinelabs-server.tar.gz ./server`),

    // copy over
    stdout(chalk.green('Transferring files to server')),
    copyServer(serverName, project, zone),

    // unzip and run
    stdout(chalk.green('Unzipping and restarting services')),
    // tslint:disable-next-line
    spawnShell(`gcloud compute --project "${project}" ssh --zone "${zone}" "root@${serverName}" --command "cd /var && tar -zxf machinelabs-server.tar.gz && rm -rf machinelabs-server && mv server machinelabs-server && pm2 restart all"`),

    // // Cleanup
    stdout(chalk.green('Cleaning up')),
    spawnShell(`rm -rf ./machinelabs-server.tar.gz`),
    stdout(chalk.green('Server successfully deployed'))
  );
}

const copyServer = (serverName: string, project:string, zone:string) => {

  // In order to get live progress updates we have to use a TTY.
  // Using `stdio: inherit` (aka using the tty of the host process)
  // messes up everything Instead we are using a fake tty and then
  // just forward all the output as if it wasn't for a TTY.
  // Doesn't give us the same progress updater experience as with
  // a real TTY but better than nothing.

  // There's no way to tell when the process is finished so we have to
  // concat the command with an echo and use a unique indicator and
  // scan for its appearance
  let endOfProcessIndicator = 'a1c80580-1505-4555-814c-301b1c5fff98';

  return defer(() => {
    var term = pty.spawn(`/bin/bash`, ['-c', `gcloud compute copy-files ./machinelabs-server.tar.gz root@${serverName}:/var/machinelabs-server.tar.gz --project "${project}" --zone "${zone}"; echo ${endOfProcessIndicator}`], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.cwd(),
      env: process.env
    });

    return fromEvent(term, 'data')
      .pipe(
        takeWhile((data:string) => !data.trim().endsWith(endOfProcessIndicator)),
        mergeMap((data:string) => stdout(data))
      );
  });
}
