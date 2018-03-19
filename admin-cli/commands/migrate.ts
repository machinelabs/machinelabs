import * as process from 'process';
import * as path from 'path';
import * as chalk from 'chalk';
import { createDb } from '../lib/create-db';
import { getEnv } from '../lib/get-env';

const hasArgsForMigrate = argv =>
  argv.cfg &&
  argv.cfg.firebase.privateKeyEnv &&
  argv.cfg.firebase.clientEmailEnv &&
  argv.cfg.firebase.databaseUrl &&
  argv.file;

const migrate = argv => {
  const fbPrivateKey = getEnv(argv.cfg.firebase.privateKeyEnv);
  const fbClientEmail = getEnv(argv.cfg.firebase.clientEmailEnv);
  const fbDatabaseUrl = argv.cfg.firebase.databaseUrl;

  const db = createDb(fbPrivateKey, fbClientEmail, fbDatabaseUrl);
  const file = path.resolve(argv['file']);

  console.log(chalk.green(`Executing migration ${argv['file']}`));

  require(file)(db, argv).then(
    _ => {
      console.log(chalk.green('Finished!'));
      process.exit(0);
    },
    err => {
      console.log(chalk.red(err));
      process.exit(1);
    }
  );
};

const check = argv => {
  if (argv._.includes('migrate') && !hasArgsForMigrate(argv)) {
    throw new Error(
      'Command needs `cfg.firebase.privateKeyEnv`, `cfg.firebase.clientEmailEnv`, `cfg.firebase.databaseUrl` and `file`'
    );
  }
};

export const migrateCommand = {
  run: migrate,
  check: check
};
