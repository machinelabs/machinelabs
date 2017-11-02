import { factory } from '../lib/execute';
import { execSync } from 'child_process';

const buildShared = (argv) => execSync(`(cd ./shared && node build.js)`, { stdio: 'inherit' });

export const buildSharedCommand = {
  run: buildShared,
  check: () => {}
};