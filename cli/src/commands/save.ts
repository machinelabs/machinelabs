let program = require('commander');
import * as chalk from 'chalk';
import * as firebase from 'firebase';
import * as shortid from 'shortid';

import { existsSync } from 'fs';

import { refBuilder } from '../firebase/fb';
import { Lab, LabDirectory, instanceOfFile } from '@machinelabs/models';
import { LabApi, readLabDirectory, parseMlYamlFromPath } from '@machinelabs/core';
import { configstore } from '../configstore';
import { loginFromCache } from '../lib/auth/auth';
import { environment } from '../environments/environment';

program
.command('save')
.description('Save current directory as a lab')
.option('-i --id [id]', 'Specify lab id to save to')
.action(cmd => {

  let parsedMlYaml = parseMlYamlFromPath('.');

  if (!parsedMlYaml) {
    console.error(chalk.default.red('No ml.yaml found. Run `ml init` to create one with default settings'));
    process.exit(1);;
  }

  let cliOptions = parsedMlYaml.cli || {};
  let excludeRegex = cliOptions.exclude && cliOptions.exclude.length ? cliOptions.exclude : [];
  let id = cmd.id || cliOptions.id || shortid.generate();
  
  let readOptions = {
    exclude: excludeRegex,
    excludeBinaries: true,
    extensions: null
  };

  let dir = readLabDirectory('.', readOptions);

  if (!existsSync('main.py')) {
    console.error(chalk.default.red('No main.py found. Labs are currently required to use main.py as the program entry file.'));
    process.exit(1);
  }

  let labApi = new LabApi(refBuilder);

  // TODO: Make many of these configureable
  let lab: Lab = {
    id: id,
    directory: dir,
    user_id: '',
    name: '',
    description: '',
    tags: [],
    created_at: Date.now(),
    modified_at: Date.now(),
    hidden: false
  };

  loginFromCache()
    .switchMap(res => {
      lab.user_id = res.uid;
      return labApi.save(lab);
    })
    .subscribe(res => {
      console.log(chalk.default.green.bold(`Directory saved to ${environment.mlDomain}/editor/${lab.id}`));
      process.exit();
    }, e => {
      console.error('Save failed. Try logging in again with `ml login`');
      process.exit(1);
    });
});
