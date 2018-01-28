import * as firebase from 'firebase';
import * as chalk from 'chalk';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/Observable/fromPromise';
import { catchError } from 'rxjs/operators/catchError';
import { configstore } from '../../configstore';

export const loginFromCache = () =>
  fromPromise(firebase.auth().signInWithCustomToken(configstore.get('lastToken')))
  .pipe(
    catchError(error => {
      console.error(chalk.default.red('Authentication failed. Try logging in again with `ml login`'));
      return Observable.throw(error);
    })
  );

export const loginAndCache = (customToken: string) => {
  configstore.set('lastToken', customToken);
  return loginFromCache();
};
