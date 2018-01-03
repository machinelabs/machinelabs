let program = require('commander');
import * as chalk from 'chalk';
import * as firebase from 'firebase';
import * as shortid from 'shortid';

import { refBuilder } from '../firebase/fb';
import { Lab, LabDirectory, instanceOfFile } from '@machinelabs/models';
import { LabApi, readLabDirectory, getMlYamlFromLabDirectory, DEFAULT_READ_OPTIONS } from '@machinelabs/core';
import { configstore } from '../configstore';
import { loginFromCache } from '../lib/auth/auth';
import { environment } from '../environments/environment';

program
.command('import')
.description('Import current directory as lab')
.action(cmd => {
  let dir = readLabDirectory('.', DEFAULT_READ_OPTIONS);

  if (!dir || !getMlYamlFromLabDirectory(dir)) {
    console.error(chalk.default.red('No main.py found. Labs are currently required to use main.py as the program entry file.'));
  }

  let config = getMlYamlFromLabDirectory(dir);

  if (!config) {
    console.error(chalk.default.red('No ml.yaml found. Run `ml init` to create one with default settings'));
    return;
  }

  let labApi = new LabApi(refBuilder);

  // TODO: Make many of these configureable
  let lab: Lab = {
    id: shortid.generate(),
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
      console.log(chalk.default.green.bold(`Directory imported as ${environment.mlDomain}/editor/${lab.id}`));
      process.exit();
    }, e => {
      console.error('Import failed. Try logging in again with `ml login`');
      process.exit(1);
    });
});
