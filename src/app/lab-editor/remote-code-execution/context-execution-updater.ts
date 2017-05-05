import { Observable } from 'rxjs/Observable';
import { ExecutionMessage } from '../../models/execution';
import { LabExecutionContext } from '../../models/lab';
import { DbRefBuilder } from '../../firebase/db-ref-builder';


/**
 * The ContextExecutionUpdate maintains a live connection to the `Execution`
 * in the firebase until the execution is completed (or fully replayed).
 * It's job is it to update the context with the right `Execution` as it changes.
 */
export class ContextExecutionUpdater {
  private _output: Observable<ExecutionMessage>;
  private _executionId: string;
  private _context: LabExecutionContext;

  constructor(private db: DbRefBuilder, context: LabExecutionContext) {
    this._context = context;
  }

  get output (){
    return this._output;
  }

  set output (val) {
    this._output = val;
    this.connect();
  }

  get executionId () {
    return this._executionId;
  }

  set executionId (val) {
    this._executionId = val;
    this.connect();
  }

  private connect() {
    if (this.output && this.executionId) {
      this.db.executionRef(this.executionId).value()
             .takeUntil(this.output.last())
             .map(snapshot => snapshot.val())
             .subscribe(execution => {
               this._context.execution = Object.assign(this._context.execution, execution);
              });
    }
  }
}
