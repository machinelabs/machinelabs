import { createDb } from '../lib/create-db';
import { getEnv } from '../lib/get-env';
import { ObservableDbRef } from '@machinelabs/core';
import { map, filter } from 'rxjs/operators';
import { factory } from '../lib/execute';

let execute = factory({displayErrors: true});

const hasArgsForOnboard = argv => argv.cfg &&
                                  argv.cfg.firebase.privateKeyEnv &&
                                  argv.cfg.firebase.clientEmailEnv &&
                                  argv.cfg.firebase.databaseUrl;

const exportUsers = (argv) => {
  if (hasArgsForOnboard(argv)) {
    let fbPrivateKey = getEnv(argv.cfg.firebase.privateKeyEnv);
    let fbClientEmail = getEnv(argv.cfg.firebase.clientEmailEnv);
    let fbDatabaseUrl = argv.cfg.firebase.databaseUrl;

    let db = createDb(fbPrivateKey, fbClientEmail, fbDatabaseUrl);

    console.log('Exporting users. Abort any time.')
    execute('rm -rf user_export.csv');
    execute('touch user_export.csv');

    new ObservableDbRef(db.ref('/users'))
      .childAdded()
      .pipe(
        map(snapshot => snapshot.val()),
        filter(val => !!val && val.plan)
      )
      .subscribe(val => {
        console.log(`Exporting ${val.common.displayName}\t${val.common.email}`)
        execute(`echo "${val.common.displayName}\t${val.common.email}" >> user_export.csv`);
      }, e => {
        console.error(e);
      },() => {
        console.log('Finished');
      });
  }
}

const check = argv => {
  if (argv._.includes('export-users') && !hasArgsForOnboard(argv)) {
    throw new Error('Command needs `cfg.firebase.privateKeyEnv`, `cfg.firebase.clientEmailEnv` and `cfg.firebase.databaseUrl`');
  }
};

export const exportUsersCommand = {
  run: exportUsers,
  check: check
};