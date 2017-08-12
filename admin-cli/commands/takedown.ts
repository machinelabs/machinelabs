import { createDb } from '../lib/create-db';
import { getEnv } from '../lib/get-env';
import { checkExecutions } from '../lib/check-executions'

export function takedown (argv) {
  if (argv.cfg.target.fbPrivateKeyEnv && argv.cfg.target.fbClientEmailEnv && argv.cfg.target.fbDatabaseUrl) {
    let fbPrivateKey = getEnv(argv.cfg.target.fbPrivateKeyEnv);
    let fbClientEmail = getEnv(argv.cfg.target.fbClientEmailEnv);
    let fbDatabaseUrl = argv.cfg.target.fbDatabaseUrl;

    let db = createDb(fbPrivateKey, fbClientEmail, fbDatabaseUrl);
    checkExecutions(db)
  }
}
