import { UserResolver, UserLabsResolver } from './user-profile/user.resolver';
import { Routes } from '@angular/router';

import { EditorViewComponent } from './editor-view/editor-view.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LabResolver } from './lab.resolver';

export const APP_ROUTES: Routes = [
  {
    component: EditorViewComponent,
    path: '',
    resolve: {
      lab: LabResolver
    }
  },
  {
    path: 'user/:userId',
    loadChildren: './user-profile/user-profile.module#UserProfileModule'
  },
  {
    path: ':labid',
    component: EditorViewComponent,
    resolve: {
      lab: LabResolver
    }
  }
];
