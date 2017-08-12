import { createDb } from '../lib/create-db';
import { getEnv } from '../lib/get-env';
import { ObservableDbRef } from '@machinelabs/core';
import { Observable } from '@reactivex/rxjs';

export function onboard (argv) {
  if (argv.cfg.target.fbPrivateKeyEnv && argv.cfg.target.fbClientEmailEnv && argv.cfg.target.fbDatabaseUrl) {
    let fbPrivateKey = getEnv(argv.cfg.target.fbPrivateKeyEnv);
    let fbClientEmail = getEnv(argv.cfg.target.fbClientEmailEnv);
    let fbDatabaseUrl = argv.cfg.target.fbDatabaseUrl;

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
