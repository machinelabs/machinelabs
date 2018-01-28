let program = require('commander');
import * as chalk from 'chalk';
import { refBuilder } from '../firebase/fb';
import { loginFromCache } from '../lib/auth/auth';
import { writeDirectory, LabApi, parseLabDirectory } from '@machinelabs/core';
import { Lab } from '@machinelabs/models';
import { Observable } from 'rxjs/Observable';
import { switchMap, map, catchError } from 'rxjs/operators';

program
  .command('pull')
  .description('Pull existing lab to your local file system')
  .option('-i --id [id]', 'The lab id for an existing lab to pull. This parameter is mandatory.')
  .option('-d --directory [directory]', 'The name of a new directory to pull into. This parameter is optional.')
  .action(cmd => {
    if (!cmd.id) {
      console.error(chalk.default.red('No lab id specified. The id is required in order to pull a lab'));
      process.exit(1);
    }

    loginFromCache()
      .pipe(
        switchMap(currentUser => refBuilder.labRef(cmd.id).onceValue()
          .pipe(
            map(snapshot => snapshot.val()),
            switchMap((lab: Lab) => {
              const directory = { name: cmd.directory || null, contents: parseLabDirectory(lab.directory) };
              return writeDirectory(directory, !cmd.directory);
            }),
            catchError(error => {
              console.error(chalk.default.red('Pull failed. Try logging in again with `ml login`.'));
              return Observable.throw(error);
            })
          )
        )
      )
      .subscribe((value) => {
        const message = `Lab was successfully pulled into ${cmd.directory ? './' + cmd.directory : 'the current working directory'}`;
        console.log(chalk.default.green.bold(message));
        process.exit();
      }, () => process.exit(1));
  });
