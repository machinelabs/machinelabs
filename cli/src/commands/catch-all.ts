import program = require('commander');
import * as chalk from 'chalk';
import { writeFileSync, existsSync } from 'fs';
import { readLabDirectory, getMlYamlFromPath, ML_YAML, ML_YAML_FILENAME } from '@machinelabs/core';

program.command('*').action(() => {
  console.log(chalk.default.yellow(`Invalid command. Here's some help to get you started`));
  program.outputHelp();
  process.exit(1);
});
