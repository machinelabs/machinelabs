import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { configstore } from '../../configstore';

export const loginFromCache = () =>
  fromPromise(
    firebase
      .auth()
      .signInWithCustomToken(configstore.get('lastToken'))
      .catch(e => console.error('Authentication failed. Try logging in again with `ml login`'))
  );


export const loginAndCache = (customToken: string) => {
  configstore.set('lastToken', customToken);
  return loginFromCache();
};

