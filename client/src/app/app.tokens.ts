import * as firebase from 'firebase';
import { InjectionToken } from '@angular/core';

export const DATABASE = new InjectionToken<firebase.database.Database>('Database');
export const REST_API_URL = new InjectionToken<string>('Rest API URL');
