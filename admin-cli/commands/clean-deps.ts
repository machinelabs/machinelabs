import { createDb } from '../lib/create-db';
import { getEnv } from '../lib/get-env';
import { Observable } from '@reactivex/rxjs';
import { factory } from '../lib/execute';

let execute = factory({displayErrors: true});

const cleanDeps = (argv) => {
  console.log('Removing node_modules folders across the repository');
  execute(`find . -name "node_modules" -type d -prune -exec rm -rf '{}' +`);
}

export const cleanDepsCommand = {
  run: cleanDeps,
  check: () => true
};