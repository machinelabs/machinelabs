import * as ConfigStore from 'configstore';
let pgk = require('../package.json');

export const configstore = new ConfigStore(pgk.name);