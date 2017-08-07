import * as chalk from 'chalk';
import * as process from 'process';

export function failWith (message) {
  console.log(chalk.red(message));
  process.exit(1);
}
