import * as chalk from 'chalk';
import { cut } from '../lib/cut';
import { usedMoreThanOnce, usedAtLeastOnce } from '../lib/utils';

const cutCmd = (argv) => {
  console.log(chalk.green('Cutting release'));

  if (argv.major) {
    cut('major', argv.dryRun);
  } else if (argv.minor) {
    cut('minor', argv.dryRun);
  } else if (argv.patch) {
    cut('patch', argv.dryRun);
  } else if (argv.dev) {
    cut('dev', argv.dryRun);
  } else if (argv.version) {
    cut(argv.version, argv.dryRun);
  }
}

const check = argv => {
  if (usedMoreThanOnce([argv.major, argv.minor, argv.patch, argv.dev])) {
    throw new Error('`major`, `minor`, `patch` and `dev` are mutually exclusive')
  }

  if (argv.version && usedAtLeastOnce([argv.major, argv.minor, argv.patch, argv.dev])) {
    throw new Error('`version` is mutually exclusive with `major`, `minor`, `patch` and `dev`');
  }

}

export const cutCommand = {
  run: cutCmd,
  check: check
}