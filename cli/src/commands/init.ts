let program = require('commander');
import * as chalk from 'chalk';
import { writeFileSync } from 'fs';
import { readLabDirectory, getMlYamlFromPath, ML_YAML, DEFAULT_READ_OPTIONS } from '@machinelabs/core';

program
.command('init')
.description('Initialize current directory as lab')
.option('-f --force', 'Overwrite ml.yaml if it already exists')
.action(cmd => {
  let config = getMlYamlFromPath('.', DEFAULT_READ_OPTIONS);

  if (config && !cmd.force) {
    console.error(chalk.default.red('ml.yaml already exists. Run `ml init --force` if you intend to overwrite ml.yaml with default settings'));
    process.exit(1);
  }

  writeFileSync('ml.yaml', ML_YAML);
  process.exit();
});