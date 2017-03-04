import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OfflineAuthService {

  authenticate(): Observable<User> {
    const user = {
      uid: 'some unique id',
      displayName: 'Tony Stark',
      email: 'tony@starkindustries.com',
      isAnonymous: true,
      photoUrl: null
    };

    return Observable.fromPromise(new Promise(resolve => resolve(user)));
  }
}