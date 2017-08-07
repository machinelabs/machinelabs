import * as chalk from 'chalk';
import { factory } from './execute';

import { isRootDir} from './is-root-dir';
import { failWith } from './fail-with';

let execute = factory({displayErrors: true});

export function deployClient(project, env) {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }

  console.log(chalk.green(`Deploying client to ${project} with env=${env}`));

  execute(`(cd ./client &&
            npm run node_modules &&
            ng build --prod --environment=${env} &&
            firebase use ${project} &&
            firebase deploy)`);

  console.log(chalk.green('Everything live!'));
}
