import * as chalk from 'chalk';
import { cut } from '../lib/cut';

export function cutCmd (argv) {
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
