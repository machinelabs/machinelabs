import { Routes } from '@angular/router';
import { EditorViewComponent } from './editor-view/editor-view.component';

export const APP_ROUTES: Routes = [
  { component: EditorViewComponent, path: '' },
  { component: EditorViewComponent, path: ':labid' }
]