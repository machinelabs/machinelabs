let program = require('commander');
let pgk = require('../package.json');

import './firebase/fb';

import './commands/login';
import './commands/logout';
import './commands/push';
import './commands/init';
import './commands/pull';
import './commands/catch-all'

program
  .version(pgk.version);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit();
}
