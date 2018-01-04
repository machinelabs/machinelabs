let program = require('commander');
let pgk = require('../package.json');

import './firebase/fb';

import './commands/login'
import './commands/save';
import './commands/init';

program
  .version(pgk.version);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}