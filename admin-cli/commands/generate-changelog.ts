import { generateChangelog } from '../lib/generate-changelog';

const generateChangelogCmd = argv => {
  generateChangelog(argv).subscribe();
};

const check = argv => {
  if (!argv.version) {
    throw new Error('Couldn\'t generate changelog, missing option \'version\'');
  }
};

export const generateChangelogCommand = {
  run: generateChangelogCmd,
  check: check
};
