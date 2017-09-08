import { LoginUser } from '../models/user';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';

export abstract class AuthService {
  abstract requireAuth(): Observable<LoginUser>;
  abstract requireAuthOnce(): Observable<LoginUser>;
  abstract signOut(): Observable<any>;
  abstract signInWithGitHub(): Observable<LoginUser>;
  abstract linkOrSignInWithGitHub(): Observable<LoginUser>;
  abstract sendEmailVerification(): Observable<any>;
}

