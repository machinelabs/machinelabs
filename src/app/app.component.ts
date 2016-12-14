import { Component } from '@angular/core';
import { ApiService } from './api.service';
import 'rxjs/add/operator/scan';

const SIDEBAR_FLEX_HIDDEN_VALUE = '0';
const SIDEBAR_FLEX_SHOWN_VALUE = '25';

@Component({
  selector: 'ml-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  output = null;
  subscription: any;
  sidebarFlexWith = SIDEBAR_FLEX_SHOWN_VALUE;

  // this is just temporary until we have proper models
  code = `
import numpy as np
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

print model.predict(training_data).round()
  `;

  constructor (private apiService: ApiService) {
    apiService.init();
  }

  runCode (code: string) {

    // Our service returns an Observable<string> but we rather like to
    // have an Observable<Array<string>> so that we can use the ngFor + async pipe
    // which saves us the manually book-keeping of subscriptions, hence the scan.

    this.apiService.runCode(code)
        .scan((acc, current) => [...acc, current], [])
        .subscribe((output) => {
          this.output = output.join('\n');
        });
  }

  toggleSidebar() {
    this.sidebarFlexWith === SIDEBAR_FLEX_SHOWN_VALUE ?
      this.sidebarFlexWith = SIDEBAR_FLEX_HIDDEN_VALUE :
      this.sidebarFlexWith = SIDEBAR_FLEX_SHOWN_VALUE;
  }

  log(value) {
    console.log(value);
  }
}
