import { Routes } from '@angular/router';
import { EditorViewComponent } from './editor-view/editor-view.component';
import { LabResolver } from './lab.resolver';
import { HasExecutionGuard } from './has-execution.guard';


export const ROUTES: Routes = [
  {
    path: '',
    component: EditorViewComponent,
    resolve: {
      lab: LabResolver
    }
  },
  {
    path: ':id',
    component: EditorViewComponent,
    resolve: {
      lab: LabResolver
    },
    canActivate: [HasExecutionGuard]
  },
  {
    path: ':id/:executionId',
    component: EditorViewComponent,
    resolve: {
      lab: LabResolver
    }
  }
];
