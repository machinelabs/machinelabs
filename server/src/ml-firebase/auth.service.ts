import * as firebase from 'firebase';
import { Observable } from '@reactivex/rxjs';
import { Config } from '../util/config';

export class AuthService {

  private login$: Observable<any>;

  authenticate(): Observable<any> {
    if (!this.login$) {
      this.login$ = Observable.fromPromise(new Promise(resolve => firebase.auth().onAuthStateChanged(resolve))
                                .then(user => user ? user : firebase.auth()
                                                                    .signInWithEmailAndPassword(
                                                                      Config.getEnv(Config.ENV_USERNAME),
                                                                      Config.getEnv(Config.ENV_PASSWORD)
                                                                    ))
                              )
                              .publishLast()
                              .refCount();
    }

    return this.login$;
  }
}