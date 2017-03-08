import * as firebase from 'firebase';
import { InjectionToken } from '@angular/core';

export const DATABASE = new InjectionToken<firebase.database.Database>('Database');
