import * as firebase from 'firebase';
import { InjectionToken } from '@angular/core';

export const DATABASE = new InjectionToken<firebase.database.Database>('Database');
export const TOP_PICKS = new InjectionToken<Array<string>>('TopPicksLabIds');
