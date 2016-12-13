import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as shortid from 'shortid';

import { Lab } from './models/lab';

declare let firebase: any;

@Injectable()
export class LabStorageService {

  constructor() {

    // Non of this is sensitive. It will be all in the public client.
    // No need to hide it from the repository
    var config = {
      apiKey: "AIzaSyDu0Qds2fWo8iZMcCj0T_ANqD9V4E0_9QY",
      authDomain: "machinelabs-a73cd.firebaseapp.com",
      databaseURL: "https://machinelabs-a73cd.firebaseio.com",
      storageBucket: "machinelabs-a73cd.appspot.com",
      messagingSenderId: "351438476852"
    };
    firebase.initializeApp(config);

    let authPromise = new Promise(resolve => firebase.auth().onAuthStateChanged(resolve))
                      .then(user => user ? user : firebase.auth().signInAnonymously());

    this.login$ = Observable.fromPromise(authPromise).publishLast().refCount();
  }

  login$: Observable<any>;

  createLab(): Lab {
    return {
      id: shortid.generate(),
      // TODO: we may wanna change the return type to Observable<Lab> and prefill with userId
      userId: '',
      code: `import numpy as np
from keras.models import Sequential
from keras.layers.core import Dense

# the four different states of the XOR gate
training_data = np.array([[0,0],[0,1],[1,0],[1,1]], "float32")

# the four expected results in the same order
target_data = np.array([[0],[1],[1],[0]], "float32")

model = Sequential()
model.add(Dense(16, input_dim=2, activation='relu'))
model.add(Dense(1, activation='sigmoid'))

model.compile(loss='mean_squared_error',
              optimizer='adam',
              metrics=['binary_accuracy'])

model.fit(training_data, target_data, nb_epoch=500, verbose=2)

print model.predict(training_data).round()`
    };
  }

  getLab(id: string): Observable<Lab> {
    return this.login$
      .switchMap(_ => Observable.fromPromise(firebase.database().ref(`labs/${id}`).once('value')))
      .map((snapshot: any) => snapshot.val());
  }

  saveLab(lab: any): Observable<any> {
    return this.login$
      .switchMap((login: any) => {
        let res = firebase.database().ref(`labs/${lab.id}`).set({
          id: lab.id,
          user_id: login.uid,
          code: lab.code
        });
        return Observable.fromPromise(res);
      });
  }

}
