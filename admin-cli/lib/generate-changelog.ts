import * as process from 'process';
import * as conventionalChangelog from 'conventional-changelog';
import * as chalk from 'chalk';
import * as fs from 'fs';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { tap, finalize, catchError } from 'rxjs/operators';
import { conventionalChangelogObservable } from './conventional-changelog-observable';

function createIfMissing(args) {
  if (!fs.existsSync(args.inFile)) {
    console.log(chalk.blue('Changelog file doesn\'t exist. Creating it...'));
    fs.writeFileSync(args.inFile, '\n', 'utf8');
  }
}

const defaults = {
  inFile: 'CHANGELOG.md',
  releaseCount: 1,
  preset: 'angular',
  owner: 'machinelabs',
  repository: 'machinelabs'
};

export function generateChangelog(args) {
  console.log(chalk.yellow('Generating changelog...'));

  const options = {...defaults, ...args};

  createIfMissing(options);

  let oldContent = options.dryRun ? '' : fs.readFileSync(options.inFile, 'utf8');
  let newContent = '';

  if (oldContent.indexOf('<a name=') !== -1) {
    oldContent = oldContent.substring(oldContent.indexOf('<a name='));
  }

  return conventionalChangelogObservable(options).pipe(
    tap(buffer => {
      newContent += buffer.toString();
    }),
    finalize(() => {
      if (options.dryRun) {
        console.info(`\n${chalk.gray(newContent.trim())}\n`);
      } else {
        fs.writeFileSync(options.inFile, (newContent+oldContent).replace(/\n+$/, '\n'), 'utf8');
        console.log(chalk.yellow(`Changelog generated in ${options.inFile}.`));
      }
    }),
    catchError(err => {
      console.error(chalk.red(err));
      return of(err);
    })
  );
}
