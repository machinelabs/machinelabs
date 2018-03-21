import * as chalk from 'chalk';
import * as jsonfile from 'jsonfile';
import { execSync } from 'child_process';
import { isTag } from '../lib/is-tag';
import { pinMachineLabsDependencies } from '../lib/pin-dependencies';
import { publishPackage } from '../lib/publish-package';

const CLI_PACKAGES = ['/shared/core', '/shared/models', '/cli'];

const publishCliCmd = argv => {
  console.log(chalk.green('Bulding CLI for production'));
  execSync('(cd shared && node build.js)', { stdio: 'pipe' });
  execSync('(cd cli && yarn build:production)', { stdio: 'pipe' });

  console.log(chalk.green('Pinning dependencies as a preparation for npm publishing the CLI'));
  console.log(chalk.green('Do NOT commit this into a stable development branch'));

  CLI_PACKAGES.map(path => `${path}/package.json`).forEach(pathToPackageJson =>
    pinMachineLabsDependencies(pathToPackageJson)
  );

  if (argv.prepareOnly) {
    console.log(
      chalk.green('Pinned. Run `git diff` and check the changes. Run `yarn mla publish-cli` if everything looks good.')
    );
    return;
  }

  CLI_PACKAGES.forEach(path => publishPackage(path));

  console.log(chalk.green('Published CLI and dependend package to npm registry.'));
};

const check = argv => {
  if (argv._.includes('publish-cli') && !isTag() && !argv.force) {
    throw new Error('This command should only be run from tags');
  }
};

export const publishCliCommand = {
  run: publishCliCmd,
  check: check
};
