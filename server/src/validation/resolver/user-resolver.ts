import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Resolver } from './resolver';
import { dbRefBuilder } from '../../ml-firebase';
import { Invocation } from '@machinelabs/models';

export class UserResolver implements Resolver {

  resolve(invocation: Invocation) {
    return dbRefBuilder
            .userRef(invocation.user_id)
            .onceValue()
            .pipe(
              map(snapshot => snapshot.val())
            );
  }
}
