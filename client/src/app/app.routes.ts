import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'editor'
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
    path: ':id',
    pathMatch: 'full',
    redirectTo: 'editor/:id',
  },
  {
    path: 'user/:userId',
    loadChildren: './user-profile/user-profile.module#UserProfileModule'
  },
  {
    path: '**',
    redirectTo: 'editor'
  }
];
