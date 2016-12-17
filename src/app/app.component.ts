import { Component } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/scan';

@Component({
  selector: 'ml-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  output: Observable<string>;
  subscription: any;
  sidebarToggled = false;

  // this is just temporary until we have proper models
  code = `import numpy as np
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

print model.predict(training_data).round()`;

  constructor (private apiService: ApiService) {
    apiService.init();
  }

  runCode (code: string) {

    // Scan the notifications and build up a string with line breaks
    // Don't make this a manual subscription without dealing with 
    // Unsubscribing. The returned Observable may not auto complete
    // in all scenarios.
    this.output = this.apiService.runCode(code)
                      .scan((acc, current) => `${acc}\n${current}`, '');
  }

  toggleSidebar() {
    this.sidebarToggled = !this.sidebarToggled;
  }

  log(value) {
    console.log(value);
  }
}
