import * as ConfigStore from 'configstore';
const pgk = require('../package.json');

export const configstore = new ConfigStore(pgk.name);
