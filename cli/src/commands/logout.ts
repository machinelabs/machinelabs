import program = require('commander');
import * as chalk from 'chalk';
import { logout } from '../lib/auth/auth';

program
  .command('logout')
  .description('Log the CLI out from MachineLabs')
  .action(() => {
    logout().subscribe(() => {
      console.log(chalk.default.green.bold('Successfully logged out. See you next time 👋'));
      process.exit();
    });
  });
