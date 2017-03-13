import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ApiServicesModule} from '../api/_module';
import {SharedModule} from '../shared/_module';
import {LabBrowserModule} from '../lab-browser/_module';
import {LabModule} from '../lab/_module';

import {APP_ROUTES} from './app.routes';
import {AppComponent} from '../main/app.component';

/**
 * Root module for the MachineLabs Client
 */
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(APP_ROUTES),
    ApiServicesModule,
    LabModule,
    SharedModule,
    LabBrowserModule
  ],
  bootstrap: [AppComponent]
})
export class MainModule {
}
