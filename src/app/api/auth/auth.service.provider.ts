import {AuthService} from './auth.service';
import {OfflineAuthService} from './offline-auth.service';
import {FirebaseAuthService} from '../firebase/firebase-auth.service';
import {environment} from '../../../environments/environment';

export const AUTH_SERVICE_PROVIDER = {
  provide: AuthService,
  useClass: environment.offline ? OfflineAuthService : FirebaseAuthService
};
