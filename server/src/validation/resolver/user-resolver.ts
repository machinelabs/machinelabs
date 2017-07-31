import { Observable } from '@reactivex/rxjs'
import { Resolver } from "validation/resolver/resolver";
import { DbRefBuilder } from '../../ml-firebase';
import { Invocation } from "models/invocation";

export class UserResolver implements Resolver {

  resolve(invocation: Invocation) {
    return new DbRefBuilder()
        .userRef(invocation.user_id)
        .onceValue()
        .map(snapshot => snapshot.val());
  }
}