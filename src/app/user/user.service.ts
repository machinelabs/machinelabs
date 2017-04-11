import { Injectable } from '@angular/core';
import { AuthService } from 'app/auth';
import { DbRefBuilder } from '../firebase/db-ref-builder';
import { LoginUser, User } from '../models/user';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {

  constructor(private db: DbRefBuilder, private authService: AuthService) { }

  createUserIfMissing(): Observable<User> {
    return this.authService
               .requireAuthOnce()
               .switchMap((user: LoginUser) => this.db.userRef(user.uid)
                                                      .onceValue()
                                                      .map(snapshot => snapshot.val())
                                                      .map(existingUser => ({existingUser, user})))
                // TODO: if the user exists but the provider changed, update it
               .switchMap(data => !data.existingUser
                                    ? this.saveUser(this.createUserFromLoginUser(data.user))
                                    : Observable.of(data.existingUser));
  }

  createUserFromLoginUser(fromUser: LoginUser): User {
    return {
      id: fromUser.uid,
      displayName: fromUser.displayName,
      email: fromUser.email,
      isAnonymous: fromUser.isAnonymous,
      photoUrl: fromUser.photoURL || null
    };
  }

  saveUser(user: User) {
    return this.authService.requireAuthOnce()
                           .switchMap(_ => this.db.userRef(user.id).set(user))
                           .map(_ => user);
  }

  getUser(id: string): Observable<User> {
    return this.authService.requireAuthOnce()
                           .switchMap(_ => this.db.userRef(id).onceValue())
                           .map(snapshot => snapshot.val());

  }

}
