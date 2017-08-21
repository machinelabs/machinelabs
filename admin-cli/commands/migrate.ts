import * as process from 'process';
import * as path from 'path';
import * as chalk from 'chalk';
import { createDb } from '../lib/create-db';
import { getEnv } from '../lib/get-env';

export function migrate(argv) {
  let fbPrivateKey = getEnv(argv.cfg.target.fbPrivateKeyEnv);
  let fbClientEmail = getEnv(argv.cfg.target.fbClientEmailEnv);
  let fbDatabaseUrl = argv.cfg.target.fbDatabaseUrl;

  let db = createDb(fbPrivateKey, fbClientEmail, fbDatabaseUrl);
  let file = path.resolve(argv['file']);

  console.log(chalk.green(`Executing migration ${argv['file']}`));

  require(file)(db, argv).then(_ => {
    console.log(chalk.green('Finished!'));
    process.exit(0);
  }, err => {
    console.log(chalk.red(err));
    process.exit(1);
  });
}
