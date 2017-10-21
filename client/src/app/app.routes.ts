import { Routes } from '@angular/router';

import { LandingPageComponent } from './landing-page/landing-page.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: './landing-page/landing-page.module#LandingPageModule'
  },
  {
    path: 'editor',
    loadChildren: './lab-editor/lab-editor.module#LabEditorModule',
  },
  {
    path: 'embedded',
    loadChildren: './embedded-editor/embedded-editor.module#EmbeddedEditorModule'
  },
  {
    path: 'user/:userId',
    loadChildren: './user-profile/user-profile.module#UserProfileModule'
  },
  {
    path: '**',
    redirectTo: '/'
  }
];
