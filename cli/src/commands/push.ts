let program = require('commander');
import * as chalk from 'chalk';
import * as firebase from 'firebase';
import * as shortid from 'shortid';
import isString = require('lodash.isstring');
import { existsSync } from 'fs';
import { switchMap, map, tap } from 'rxjs/operators';

import { refBuilder } from '../firebase/fb';
import { Lab, LabDirectory, instanceOfFile } from '@machinelabs/models';
import { LabApi, readLabDirectory, parseMlYamlFromPath, ML_YAML_FILENAME } from '@machinelabs/core';
import { writeMlYamlToPath, writeMlYaml } from '@machinelabs/core';
import { configstore } from '../configstore';
import { loginFromCache } from '../lib/auth/auth';
import { environment } from '../environments/environment';

program
  .command('push')
  .description('Push current directory as a lab ')
  .option('-i --id [id]', 'Specify lab id to push to an existing lab')
  .option('-d --description [description]', 'Specify lab description')
  .option('-n --name [name]', 'Specify lab name')
  .action(cmd => {

    let parsedMlYaml = parseMlYamlFromPath('.');

    if (!parsedMlYaml) {
      console.error(chalk.default.red(`No ${ML_YAML_FILENAME} found. Run \`ml init\` to create one with default settings`));
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

    loginFromCache()
      .pipe(
        switchMap(res => refBuilder
          .labRef(id)
          .onceValue()
          .pipe(
            map(snapshot => snapshot.val()),
            map((lab: Lab) => {

              if (!lab) {
                lab = {
                  id: id,
                  directory: dir,
                  user_id: res.uid,
                  name: isString(cmd.name) ? cmd.name : 'Untitled',
                  description: isString(cmd.description) ? cmd.description : '',
                  tags: [],
                  created_at: Date.now(),
                  modified_at: Date.now(),
                  hidden: false,
                  is_private: false
                };
              } else if (lab.user_id !== res.uid) {
                console.error(`Can't write to lab from another user`);
                process.exit(1);
              }

              // We can't use `cmd.something || 'something'` here because of the way commander
              // handles these flags.
              lab.name = isString(cmd.name) ? cmd.name : lab.name;
              lab.description = isString(cmd.description) ? cmd.description : lab.description;
              lab.directory = dir;

              return lab;
            }),
            tap(lab => {
              const dir = './';
              const labConfig = parseMlYamlFromPath(dir);

              labConfig.cli = labConfig.cli || {};

              if (!labConfig.cli.id) {
                labConfig.cli.id = id;
                writeMlYamlToPath(dir, writeMlYaml(labConfig));
                console.log(`  ${chalk.default.green('updated')} ${ML_YAML_FILENAME}\n`);
              }
            })
          )
        ),
        switchMap(lab => labApi.save(lab).pipe(map(_ => lab)))
      )
      .subscribe(lab => {
        console.log(chalk.default.green.bold(`Pushed to ${environment.mlDomain}/editor/${lab.id}`));
        process.exit();
      }, e => {
        console.error('Push failed. Try logging in again with `ml login`');
        process.exit(1);
      });
  });
