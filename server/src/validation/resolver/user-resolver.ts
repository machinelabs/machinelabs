import { Observable } from '@reactivex/rxjs';
import { Resolver } from './resolver';
import { dbRefBuilder } from '../../ml-firebase';
import { Invocation } from '@machinelabs/models';

export class UserResolver implements Resolver {

  resolve(invocation: Invocation) {
    return dbRefBuilder
            .userRef(invocation.user_id)
            .onceValue()
            .map(snapshot => snapshot.val());
  }
}
