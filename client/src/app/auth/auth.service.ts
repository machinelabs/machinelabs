import { LoginUser } from '../models/user';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

export abstract class AuthService {
  abstract requireAuth(): Observable<LoginUser>;
  abstract requireAuthOnce(): Observable<LoginUser>;
  abstract signOut(): Observable<any>;
  abstract signInWithCredential(credential: firebase.auth.AuthCredential): Observable<LoginUser>;
  abstract linkOrSignInWithGitHub(): Observable<LoginUser>;
}
