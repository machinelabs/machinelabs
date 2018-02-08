import { existsSync } from 'fs';
import * as chalk from 'chalk';

export const guardFileExists = (path: string, force = false) => {
  let fileExists = existsSync(path);
  if (fileExists && !force) {
    console.error(chalk.default.red(`${path} already exists. Run \`ml init --force\` if you intend to overwrite ${path} with default settings`));
    process.exit(1);
  }
}
