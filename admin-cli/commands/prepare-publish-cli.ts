import * as chalk from 'chalk';
import * as jsonfile from 'jsonfile';
import { isTag } from '../lib/is-tag';
import { pinMachineLabsDependencies } from '../lib/pin-dependencies';

const CLI_DEPS = [
  '/shared/core/package.json',
  // models doesn't have any @machinelabs dependencies but we can
  // still add it to be prepared.
  '/shared/models/package.json',
  '/cli/package.json'
]

const preparePublishCliCmd = (argv) => {

  console.log(chalk.green('Pinning dependencies as a preparation for npm publishing the CLI'));
  console.log(chalk.green('Do NOT commit this into a stable development branch'));

  CLI_DEPS.forEach(pathToPackageJson => pinMachineLabsDependencies(pathToPackageJson));

  console.log(chalk.green('Pinned. Run `git diff` and check the changes. Run `yarn mla publish-cli` if everything looks good.'));
}

const check = argv => {
  if (!isTag() && !argv.force) {
    throw new Error('This command should only be run from tags');
  }
}

export const preparePublishCliCommand = {
  run: preparePublishCliCmd,
  check: check
}