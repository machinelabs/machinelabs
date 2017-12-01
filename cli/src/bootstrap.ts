let program = require('commander');
let package = require('../package.json');

program
  .version(package.version);

program
  .command('login')
  .description('Login to MachineLabs')
  .action((env, options) => {
    console.log('Logging in to MachineLabs...');
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}