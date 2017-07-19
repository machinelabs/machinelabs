import { Routes } from '@angular/router';
import { EditorViewComponent } from './editor-view/editor-view.component';
import { LabResolver } from './lab.resolver';
import { HasValidExecutionGuard } from './has-valid-execution.guard';
import { HasRunningExecutionGuard } from './has-running-execution.guard';


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
    canActivate: [HasValidExecutionGuard],
    canDeactivate: [HasRunningExecutionGuard]
  },
  {
    path: ':id/:executionId',
    component: EditorViewComponent,
    resolve: {
      lab: LabResolver
    },
    canActivate: [HasValidExecutionGuard],
    canDeactivate: [HasRunningExecutionGuard]
  }
];
