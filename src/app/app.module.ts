import * as firebase from 'firebase';

import { WindowRef } from './window-ref.service';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, PreloadAllModules } from '@angular/router';

import { SharedModule } from './shared.module';

import { LabStorageService } from './lab-storage.service';
import { LabTemplateService, InMemoryLabTemplateService } from './lab-template.service';
import { UserService } from 'app/user/user.service';
import { AuthService, FirebaseAuthService, OfflineAuthService } from './auth';

import { AppComponent } from './app.component';

import { APP_ROUTES } from './app.routes';

import { environment } from '../environments/environment';
import { DATABASE } from './app.tokens';
import { DbRefBuilder } from './firebase/db-ref-builder';


// We need to export this factory function to make AoT happy
export function databaseFactory() {
  return firebase.initializeApp(environment.firebaseConfig).database();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedModule,
    RouterModule.forRoot(APP_ROUTES, { preloadingStrategy: PreloadAllModules }),
  ],
  providers: [
    LabStorageService,
    { provide: LabTemplateService, useClass: InMemoryLabTemplateService },
    UserService,
    DbRefBuilder,
    { provide: DATABASE, useFactory: databaseFactory },
    { provide: AuthService, useClass: environment.offline ? OfflineAuthService : FirebaseAuthService },
    WindowRef
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
