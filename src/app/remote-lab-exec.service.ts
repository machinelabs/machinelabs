import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Lab, ExecutionStatus, LabExecutionContext } from './models/lab';
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
  run (context: LabExecutionContext) : Observable<string> {

    this.socket.emit('run_code', {
      context
    });

    context.status = ExecutionStatus.Running;

    return this.subject
               .filter(msg => msg.context_id === context.id)
               // we want our Observables to complete when the remote code execution
               // is completed. Hence we wait for the `process_finished` event for
               // that particular process and complete the Observable through `takeWhile`
               .takeWhile(msg => !(msg.context_id === context.id 
                                 && (msg.event_type === 'process_finished' || msg.event_type === 'process_stopped')))
               .map(msg => msg.data)
               .finally(() => context.status = ExecutionStatus.Done)
  }

  stop (context: LabExecutionContext) {
    this.socket.emit('stop_code', {
      context
    });

    context.status = ExecutionStatus.Stopped;
  }

}
