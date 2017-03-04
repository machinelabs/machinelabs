import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { User } from '../models/user';
import { Observable } from 'rxjs/Observable';
import { AuthService} from './auth.service';

@Injectable()
export class FirebaseAuthService extends AuthService {

  login$: Observable<User>;

  authenticate(): Observable<User> {

    if (!this.login$) {
      this.login$ = Observable.fromPromise(new Promise(resolve => firebase.auth().onAuthStateChanged(resolve))
                                .then(user => user ? user : firebase.auth().signInAnonymously())
                              )
                              .publishLast()
                              .refCount();
    }

    return this.login$;
  }
}