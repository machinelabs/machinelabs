import { Component } from '@angular/core';
import { ApiService } from './api.service';
import 'rxjs/add/operator/scan';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  output: any;
  subscription: any;
  constructor (private apiService: ApiService) {
    apiService.init();
  }

  runCode (code: string) {

    // Our service returns an Observable<string> but we rather like to
    // have an Observable<Array<string>> so that we can use the ngFor + async pipe
    // which saves us the manually book-keeping of subscriptions, hence the scan.

    this.output = this.apiService.runCode(code)
                                 .scan((acc, current) => [...acc, current], [])
  }
}
