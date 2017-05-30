import { Injectable } from '@angular/core';
import { AuthService } from 'app/auth';
import { DbRefBuilder } from '../firebase/db-ref-builder';
import { LoginUser, User } from '../models/user';
import { Observable } from 'rxjs/Observable';
import { Lang } from '../util/lang';

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
               .switchMap(data => !data.existingUser || this.isDifferent(data.user, data.existingUser)
                                    ? this.saveUser(this.mapUserToLoginUser(data.user))
                                    : Observable.of(data.existingUser)
                                  );
  }

  private isDifferent(loginUser: LoginUser, user: User) {
    return Lang.isDifferent(user.email, loginUser.email) ||
           Lang.isDifferent(user.isAnonymous, loginUser.isAnonymous) ||
           Lang.isDifferent(user.photoUrl, this.getPhotoUrl(loginUser)) ||
           Lang.isDifferent(user.displayName, this.getDisplayName(loginUser));
  }

  userHasProviderData(loginUser: LoginUser) {
    return loginUser.providerData && loginUser.providerData.length;
  }

  getDisplayName (loginUser: LoginUser) {
    return this.userHasProviderData(loginUser) ? loginUser.providerData[0].displayName : loginUser.displayName;
  }

  getPhotoUrl (loginUser: LoginUser) {
    return this.userHasProviderData(loginUser) ? loginUser.providerData[0].photoURL : loginUser.photoURL;
  }

  mapUserToLoginUser(fromUser: LoginUser): User {
    return {
      id: fromUser.uid,
      displayName: this.getDisplayName(fromUser),
      email: fromUser.email,
      isAnonymous: fromUser.isAnonymous,
      photoUrl: this.getPhotoUrl(fromUser)
    };
  }

  saveUser(user: User): Observable<User> {
    return this.authService.requireAuthOnce()
                           .switchMap(_ => this.db.userRef(user.id).set(user))
                           .map(_ => user);
  }

  updateUser(user: User): Observable<User> {
    return this.authService.requireAuthOnce()
                           .switchMap(_ => this.db.userRef(user.id).update(user))
                           .map(_ => user);
  }

  getUser(id: string): Observable<User> {
    return this.authService.requireAuthOnce()
                           .switchMap(_ => this.db.userRef(id).onceValue())
                           .map(snapshot => snapshot.val());

  }

  observeUserChanges(): Observable<User> {
    return this.authService.requireAuth()
                           .map(loginUser => this.mapUserToLoginUser(loginUser));
  }

  isLoggedInUser(id: string): Observable <boolean> {
    return this.authService.requireAuthOnce()
                           .map(sessionUser => id === sessionUser.uid);
  };

}
