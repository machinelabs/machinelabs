import { UserProfileComponent } from './user-profile.component';
import { UserResolver, UserLabsResolver } from './user.resolver';

export const USER_PROFILE_ROUTES = [{
  path: '',
  component: UserProfileComponent,
  resolve: {
    user: UserResolver,
    labs: UserLabsResolver
  }
}];
