import { Routes } from '@angular/router';
import { EditorViewComponent } from './editor-view/editor-view.component';
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
    component: EditorViewComponent,
    path: ':labid',
    resolve: {
      lab: LabResolver
    }
  }
];