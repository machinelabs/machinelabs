import { Routes } from '@angular/router';
import { LabBrowserComponent } from '../lab-browser/lab-browser.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: LabBrowserComponent
  },
  { 
    path: ':labid',
    component: LabBrowserComponent
  }
];
