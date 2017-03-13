import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {AUTH_SERVICE_PROVIDER} from './auth/auth.service.provider';
import {FIREBASE_DATABASE_PROVIDER} from './firebase/firebase.database';


/**
 * Root module for the MachineLabs Client API
 */
@NgModule({
  imports: [
    HttpModule
  ],
  providers : [
    FIREBASE_DATABASE_PROVIDER,
    AUTH_SERVICE_PROVIDER
  ]
})
export class ApiServicesModule { }
