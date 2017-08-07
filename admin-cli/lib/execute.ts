import * as chalk from 'chalk';
import { execSync } from 'child_process';

const spawnOptions = { stdio: 'pipe' };

export const factory = (options = { displayErrors: false }) => {
  return (cmd) => {
    try {
      let output = execSync(cmd, spawnOptions).toString();
      console.log(output);
      return output;
    } catch (e) {
      if (options.displayErrors) {
        console.log(chalk.red(e));
      }
    }
  };
};
