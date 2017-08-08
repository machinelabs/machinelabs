import { LoginUser } from '../models/user';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';

export abstract class AuthService {
  abstract requireAuth(): Observable<LoginUser>;
  abstract requireAuthOnce(): Observable<LoginUser>;
  abstract signOut(): Observable<any>;
  abstract signIn(provider: firebase.auth.AuthProvider): Observable<LoginUser>;
  abstract linkOrSignIn(provider: firebase.auth.AuthProvider): Observable<LoginUser>;
  abstract linkWithPopup(provider: firebase.auth.AuthProvider): Observable<LoginUser>;
  abstract link(provider: firebase.auth.AuthProvider): Observable<LoginUser>;
  abstract unlink(providerId: string): Observable<LoginUser>;
}
