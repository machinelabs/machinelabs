import { Routes } from '@angular/router';
import { EmbeddedEditorViewComponent } from './embedded-editor-view/embedded-editor-view.component';
import { LabResolver } from '../lab.resolver';

export const EMBEDDED_EDITOR_ROUTES: Routes = [
  {
    path: '',
    component: EmbeddedEditorViewComponent,
    resolve: {
      lab: LabResolver
    }
  },
  {
    path: ':id',
    component: EmbeddedEditorViewComponent,
    resolve: {
      lab: LabResolver
    }
  },
  {
    path: ':id/:executionId',
    component: EmbeddedEditorViewComponent,
    resolve: {
      lab: LabResolver
    }
  }
];
