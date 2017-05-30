#!/usr/bin/env node
const chalk = require('chalk');
const execute = require('./execute')();

console.log(chalk.green('Building app...'));
execute('ng build --environment=prod');
console.log(chalk.green('Deploying to staging...'));
execute('firebase use staging');
execute('firebase deploy');
console.log(chalk.green('Everything live at staging.machinelabs.ai'));

