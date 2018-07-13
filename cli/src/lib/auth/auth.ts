import * as firebase from 'firebase';
import * as chalk from 'chalk';
import { Observable, defer, throwError, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { configstore } from '../../configstore';

export const loginFromCache = () =>
  from(firebase.auth().signInWithCustomToken(configstore.get('lastToken') || '')).pipe(
    catchError(error => {
      console.error(chalk.default.red('Authentication failed. Try logging in again with `ml login`'));
      return throwError(error);
    })
  );

export const loginAndCache = (customToken: string) => {
  configstore.set('lastToken', customToken);
  return loginFromCache();
};

export const logout = () =>
  defer(() => {
    configstore.delete('lastToken');
    return from(firebase.auth().signOut());
  });
