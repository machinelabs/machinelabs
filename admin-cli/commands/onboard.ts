import { createDb } from '../lib/create-db';
import { getEnv } from '../lib/get-env';
import { ObservableDbRef } from '@machinelabs/core';
import { Observable } from '@reactivex/rxjs';

const hasArgsForOnboard = argv => argv.cfg &&
                                  argv.cfg.firebase.privateKeyEnv &&
                                  argv.cfg.firebase.clientEmailEnv &&
                                  argv.cfg.firebase.databaseUrl;

const onboard = (argv) => {
  if (hasArgsForOnboard(argv)) {
    let fbPrivateKey = getEnv(argv.cfg.firebase.privateKeyEnv);
    let fbClientEmail = getEnv(argv.cfg.firebase.clientEmailEnv);
    let fbDatabaseUrl = argv.cfg.firebase.databaseUrl;

    let db = createDb(fbPrivateKey, fbClientEmail, fbDatabaseUrl);

    if (argv['dry-run']){
      console.log('Dry run Onboarding. Abort at any time:')
    } else {
      console.log(`Onboarding running. Abort at any time:`);
    }

    new ObservableDbRef(db.ref('/users'))
      .childAdded()
      .flatMap(snapshot => {
        let val = snapshot.val();

        if (val && !val.plan){

          if (argv['dry-run']){
            return Observable.of(snapshot.val())
          }

          return new ObservableDbRef(snapshot.ref).update({
            plan: {
              plan_id: 'beta',
              created_at: Date.now()
            }
          })
          .map(_ => snapshot.val())
        }

        return Observable.empty();
      })
      .subscribe(val => {
        console.log(`Onboarded user ${val.common.id} / ${val.common.email}`);
      }, e => {
        console.error(e);
      },() => {
        console.log('Finished');
      });
  }
}

const check = argv => {
  if (argv._.includes('onboard') && !hasArgsForOnboard(argv)) {
    throw new Error('Command needs `cfg.firebase.privateKeyEnv`, `cfg.firebase.clientEmailEnv` and `cfg.firebase.databaseUrl`');
  }
};

export const onboardCommand = {
  run: onboard,
  check: check
};