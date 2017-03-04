import { User } from '../models/user';
import { Observable } from 'rxjs/Observable';

export abstract class AuthService {
  abstract authenticate(): Observable<User>;
}



