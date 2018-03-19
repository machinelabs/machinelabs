import program = require('commander');
import * as chalk from 'chalk';
import * as firebase from 'firebase';
import * as open from 'open';
import { refBuilder } from '../firebase/fb';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { switchMap, tap, filter, map } from 'rxjs/operators';
import { configstore } from '../configstore';
import { loginAndCache } from '../lib/auth/auth';
import { environment } from '../environments/environment';

program
  .command('login')
  .description('Login to MachineLabs')
  .action(cmd => {
    fromPromise(firebase.auth().signInAnonymously())
      .pipe(
        switchMap(res => {
          return refBuilder
            .handshakeRequestRef(res.uid)
            .update({ id: res.uid })
            .pipe(
              tap(_ => {
                console.log(
                  chalk.default.yellow(
                    `Opening default browser to login. Please accept request only if the ID shown in the browser matches: ${chalk.default.bold.green(
                      res.uid
                    )}`
                  )
                );
                open(`${environment.mlDomain}/handshake/${res.uid}`);
              }),
              switchMap(_ => refBuilder.handshakeRequestRef(res.uid).value()),
              map(snapshot => snapshot.val()),
              filter(val => val && !!val.token),
              // No need to keep this sensible information around longer than needed
              tap(val => refBuilder.handshakeRequestRef(res.uid).set(null))
            );
        }),
        switchMap(val => loginAndCache(val.token))
      )
      .subscribe(
        val => {
          // TODO: We need to move a couple of APIs from the client to @machinelabs/core
          // to unify the user data handling
          if (val.providerData && val.providerData.length) {
            console.log(chalk.default.green(`Successfully logged in as ${val.providerData[0].displayName}`));
          } else {
            console.log(chalk.default.green(`Successfully logged in with ${val.email}`));
          }

          process.exit();
        },
        error => {
          console.error(chalk.default.red('Login failed'));
          process.exit(1);
        }
      );
  });
