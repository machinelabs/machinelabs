import program = require('commander');
import * as chalk from 'chalk';
import { writeFileSync } from 'fs';
import { readLabDirectory, getMlYamlFromPath, ML_YAML, ML_YAML_FILENAME } from '@machinelabs/core';
import { DEFAULT_ENTRY_POINT, DEFAULT_ENTRY_POINT_CONTENT } from '@machinelabs/core';
import { guardFileExists } from '../lib/fs/fs';

program
  .command('init')
  .description('Initialize current directory as lab')
  .option('-f --force', `Overwrite ${ML_YAML_FILENAME} if it already exists`)
  .option(
    '-d --dry',
    'Run through without making any changes. Will list all files that would have been created when running `ml init`'
  )
  .action(cmd => {
    guardFileExists(ML_YAML_FILENAME, cmd.force);
    guardFileExists(DEFAULT_ENTRY_POINT, cmd.force);

    const files: Array<{ path: string; data: string }> = [
      { path: ML_YAML_FILENAME, data: ML_YAML },
      { path: DEFAULT_ENTRY_POINT, data: DEFAULT_ENTRY_POINT_CONTENT }
    ];

    let output = '';

    files.forEach(file => {
      if (!cmd.dry) {
        writeFileSync(file.path, file.data);
      }
      output += `  ${chalk.default.green('created')} ${file.path}\n`;
    });

    console.log(output);

    if (cmd.dry) {
      console.log(chalk.default.yellow('NOTE: Run with "dry run" no changes were made.'));
    } else {
      console.log(chalk.default.green.bold('Lab successfully created.'));
    }

    process.exit();
  });
