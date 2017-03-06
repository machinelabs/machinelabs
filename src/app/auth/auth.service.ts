import { User } from '../models/user';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';

export abstract class AuthService {
  abstract requireAuth(): Observable<User>;
  abstract requireAuthOnce(): Observable<User>;
  abstract signOut(): Observable<any>;
  abstract signInWithGitHub(): Observable<User>;
}

