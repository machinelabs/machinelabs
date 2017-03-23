import { Component, OnInit, Input } from '@angular/core';
import { LabExecutionContext, ExecutionStatus } from '../models/lab';

@Component({
  selector: 'ml-execution-status',
  templateUrl: './execution-status.component.html',
  styleUrls: ['./execution-status.component.scss']
})
export class ExecutionStatusComponent {
  @Input() executionContext: LabExecutionContext;
  ExecutionStatus = ExecutionStatus;
}
