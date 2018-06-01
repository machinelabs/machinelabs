import { Component, OnInit, Input } from '@angular/core';
import { Execution } from '../../models/execution';
import { ExecutionStatus } from '@machinelabs/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'ml-execution-status',
  templateUrl: './execution-status.component.html',
  styleUrls: ['./execution-status.component.scss']
})
export class ExecutionStatusComponent {
  @Input() execution = null as Observable<Execution>;
  ExecutionStatus = ExecutionStatus;
}
