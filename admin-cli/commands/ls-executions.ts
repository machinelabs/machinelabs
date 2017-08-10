import { createDb } from '../lib/create-db';
import { getEnv } from '../lib/get-env';
import { ObservableDbRef } from '@machinelabs/core';

export function ls (argv) {
  if (argv.cfg.target.fbPrivateKeyEnv && argv.cfg.target.fbClientEmailEnv && argv.cfg.target.fbDatabaseUrl) {
    let fbPrivateKey = getEnv(argv.cfg.target.fbPrivateKeyEnv);
    let fbClientEmail = getEnv(argv.cfg.target.fbClientEmailEnv);
    let fbDatabaseUrl = argv.cfg.target.fbDatabaseUrl;

    let db = createDb(fbPrivateKey, fbClientEmail, fbDatabaseUrl);

    new ObservableDbRef(db.ref('/idx/user_executions'))
      .childAdded()
      .subscribe(snapshot => {
        let val = snapshot.val();

        if (val && val.live){
          
        }
      });
    
    console.log('foo');
    //process.stdin.resume();
    //loginServer(argv.cfg.target.googleProjectId, argv.cfg.target.zone, argv.cfg.target.serverName);
  }
}
