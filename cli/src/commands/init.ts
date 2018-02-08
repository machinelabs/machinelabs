let program = require('commander');
import * as chalk from 'chalk';
import { writeFileSync, existsSync } from 'fs';
import { readLabDirectory, getMlYamlFromPath, ML_YAML, ML_YAML_FILENAME } from '@machinelabs/core';

program
.command('init')
.description('Initialize current directory as lab')
.option(`-f --force', 'Overwrite ${ML_YAML_FILENAME} if it already exists`)
.action(cmd => {
  let configExists = existsSync(ML_YAML_FILENAME);

  if (configExists && !cmd.force) {
    console.error(chalk.default.red(`${ML_YAML_FILENAME} already exists. Run \`ml init --force\` if you intend to overwrite ${ML_YAML_FILENAME} with default settings`));
    process.exit(1);
  }

  writeFileSync(ML_YAML_FILENAME, ML_YAML);
  process.exit();
});
