import { Component, OnInit, Input } from '@angular/core';
import { Execution, ExecutionStatus } from '../../models/execution';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ml-execution-status',
  templateUrl: './execution-status.component.html',
  styleUrls: ['./execution-status.component.scss']
})
export class ExecutionStatusComponent {
  @Input() execution = null as Observable<Execution>;
  ExecutionStatus = ExecutionStatus;
}
