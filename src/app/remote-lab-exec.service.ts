import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Lab } from './models/lab';
import * as io from 'socket.io-client';

@Injectable()
export class RemoteLabExecService {

  private socket: any;
  private subject = new Subject<any>();

  constructor() { }

  /**
   * Sets up connection to the server.
   */
  init () {
      let socket = this.socket = io.connect('localhost:3030');
      socket.on('any', (data) => {
        this.subject.next(data);
        console.log(data);
      });
  }

  /**
   * Executes code on the server. Returns an Observable<string>
   * where `string` is each line that was printed to STDOUT.
   */
  run (lab: Lab) : Observable<string> {

    // ids need to be unique only across connection, so Date.now() should do it
    let uniqueId = Date.now();
    this.socket.emit('run_code', {
      id: uniqueId,
      lab: lab
    });

    return this.subject
               .filter(msg => msg.ref_id === uniqueId)
               // we want our Observables to complete when the remote code execution
               // is completed. Hence we wait for the `process_finished` event for
               // that particular process and complete the Observable through `takeWhile`
               .takeWhile(msg => !(msg.ref_id === uniqueId && msg.event_type === 'process_finished'))
               .map(msg => msg.data);
  }

}
