import * as chalk from 'chalk';
import { factory } from './execute';

import { isRootDir} from './is-root-dir';
import { failWith } from './fail-with';

let execute = factory({displayErrors: true});

export function deployFirebase(project) {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }

  console.log(chalk.green(`Deploying firebase project ${project}`));
  execute(`(cd ./firebase/functions; firebase use ${project} && npm run deploy)`);
}
